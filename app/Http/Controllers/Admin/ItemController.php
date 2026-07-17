<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Category;
use App\Models\Item;
use Exception;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use SoDe\Extend\Response;
use ZipArchive;

class ItemController extends BasicController
{
    public $reactView = 'Admin/Items';
    public $model = Item::class;
    public $imageFields = [];
    public $with4get = ['category'];

    public function setPaginationInstance(string $model)
    {
        return $model::with('category');
    }

    public function setReactViewProperties(Request $request)
    {
        return [
            'categories' => Category::query()
                ->whereNotNull('status')
                ->orderBy('name')
                ->get(['id', 'name']),
        ];
    }

    public function beforeSave(Request $request)
    {
        $id = $request->input('id');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'sku' => 'nullable|string|max:120',
            'category_id' => 'nullable|integer|exists:categories,id',
            'segment' => 'nullable|string|max:120',
            'classification' => 'nullable|string|max:160',
            'famcons' => 'nullable|string|max:160',
            'family' => 'nullable|string|max:160',
            'type' => 'nullable|string|max:60',
            'use_type' => 'nullable|string|max:120',
            'material' => 'nullable|string|max:120',
            'color' => 'nullable|string|max:60',
            'brand' => 'nullable|string|max:120',
            'unit' => 'nullable|string|max:20',
            'masterpack' => 'nullable|integer|min:0',
            'pieces' => 'nullable|string|max:20',
            'origin_country' => 'nullable|string|max:120',
            'description' => 'nullable|string|max:2000',
            'price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|in:PEN,USD',
            'pressure' => 'nullable|string|max:255',
            'diameter' => 'nullable|string|max:60',
            'nominal_diameter' => 'nullable|string|max:60',
            'diameters' => 'nullable|string',
            'package_type' => 'nullable|string|max:60',
            'perishable' => 'nullable|string|max:60',
            'hazardous' => 'nullable|string|max:60',
            'product_height' => 'nullable|numeric|min:0',
            'product_width' => 'nullable|numeric|min:0',
            'product_depth' => 'nullable|numeric|min:0',
            'product_weight' => 'nullable|numeric|min:0',
            'logistic_height' => 'nullable|numeric|min:0',
            'logistic_width' => 'nullable|numeric|min:0',
            'logistic_depth' => 'nullable|numeric|min:0',
            'logistic_weight' => 'nullable|numeric|min:0',
            'warranty' => 'nullable|string|max:2000',
            'features' => 'nullable|string|max:2000',
            'usage_recommendations' => 'nullable|string|max:2000',
            'observations' => 'nullable|string|max:2000',
            'usage_warning' => 'nullable|string|max:2000',
            'status' => 'nullable',
        ]);

        $validated['currency'] = $validated['currency'] ?? 'PEN';

        if (array_key_exists('status', $validated)) {
            $validated['status'] = in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0;
        } else {
            $validated['status'] = 1;
        }

        $validated['slug'] = Str::slug($validated['title']) ?: Str::slug('item-' . uniqid());

        $validated['diameters'] = collect(preg_split('/[\n,]+/', (string) $request->input('diameters', '')))
            ->map(fn ($value) => trim($value))
            ->filter()
            ->values()
            ->all();

        // Las imágenes de items se guardan en el disco público (storage/app/public/items)
        // para servirlas a través de storage:link (/storage/items/...).
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('items', 'public');
        }

        return [
            'id' => $id,
            ...$validated,
        ];
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        Cache::forget('tuboplast.catalog.facets');

        return null;
    }

    public function import(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();

        try {
            $request->validate([
                'file' => 'required|file|max:20480',
                'mode' => 'required|in:replace,upsert',
            ]);

            $file = $request->file('file');
            $extension = mb_strtolower($file->getClientOriginalExtension());

            $rows = match ($extension) {
                'xlsx' => $this->readXlsxRows($file->getRealPath()),
                'csv' => $this->readCsvRows($file->getRealPath()),
                default => throw new Exception('El archivo debe estar en formato .xlsx o .csv.'),
            };

            if (!count($rows)) {
                throw new Exception('No se encontraron filas para importar.');
            }

            $mode = (string) $request->input('mode');
            $result = DB::transaction(fn () => $this->importRows($rows, $mode), 3);

            Cache::forget('tuboplast.catalog.facets');

            $response->status = 200;
            $response->message = 'Carga masiva completada';
            $response->data = $result;
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    private function importRows(array $rows, string $mode): array
    {
        $categoryCache = [];
        $reservedSlugs = [];
        $seenSkus = [];
        $deleted = 0;
        $created = 0;
        $updated = 0;
        $skipped = 0;
        $errors = [];

        if ($mode === 'replace') {
            $deleted = Item::query()->count();
            Item::query()->delete();
        }

        foreach ($rows as $index => $raw) {
            $rowNumber = $index + 2;
            $norm = $this->normalizeRow($raw);
            $sku = $this->stringOrNull($this->getImportValue($norm, 'Codigo Producto'));

            if (!$sku) {
                $skipped++;
                $this->pushImportError($errors, "Fila {$rowNumber}: falta Codigo Producto.");
                continue;
            }

            $skuKey = mb_strtoupper($sku);
            if (isset($seenSkus[$skuKey])) {
                $skipped++;
                $this->pushImportError($errors, "Fila {$rowNumber}: SKU duplicado en el archivo ({$sku}).");
                continue;
            }
            $seenSkus[$skuKey] = true;

            $existing = $mode === 'upsert'
                ? Item::query()->where('sku', $sku)->first()
                : null;

            $data = $this->mapImportRow($norm, $sku, $categoryCache);
            $data['slug'] = $this->uniqueItemSlug($data['title'], $sku, $existing?->id, $reservedSlugs);

            if ($existing) {
                $existing->update($data);
                $updated++;
            } else {
                Item::create($data);
                $created++;
            }
        }

        if ($mode === 'replace' && $skipped > 0) {
            $detail = $errors[0] ?? 'Revisa el archivo antes de volver a intentar.';
            throw new Exception("Importacion completa cancelada: hay {$skipped} fila(s) omitidas. {$detail}");
        }

        if (($created + $updated) === 0) {
            throw new Exception('No se importo ningun item. Revisa que el archivo tenga la columna Codigo Producto.');
        }

        return [
            'mode' => $mode,
            'deleted' => $deleted,
            'created' => $created,
            'updated' => $updated,
            'skipped' => $skipped,
            'errors' => $errors,
        ];
    }

    private function mapImportRow(array $norm, string $sku, array &$categoryCache): array
    {
        $title = $this->stringOrNull($this->getImportValue($norm, 'Descripcion de Producto'))
            ?? ('Producto ' . $sku);
        $line = $this->stringOrNull($this->getImportValue($norm, 'FAMCONS'))
            ?? $this->stringOrNull($this->getImportValue($norm, 'FAMILIA'))
            ?? 'Productos';
        $category = $this->resolveImportCategory($line, $categoryCache);
        $nominal = $this->stringOrNull($this->getImportValue($norm, 'Diametro Nominal del Producto'));

        $currency = mb_strtoupper((string) ($this->getImportValue($norm, 'Moneda') ?? 'PEN'));
        $currency = in_array($currency, ['PEN', 'USD'], true) ? $currency : 'PEN';

        return [
            'category_id' => $category->id,
            'segment' => $this->stringOrNull($this->getImportValue($norm, 'SEGMENTO')),
            'famcons' => $this->stringOrNull($this->getImportValue($norm, 'FAMCONS')),
            'family' => $this->stringOrNull($this->getImportValue($norm, 'FAMILIA')),
            'classification' => $this->stringOrNull($this->getImportValue($norm, 'FAMILIA')),
            'type' => $this->stringOrNull($this->getImportValue($norm, 'TIPO')),
            'use_type' => $this->stringOrNull($this->getImportValue($norm, 'USO')),
            'material' => $this->stringOrNull($this->getImportValue($norm, 'Material')),
            'color' => $this->stringOrNull($this->getImportValue($norm, 'Color')),
            'brand' => $this->stringOrNull($this->getImportValue($norm, 'Marca')),
            'unit' => $this->stringOrNull($this->getImportValue($norm, 'Unidad de Medida')),
            'masterpack' => $this->intOrNull($this->getImportValue($norm, 'Masterpack')),
            'pieces' => $this->stringOrNull($this->getImportValue($norm, 'Numero de piezas')),
            'origin_country' => $this->stringOrNull($this->getImportValue($norm, 'Pais de origen')),
            'sku' => $sku,
            'title' => $title,
            'description' => $this->buildImportDescription($norm),
            'price' => $this->floatOrNull($this->getImportValue($norm, 'Precio Unitario')),
            'currency' => $currency,
            'pressure' => null,
            'diameter' => $nominal,
            'nominal_diameter' => $nominal,
            'diameters' => $nominal ? [$nominal] : [],
            'package_type' => $this->stringOrNull($this->getImportValue($norm, 'Tipo de empaque')),
            'perishable' => $this->stringOrNull($this->getImportValue($norm, 'Perecible')),
            'hazardous' => $this->stringOrNull($this->getImportValue($norm, 'Producto peligroso')),
            'product_height' => $this->floatOrNull($this->getImportValue($norm, 'Altura Del Producto')),
            'product_width' => $this->floatOrNull($this->getImportValue($norm, 'Ancho Del Producto')),
            'product_depth' => $this->floatOrNull($this->getImportValue($norm, 'Profundidad Del Producto')),
            'product_weight' => $this->floatOrNull($this->getImportValue($norm, 'Peso Del Producto Kg')),
            'logistic_height' => $this->floatOrNull($this->getImportValue($norm, 'Altura De La Unidad Logistica')),
            'logistic_width' => $this->floatOrNull($this->getImportValue($norm, 'Ancho De La Unidad Logistica')),
            'logistic_depth' => $this->floatOrNull($this->getImportValue($norm, 'Profundidad De La Unidad Logistica')),
            'logistic_weight' => $this->floatOrNull($this->getImportValue($norm, 'Peso De La Unidad Logistica')),
            'warranty' => $this->stringOrNull($this->getImportValue($norm, 'Garantia')),
            'features' => $this->stringOrNull($this->getImportValue($norm, 'Caracteristicas')),
            'usage_recommendations' => $this->stringOrNull($this->getImportValue($norm, 'Recomendaciones De Uso')),
            'observations' => $this->stringOrNull($this->getImportValue($norm, 'Observaciones')),
            'usage_warning' => $this->stringOrNull($this->getImportValue($norm, 'Advertencia de uso')),
            'status' => 1,
        ];
    }

    private function resolveImportCategory(string $line, array &$categoryCache): Category
    {
        if (isset($categoryCache[$line])) {
            return $categoryCache[$line];
        }

        $category = Category::firstOrCreate(
            ['name' => $line],
            ['description' => "Linea de productos: {$line}", 'status' => 1]
        );

        if ($category->status === null) {
            $category->update(['status' => 1]);
        }

        $categoryCache[$line] = $category;

        return $category;
    }

    private function uniqueItemSlug(string $title, string $sku, ?int $ignoreId, array &$reservedSlugs): string
    {
        $base = Str::slug($title) ?: Str::slug($sku) ?: ('item-' . Str::lower(Str::random(6)));
        $slug = $base;
        $suffix = 1;

        while (
            in_array($slug, $reservedSlugs, true)
            || Item::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '-' . (++$suffix);
        }

        $reservedSlugs[] = $slug;

        return $slug;
    }

    private function readXlsxRows(string $path): array
    {
        $zip = new ZipArchive();

        if ($zip->open($path) !== true) {
            throw new Exception('No se pudo abrir el archivo Excel.');
        }

        try {
            $sharedStrings = $this->readSharedStrings($zip);
            $sheetPath = $this->firstSheetPath($zip);
            $sheetXml = $zip->getFromName($sheetPath);

            if ($sheetXml === false) {
                throw new Exception('No se encontro una hoja valida dentro del Excel.');
            }

            $xml = simplexml_load_string($sheetXml);
            if ($xml === false) {
                throw new Exception('No se pudo leer la hoja del Excel.');
            }

            $xml->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
            $rows = [];

            foreach ($xml->xpath('//s:sheetData/s:row') ?: [] as $row) {
                $row->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
                $values = [];
                $nextColumn = 0;

                foreach ($row->xpath('s:c') ?: [] as $cell) {
                    $reference = (string) $cell['r'];
                    $column = $reference ? $this->columnIndexFromReference($reference) : $nextColumn;
                    $values[$column] = $this->readXlsxCellValue($cell, $sharedStrings);
                    $nextColumn = $column + 1;
                }

                $rows[] = $values;
            }

            return $this->gridToAssocRows($rows);
        } finally {
            $zip->close();
        }
    }

    private function readCsvRows(string $path): array
    {
        $sample = file_get_contents($path, false, null, 0, 4096) ?: '';
        $firstLine = strtok($sample, "\r\n") ?: '';
        $delimiter = substr_count($firstLine, ';') > substr_count($firstLine, ',') ? ';' : ',';
        $handle = fopen($path, 'r');

        if (!$handle) {
            throw new Exception('No se pudo abrir el archivo CSV.');
        }

        try {
            $rows = [];
            while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
                $rows[] = $row;
            }
            return $this->gridToAssocRows($rows);
        } finally {
            fclose($handle);
        }
    }

    private function readSharedStrings(ZipArchive $zip): array
    {
        $xmlText = $zip->getFromName('xl/sharedStrings.xml');
        if ($xmlText === false) {
            return [];
        }

        $xml = simplexml_load_string($xmlText);
        if ($xml === false) {
            return [];
        }

        $xml->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
        $strings = [];

        foreach ($xml->xpath('//s:si') ?: [] as $node) {
            $strings[] = $this->xmlText($node);
        }

        return $strings;
    }

    private function firstSheetPath(ZipArchive $zip): string
    {
        $workbookText = $zip->getFromName('xl/workbook.xml');
        $relsText = $zip->getFromName('xl/_rels/workbook.xml.rels');

        if ($workbookText === false || $relsText === false) {
            return 'xl/worksheets/sheet1.xml';
        }

        $workbook = simplexml_load_string($workbookText);
        $rels = simplexml_load_string($relsText);

        if ($workbook === false || $rels === false) {
            return 'xl/worksheets/sheet1.xml';
        }

        $workbook->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
        $firstSheet = ($workbook->xpath('//s:sheets/s:sheet') ?: [])[0] ?? null;
        if ($firstSheet === null) {
            return 'xl/worksheets/sheet1.xml';
        }

        $relationId = (string) $firstSheet
            ->attributes('http://schemas.openxmlformats.org/officeDocument/2006/relationships')['id'];
        if (!$relationId) {
            return 'xl/worksheets/sheet1.xml';
        }

        $rels->registerXPathNamespace('r', 'http://schemas.openxmlformats.org/package/2006/relationships');
        foreach ($rels->xpath('//r:Relationship') ?: [] as $relationship) {
            if ((string) $relationship['Id'] !== $relationId) {
                continue;
            }

            return $this->resolveXlsxPath((string) $relationship['Target']);
        }

        return 'xl/worksheets/sheet1.xml';
    }

    private function resolveXlsxPath(string $target): string
    {
        $target = str_replace('\\', '/', $target);

        if (str_starts_with($target, '/')) {
            return ltrim($target, '/');
        }

        if (str_starts_with($target, 'xl/')) {
            return $target;
        }

        return 'xl/' . ltrim($target, '/');
    }

    private function readXlsxCellValue(\SimpleXMLElement $cell, array $sharedStrings)
    {
        $type = (string) $cell['t'];
        $cell->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');

        if ($type === 'inlineStr') {
            return $this->xmlText($cell);
        }

        $valueNode = ($cell->xpath('s:v') ?: [])[0] ?? null;
        if ($valueNode === null) {
            return null;
        }

        $value = (string) $valueNode;

        if ($type === 's') {
            return $sharedStrings[(int) $value] ?? null;
        }

        if ($type === 'b') {
            return $value === '1' ? '1' : '0';
        }

        return $value;
    }

    private function xmlText(\SimpleXMLElement $node): string
    {
        $node->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
        $parts = [];

        foreach ($node->xpath('.//s:t') ?: [] as $textNode) {
            $parts[] = (string) $textNode;
        }

        return implode('', $parts);
    }

    private function gridToAssocRows(array $grid): array
    {
        $headers = null;
        $rows = [];

        foreach ($grid as $row) {
            if ($this->isBlankRow($row)) {
                continue;
            }

            ksort($row);

            if ($headers === null) {
                $headers = [];
                foreach ($row as $column => $value) {
                    $headers[$column] = trim((string) $value);
                }
                continue;
            }

            $assoc = [];
            foreach ($headers as $column => $header) {
                if ($header === '') {
                    continue;
                }
                $assoc[$header] = $row[$column] ?? null;
            }

            if (!$this->isBlankRow($assoc)) {
                $rows[] = $assoc;
            }
        }

        return $rows;
    }

    private function isBlankRow(array $row): bool
    {
        foreach ($row as $value) {
            if (!$this->isBlankValue($value)) {
                return false;
            }
        }

        return true;
    }

    private function isBlankValue($value): bool
    {
        return $value === null || (is_string($value) && trim($value) === '');
    }

    private function columnIndexFromReference(string $reference): int
    {
        if (!preg_match('/^([A-Z]+)/i', $reference, $matches)) {
            return 0;
        }

        $letters = mb_strtoupper($matches[1]);
        $index = 0;

        for ($i = 0; $i < strlen($letters); $i++) {
            $index = ($index * 26) + (ord($letters[$i]) - 64);
        }

        return $index - 1;
    }

    private function normalizeRow(array $raw): array
    {
        $norm = [];

        foreach ($raw as $key => $value) {
            $norm[$this->normalizeKey((string) $key)] = $value;
        }

        return $norm;
    }

    private function normalizeKey(string $key): string
    {
        $key = trim(mb_strtolower($key));
        $ascii = function_exists('iconv') ? @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $key) : false;

        if ($ascii !== false) {
            $key = $ascii;
        }

        return preg_replace('/[^a-z0-9]/', '', $key);
    }

    private function getImportValue(array $norm, string $cleanName)
    {
        $value = $norm[$this->normalizeKey($cleanName)] ?? null;

        if (is_string($value)) {
            $value = trim($value, " \t\n\r\0\x0B\xEF\xBB\xBF");
            if ($value === '' || mb_strtoupper($value) === '#N/A') {
                return null;
            }
        }

        return $value;
    }

    private function stringOrNull($value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private function floatOrNull($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        if (is_string($value)) {
            $value = trim($value);
            if ($value === '' || mb_strtoupper($value) === '#N/A') {
                return null;
            }

            if (str_contains($value, ',') && !str_contains($value, '.')) {
                $value = str_replace(',', '.', $value);
            } elseif (preg_match('/^-?\d{1,3}(\.\d{3})+,\d+$/', $value)) {
                $value = str_replace('.', '', $value);
                $value = str_replace(',', '.', $value);
            }
        }

        return is_numeric($value) ? (float) $value : null;
    }

    private function intOrNull($value): ?int
    {
        $float = $this->floatOrNull($value);

        return $float === null ? null : (int) $float;
    }

    private function buildImportDescription(array $norm): string
    {
        $parts = array_filter([
            $this->stringOrNull($this->getImportValue($norm, 'TIPO')),
            $this->stringOrNull($this->getImportValue($norm, 'USO')),
            $this->stringOrNull($this->getImportValue($norm, 'Material')),
            $this->stringOrNull($this->getImportValue($norm, 'FAMILIA')),
        ]);

        $text = 'Producto Tuboplast';
        if (count($parts)) {
            $text .= ' - ' . implode(' - ', $parts);
        }
        $text .= '.';

        $features = $this->stringOrNull($this->getImportValue($norm, 'Caracteristicas'));
        if ($features) {
            $text .= ' ' . Str::limit($features, 240);
        }

        return $text;
    }

    private function pushImportError(array &$errors, string $message): void
    {
        if (count($errors) < 20) {
            $errors[] = $message;
        }
    }
}
