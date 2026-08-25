<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Distribuidor;
use Exception;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use SoDe\Extend\Response;
use ZipArchive;

class DistribuidorController extends BasicController
{
    public $reactView = 'Admin/Distributors';
    public $model = Distribuidor::class;

    public function setReactViewProperties(Request $request)
    {
        return [
            'gmapsApiKey' => env('GMAPS_API_KEY'),
        ];
    }

    public function beforeSave(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:160',
            'ruc' => 'nullable|digits:11',
            'department' => 'required|string|max:120',
            'province' => 'required|string|max:120',
            'district' => 'required|string|max:120',
            'ubigeo' => 'required|string|max:12',
            'address' => 'required|string|max:255',
            'reference' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:60',
            'phone_prefix' => 'nullable|string|max:8',
            'business_hours' => 'nullable|string|max:120',
            'featured' => 'nullable',
            'distributor_type' => 'nullable|string|max:40',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'status' => 'nullable',
        ]);

        $validated['distributor_type'] = $validated['distributor_type'] ?? 'point_of_sale';
        $validated['featured'] = $validated['distributor_type'] === 'distributor' ? 1 : 0;

        if (array_key_exists('status', $validated)) {
            $validated['status'] = in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0;
        } else {
            $validated['status'] = 1;
        }

        return [
            'id' => $request->input('id'),
            ...$validated,
        ];
    }

    public function import(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();

        try {
            $request->validate([
                'file' => 'required|file|max:20480',
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

            $result = DB::transaction(fn () => $this->importRows($rows), 3);

            $response->status = 200;
            $response->message = 'Carga masiva de distribuidores completada';
            $response->data = $result;
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    private function importRows(array $rows): array
    {
        $ubigeoIndex = $this->ubigeoIndex();
        $created = 0;
        $updated = 0;
        $skipped = 0;
        $errors = [];

        foreach ($rows as $index => $raw) {
            $rowNumber = $index + 2;
            $norm = $this->normalizeRow($raw);

            $name = $this->stringOrNull($this->getImportValue($norm, 'Nombre'));
            $address = $this->stringOrNull($this->getImportValue($norm, 'Direccion'));
            $ubigeo = $this->stringOrNull($this->getImportValue($norm, 'Ubigeo'));
            $latitude = $this->floatOrNull($this->getImportValue($norm, 'Latitud'));
            $longitude = $this->floatOrNull($this->getImportValue($norm, 'Longitud'));

            if (!$name || !$address || !$ubigeo || $latitude === null || $longitude === null) {
                $skipped++;
                $this->pushImportError($errors, "Fila {$rowNumber}: faltan Nombre, Dirección, Ubigeo, Latitud o Longitud.");
                continue;
            }

            $location = $ubigeoIndex[$ubigeo] ?? null;
            $department = $this->stringOrNull($this->getImportValue($norm, 'Departamento')) ?? ($location['department'] ?? null);
            $province = $this->stringOrNull($this->getImportValue($norm, 'Provincia')) ?? ($location['province'] ?? null);
            $district = $this->stringOrNull($this->getImportValue($norm, 'Distrito')) ?? ($location['district'] ?? null);

            if (!$department || !$province || !$district) {
                $skipped++;
                $this->pushImportError($errors, "Fila {$rowNumber}: el ubigeo {$ubigeo} no permite identificar departamento, provincia y distrito.");
                continue;
            }

            $ruc = $this->digitsOrNull($this->getImportValue($norm, 'RUC'));
            $type = $this->normalizeDistributorType($this->getImportValue($norm, 'Tipo'));
            $data = [
                'name' => $name,
                'ruc' => $ruc,
                'department' => $department,
                'province' => $province,
                'district' => $district,
                'ubigeo' => $ubigeo,
                'address' => $address,
                'reference' => $this->stringOrNull($this->getImportValue($norm, 'Referencia')),
                'phone' => $this->stringOrNull($this->getImportValue($norm, 'Telefono')),
                'phone_prefix' => $this->stringOrNull($this->getImportValue($norm, 'Prefijo')) ?? '+51',
                'business_hours' => $this->stringOrNull($this->getImportValue($norm, 'Horario')),
                'distributor_type' => $type,
                'featured' => $type === 'distributor' ? 1 : 0,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'status' => 1,
            ];

            $existing = $ruc
                ? Distribuidor::query()->where('ruc', $ruc)->first()
                : Distribuidor::query()
                    ->where('ubigeo', $ubigeo)
                    ->where('name', $name)
                    ->where('address', $address)
                    ->first();

            if ($existing) {
                $existing->update($data);
                $updated++;
            } else {
                Distribuidor::create($data);
                $created++;
            }
        }

        if (($created + $updated) === 0) {
            throw new Exception('No se importó ningún distribuidor. Revisa el archivo y sus encabezados.');
        }

        return compact('created', 'updated', 'skipped', 'errors');
    }

    private function ubigeoIndex(): array
    {
        $path = storage_path('app/utils/ubigeo-inei.json');
        if (!File::exists($path)) {
            return [];
        }

        $decoded = json_decode(File::get($path), true);
        $rows = is_array($decoded) ? $decoded : [];
        $index = [];

        foreach ($rows as $row) {
            if (!empty($row['code'])) {
                $index[(string) $row['code']] = [
                    'department' => $row['department'] ?? null,
                    'province' => $row['province'] ?? null,
                    'district' => $row['district'] ?? null,
                ];
            }
        }

        return $index;
    }

    private function readCsvRows(string $path): array
    {
        $handle = fopen($path, 'rb');
        if ($handle === false) {
            throw new Exception('No se pudo leer el CSV.');
        }

        $delimiter = $this->detectCsvDelimiter($path);
        $headers = null;
        $rows = [];
        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            if ($headers === null) {
                $headers = array_map(fn ($value) => trim((string) $value), $row);
                continue;
            }

            $assoc = [];
            foreach ($headers as $index => $header) {
                if ($header !== '') {
                    $assoc[$header] = $row[$index] ?? null;
                }
            }

            if (!$this->isBlankRow($assoc)) {
                $rows[] = $assoc;
            }
        }
        fclose($handle);

        return $rows;
    }

    private function detectCsvDelimiter(string $path): string
    {
        $sample = (string) file_get_contents($path, false, null, 0, 4096);
        return substr_count($sample, ';') > substr_count($sample, ',') ? ';' : ',';
    }

    private function readXlsxRows(string $path): array
    {
        $zip = new ZipArchive();
        if ($zip->open($path) !== true) {
            throw new Exception('No se pudo abrir el Excel.');
        }

        try {
            $sharedStrings = $this->readSharedStrings($zip);
            $xml = simplexml_load_string($zip->getFromName('xl/worksheets/sheet1.xml') ?: '');
            if (!$xml) {
                throw new Exception('No se pudo leer la primera hoja del Excel.');
            }

            $xml->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
            $grid = [];
            foreach ($xml->xpath('//s:sheetData/s:row') ?: [] as $row) {
                $row->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
                $cells = [];
                foreach ($row->xpath('s:c') ?: [] as $cell) {
                    $reference = (string) $cell['r'];
                    $cells[$this->columnIndexFromReference($reference)] = $this->readXlsxCellValue($cell, $sharedStrings);
                }
                $grid[] = $cells;
            }
        } finally {
            $zip->close();
        }

        return $this->gridToAssocRows($grid);
    }

    private function readSharedStrings(ZipArchive $zip): array
    {
        $content = $zip->getFromName('xl/sharedStrings.xml');
        if (!$content) {
            return [];
        }

        $xml = simplexml_load_string($content);
        if (!$xml) {
            return [];
        }

        $xml->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
        $strings = [];
        foreach ($xml->xpath('//s:si') ?: [] as $node) {
            $node->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
            $parts = [];
            foreach ($node->xpath('.//s:t') ?: [] as $textNode) {
                $parts[] = (string) $textNode;
            }
            $strings[] = implode('', $parts);
        }

        return $strings;
    }

    private function readXlsxCellValue(\SimpleXMLElement $cell, array $sharedStrings)
    {
        $type = (string) $cell['t'];
        $cell->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
        if ($type === 'inlineStr') {
            $parts = [];
            foreach ($cell->xpath('.//s:t') ?: [] as $textNode) {
                $parts[] = (string) $textNode;
            }
            return implode('', $parts);
        }

        $valueNode = ($cell->xpath('s:v') ?: [])[0] ?? null;
        if ($valueNode === null) {
            return null;
        }

        $value = (string) $valueNode;
        return $type === 's' ? ($sharedStrings[(int) $value] ?? null) : $value;
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
                $headers = array_map(fn ($value) => trim((string) $value), $row);
                continue;
            }

            $assoc = [];
            foreach ($headers as $column => $header) {
                if ($header !== '') {
                    $assoc[$header] = $row[$column] ?? null;
                }
            }
            if (!$this->isBlankRow($assoc)) {
                $rows[] = $assoc;
            }
        }

        return $rows;
    }

    private function columnIndexFromReference(string $reference): int
    {
        if (!preg_match('/^([A-Z]+)/i', $reference, $matches)) {
            return 0;
        }
        $index = 0;
        foreach (str_split(mb_strtoupper($matches[1])) as $letter) {
            $index = ($index * 26) + (ord($letter) - 64);
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

    private function digitsOrNull($value): ?string
    {
        $value = preg_replace('/\D/', '', (string) $value);
        return $value === '' ? null : $value;
    }

    private function floatOrNull($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }
        if (is_string($value)) {
            $value = trim($value);
            if (str_contains($value, ',') && !str_contains($value, '.')) {
                $value = str_replace(',', '.', $value);
            }
        }
        return is_numeric($value) ? (float) $value : null;
    }

    private function normalizeDistributorType($value): string
    {
        $value = mb_strtolower((string) $value);
        return str_contains($value, 'distribuidor') ? 'distributor' : 'point_of_sale';
    }

    private function isBlankRow(array $row): bool
    {
        foreach ($row as $value) {
            if ($value !== null && (!is_string($value) || trim($value) !== '')) {
                return false;
            }
        }
        return true;
    }

    private function pushImportError(array &$errors, string $message): void
    {
        if (count($errors) < 20) {
            $errors[] = $message;
        }
    }
}
