<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Category;
use App\Models\Item;
use App\Models\ProductClassification;
use App\Models\ProductFamily;
use App\Models\ProductLine;
use App\Models\ProductSegment;
use App\Models\ProductType;
use Exception;
use FilesystemIterator;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SoDe\Extend\Response;
use Symfony\Component\Process\ExecutableFinder;
use Symfony\Component\Process\Process;
use ZipArchive;

class ItemController extends BasicController
{
    public $reactView = 'Admin/Items';
    public $model = Item::class;
    public $imageFields = [];
    public $with4get = ['category', 'productSegment', 'productSegments', 'productLine', 'productClassification', 'productFamily', 'productType'];
    private array $pendingSegmentIds = [];
    private array $filesPendingDeletion = [];

    public function setPaginationInstance(string $model)
    {
        return $model::with($this->itemRelations());
    }

    private function itemRelations(): array
    {
        $relations = ['category', 'productSegment', 'productSegments', 'productLine', 'productClassification', 'productFamily', 'productType'];

        if (Schema::hasTable('item_images')) {
            $relations[] = 'images';
        }

        return $relations;
    }

    public function setReactViewProperties(Request $request)
    {
        $this->ensureBaseTaxonomies();

        return [
            'categories' => Category::query()
                ->whereNotNull('status')
                ->orderBy('name')
                ->get(['id', 'name']),
            'segments' => ProductSegment::query()
                ->whereNotNull('status')
                ->orderBy('name')
                ->get(['id', 'name']),
            'lines' => ProductLine::query()
                ->whereNotNull('status')
                ->orderBy('name')
                ->get(['id', 'name']),
            'classifications' => ProductClassification::query()
                ->whereNotNull('status')
                ->orderBy('name')
                ->get(['id', 'name']),
            'families' => ProductFamily::query()
                ->whereNotNull('status')
                ->orderBy('name')
                ->get(['id', 'name']),
            'types' => ProductType::query()
                ->whereNotNull('status')
                ->orderBy('name')
                ->get(['id', 'name']),
        ];
    }

    private function ensureBaseTaxonomies(): void
    {
        foreach ([
            ProductSegmentController::class,
            ProductLineController::class,
            ProductClassificationController::class,
            ProductFamilyController::class,
            ProductTypeController::class,
        ] as $controller) {
            app($controller)->ensureBaseRows();
        }
    }

    public function beforeSave(Request $request)
    {
        $id = $request->input('id');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'sku' => 'nullable|string|max:120',
            'category_id' => 'nullable|integer|exists:categories,id',
            'product_segment_id' => 'nullable|integer|exists:product_segments,id',
            'product_segment_ids' => 'nullable|array',
            'product_segment_ids.*' => 'integer|exists:product_segments,id',
            'product_line_id' => 'nullable|integer|exists:product_lines,id',
            'product_classification_id' => 'nullable|integer|exists:product_classifications,id',
            'product_family_id' => 'nullable|integer|exists:product_families,id',
            'product_type_id' => 'nullable|integer|exists:product_types,id',
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
            'gallery_images' => 'nullable|array',
            'gallery_images.*' => 'file|image|max:10240',
            'gallery_order' => 'nullable|array',
            'gallery_order.*' => 'string|max:80',
            'technical_sheet' => 'nullable|file|mimes:pdf|max:51200',
            'status' => 'nullable',
        ]);

        $segmentIds = collect($validated['product_segment_ids'] ?? [])
            ->map(fn ($id) => (int) $id)
            ->filter()
            ->unique()
            ->values()
            ->all();

        if (!$segmentIds && !empty($validated['product_segment_id'])) {
            $segmentIds = [(int) $validated['product_segment_id']];
        }

        $this->pendingSegmentIds = $segmentIds;
        $primarySegmentId = $segmentIds[0] ?? ($validated['product_segment_id'] ?? null);

        unset($validated['product_segment_ids']);
        unset($validated['gallery_images']);
        unset($validated['gallery_order']);

        $validated['currency'] = $validated['currency'] ?? 'PEN';
        $validated['product_segment_id'] = $primarySegmentId ?: null;
        $validated['segment'] = $this->taxonomyName(ProductSegment::class, $primarySegmentId) ?? ($validated['segment'] ?? null);
        $validated['classification'] = $this->taxonomyName(ProductClassification::class, $validated['product_classification_id'] ?? null) ?? ($validated['classification'] ?? null);
        $validated['family'] = $this->taxonomyName(ProductFamily::class, $validated['product_family_id'] ?? null) ?? ($validated['family'] ?? null);
        $validated['type'] = $this->taxonomyName(ProductType::class, $validated['product_type_id'] ?? null) ?? ($validated['type'] ?? null);

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

        if ($request->hasFile('technical_sheet')) {
            if ($id) {
                $this->queueFileForDeletion(Item::query()->whereKey($id)->value('technical_sheet'));
            }
            $validated['technical_sheet'] = $request->file('technical_sheet')->store('items/sheets', 'public');
        }

        return [
            'id' => $id,
            ...$validated,
        ];
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        if ($jpa instanceof Item) {
            $jpa->productSegments()->sync($this->pendingSegmentIds);
            $this->syncManualImageGallery($request, $jpa);
        }

        $this->deletePendingFiles();

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
                'images_zip' => 'nullable|file|max:102400',
                'sheets_zip' => 'nullable|file|max:102400',
            ]);

            $file = $request->file('file');
            $extension = mb_strtolower($file->getClientOriginalExtension());
            $imagePackage = $request->hasFile('images_zip')
                ? $this->readImagePackage($request->file('images_zip')->getRealPath())
                : ['groups' => [], 'ignored' => 0, 'errors' => []];
            $sheetPackage = $request->hasFile('sheets_zip')
                ? $this->readSheetPackage($request->file('sheets_zip')->getRealPath())
                : ['groups' => [], 'ignored' => 0, 'errors' => []];

            $rows = match ($extension) {
                'xlsx' => $this->readXlsxRows($file->getRealPath()),
                'csv' => $this->readCsvRows($file->getRealPath()),
                default => throw new Exception('El archivo debe estar en formato .xlsx o .csv.'),
            };

            if (!count($rows)) {
                throw new Exception('No se encontraron filas para importar.');
            }

            $mode = (string) $request->input('mode');
            $this->filesPendingDeletion = [];
            $result = DB::transaction(fn () => $this->importRows($rows, $mode, $imagePackage, $sheetPackage), 3);
            $this->deletePendingFiles();

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

    public function importImages(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();

        try {
            $request->validate([
                'images_zip' => 'required|file|max:102400',
            ]);

            if (!Schema::hasTable('item_images')) {
                throw new Exception('La tabla de galería de imágenes aún no existe. Ejecuta las migraciones antes de cargar imágenes.');
            }

            $imagePackage = $this->readImagePackage($request->file('images_zip')->getRealPath());
            $imageGroups = $imagePackage['groups'] ?? [];

            if (!count($imageGroups)) {
                throw new Exception('No se encontraron imágenes válidas dentro del comprimido.');
            }

            $this->filesPendingDeletion = [];
            $result = DB::transaction(fn () => $this->replaceImagesForExistingItems($imageGroups, (int) ($imagePackage['ignored'] ?? 0)), 3);
            $this->deletePendingFiles();

            Cache::forget('tuboplast.catalog.facets');

            $response->status = 200;
            $response->message = 'Carga de imágenes completada';
            $response->data = $result;
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
            $this->filesPendingDeletion = [];
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    public function importSheets(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();

        try {
            $request->validate([
                'sheets_zip' => 'required|file|max:102400',
            ]);

            $sheetPackage = $this->readSheetPackage($request->file('sheets_zip')->getRealPath());
            $sheetGroups = $sheetPackage['groups'] ?? [];

            if (!count($sheetGroups)) {
                throw new Exception('No se encontraron fichas técnicas PDF válidas dentro del comprimido.');
            }

            $this->filesPendingDeletion = [];
            $result = DB::transaction(fn () => $this->replaceSheetsForExistingItems($sheetGroups, (int) ($sheetPackage['ignored'] ?? 0)), 3);
            $this->deletePendingFiles();

            $response->status = 200;
            $response->message = 'Carga de fichas técnicas completada';
            $response->data = $result;
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
            $this->filesPendingDeletion = [];
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    private function importRows(array $rows, string $mode, array $imagePackage = [], array $sheetPackage = []): array
    {
        $categoryCache = [];
        $taxonomyCache = [];
        $reservedSlugs = [];
        $imageGroups = $imagePackage['groups'] ?? [];
        $sheetGroups = $sheetPackage['groups'] ?? [];
        $matchedImageSkus = [];
        $matchedSheetSkus = [];
        $deleted = 0;
        $created = 0;
        $updated = 0;
        $skipped = 0;
        $imagesAssociated = 0;
        $imagesIgnored = (int) ($imagePackage['ignored'] ?? 0);
        $sheetsAssociated = 0;
        $sheetsIgnored = (int) ($sheetPackage['ignored'] ?? 0);
        $errors = [];

        if ($mode === 'replace') {
            $this->assertReplaceRowsAreValid($rows);
        }

        if ($mode === 'replace') {
            $this->queueCurrentItemImageFilesForDeletion();
            $deleted = Item::query()->count();
            Item::query()->delete();
        }

        foreach ($rows as $index => $raw) {
            $rowNumber = $index + 2;
            $norm = $this->normalizeRow($raw);
            $sku = $this->stringOrNull($this->getImportValue($norm, 'Código Producto'));

            if (!$sku) {
                $skipped++;
                $this->pushImportError($errors, "Fila {$rowNumber}: falta Código Producto.");
                continue;
            }

            $data = $this->mapImportRow($norm, $sku, $categoryCache, $taxonomyCache);
            $existing = $mode === 'upsert'
                ? $this->findImportMatch($sku, $data)
                : null;
            $data['slug'] = $this->uniqueItemSlug($data['title'], $sku, $existing?->id, $reservedSlugs);

            if ($existing) {
                $existing->update(collect($data)->except('product_segment_ids')->all());
                $existing->productSegments()->sync($data['product_segment_ids'] ?? []);
                $item = $existing->fresh();
                $updated++;
            } else {
                $item = Item::create(collect($data)->except('product_segment_ids')->all());
                $item->productSegments()->sync($data['product_segment_ids'] ?? []);
                $created++;
            }

            $imageCode = $this->imageLookupCodeFromRow($norm, $sku);
            $imageKey = $this->imagePackageKey($imageCode);
            $sheetCode = $this->sheetLookupCodeFromRow($norm, $sku);
            $sheetKey = $this->imagePackageKey($sheetCode);
            if (!empty($imageGroups[$imageKey])) {
                $imagesAssociated += $this->replaceItemImages($item, $imageGroups[$imageKey]);
                $matchedImageSkus[$imageKey] = true;
            }

            if (!empty($sheetGroups[$sheetKey])) {
                $sheetsAssociated += $this->replaceItemSheet($item, $sheetGroups[$sheetKey][0]);
                $matchedSheetSkus[$sheetKey] = true;
            }
        }

        if ($mode === 'replace' && $skipped > 0) {
            $detail = $errors[0] ?? 'Revisa el archivo antes de volver a intentar.';
            throw new Exception("Importacion completa cancelada: hay {$skipped} fila(s) omitidas. {$detail}");
        }

        if (($created + $updated) === 0) {
            throw new Exception('No se importó ningún item. Revisa que el archivo tenga la columna Código Producto.');
        }

        foreach ($imageGroups as $skuKey => $images) {
            if (!isset($matchedImageSkus[$skuKey])) {
                $imagesIgnored += count($images);
            }
        }

        foreach ($sheetGroups as $skuKey => $sheets) {
            if (!isset($matchedSheetSkus[$skuKey])) {
                $sheetsIgnored += count($sheets);
            }
        }

        return [
            'mode' => $mode,
            'deleted' => $deleted,
            'created' => $created,
            'updated' => $updated,
            'skipped' => $skipped,
            'images_associated' => $imagesAssociated,
            'images_ignored' => $imagesIgnored,
            'sheets_associated' => $sheetsAssociated,
            'sheets_ignored' => $sheetsIgnored,
            'errors' => $errors,
        ];
    }

    private function findImportMatch(string $sku, array $data): ?Item
    {
        return Item::query()
            ->where('sku', $sku)
            ->first();
    }

    private function imageLookupCodeFromRow(array $norm, string $sku): string
    {
        return $this->stringOrNull($this->getImportValue($norm, 'CODIGO IMAGEN'))
            ?? $this->stringOrNull($this->getImportValue($norm, 'IMAGEN'))
            ?? $sku;
    }

    private function sheetLookupCodeFromRow(array $norm, string $sku): string
    {
        return $this->stringOrNull($this->getImportValue($norm, 'FICHA')) ?? $sku;
    }

    private function replaceImagesForExistingItems(array $imageGroups, int $initialIgnored): array
    {
        $matched = 0;
        $imagesAssociated = 0;
        $imagesIgnored = $initialIgnored;
        $notFound = 0;
        $ambiguous = 0;
        $errors = [];

        $itemsByKey = Item::query()
            ->whereNotNull('sku')
            ->get(['id', 'sku', 'image'])
            ->groupBy(fn ($item) => $this->imagePackageKey((string) $item->sku));

        foreach ($imageGroups as $skuKey => $images) {
            $candidates = $itemsByKey->get($skuKey, collect());

            if ($candidates->isEmpty()) {
                $notFound++;
                $imagesIgnored += count($images);
                $this->pushImportError($errors, "No existe producto para el código de imagen {$skuKey}.");
                continue;
            }

            if ($candidates->count() > 1) {
                $ambiguous++;
                $imagesIgnored += count($images);
                $this->pushImportError($errors, "Código de imagen {$skuKey} coincide con más de un producto.");
                continue;
            }

            $item = Item::with('images')->find($candidates->first()->id);
            if (!$item) {
                $notFound++;
                $imagesIgnored += count($images);
                continue;
            }

            $imagesAssociated += $this->replaceItemImages($item, $images);
            $matched++;
        }

        if ($matched === 0) {
            throw new Exception('No se cargó ninguna imagen: ningún nombre de archivo coincide claramente con un SKU existente.');
        }

        return [
            'matched_items' => $matched,
            'images_associated' => $imagesAssociated,
            'images_ignored' => $imagesIgnored,
            'not_found' => $notFound,
            'ambiguous' => $ambiguous,
            'errors' => $errors,
        ];
    }

    private function assertReplaceRowsAreValid(array $rows): void
    {
        $errors = [];
        $skipped = 0;

        foreach ($rows as $index => $raw) {
            $norm = $this->normalizeRow($raw);
            $sku = $this->stringOrNull($this->getImportValue($norm, 'Código Producto'));

            if (!$sku) {
                $skipped++;
                $rowNumber = $index + 2;
                $this->pushImportError($errors, "Fila {$rowNumber}: falta Código Producto.");
            }
        }

        if ($skipped > 0) {
            $detail = $errors[0] ?? 'Revisa el archivo antes de volver a intentar.';
            throw new Exception("Importacion completa cancelada: hay {$skipped} fila(s) omitidas. {$detail}");
        }
    }

    private function mapImportRow(array $norm, string $sku, array &$categoryCache, array &$taxonomyCache): array
    {
        $title = $this->stringOrNull($this->getImportValue($norm, 'Descripcion de Producto'))
            ?? ('Producto ' . $sku);
        $lineName = $this->normalizeCatalogLabel($this->stringOrNull($this->getImportValue($norm, 'LINEA DE PRODUCTO'))
            ?? $this->stringOrNull($this->getImportValue($norm, 'FAMCONS'))
            ?? $this->stringOrNull($this->getImportValue($norm, 'FAMILIA'))
            ?? 'Productos');
        $rawSegmentName = $this->stringOrNull($this->getImportValue($norm, 'SEGMENTO DE NEGOCIO'))
            ?? $this->stringOrNull($this->getImportValue($norm, 'SEGMENTO'));
        $segmentName = $this->normalizeCatalogLabel($rawSegmentName);
        $familyName = $this->normalizeCatalogLabel($this->stringOrNull($this->getImportValue($norm, 'FAMILIA')));
        $classificationName = $this->normalizeCatalogLabel($this->stringOrNull($this->getImportValue($norm, 'CLASIFICACION'))
            ?? $this->stringOrNull($this->getImportValue($norm, 'CLASIFICACIÓN'))
            ?? $familyName);
        $typeName = $this->normalizeCatalogType($this->stringOrNull($this->getImportValue($norm, 'TIPO')));
        $category = $this->resolveImportCategory($lineName, $categoryCache);
        $segmentNames = $this->segmentNamesFromImport($rawSegmentName);
        $segments = collect($segmentNames)
            ->map(fn ($name) => $this->resolveTaxonomy(ProductSegment::class, $name, $taxonomyCache))
            ->filter()
            ->values();
        $segment = $segments->first();
        $line = $lineName ? $this->resolveTaxonomy(ProductLine::class, $lineName, $taxonomyCache) : null;
        $classification = $classificationName ? $this->resolveTaxonomy(ProductClassification::class, $classificationName, $taxonomyCache) : null;
        $family = $familyName ? $this->resolveTaxonomy(ProductFamily::class, $familyName, $taxonomyCache) : null;
        $type = $typeName ? $this->resolveTaxonomy(ProductType::class, $typeName, $taxonomyCache) : null;
        $nominal = $this->stringOrNull($this->getImportValue($norm, 'Diámetro Nominal del Producto'));

        $currency = mb_strtoupper((string) ($this->getImportValue($norm, 'Moneda') ?? 'PEN'));
        $currency = in_array($currency, ['PEN', 'USD'], true) ? $currency : 'PEN';

        return [
            'category_id' => $category->id,
            'product_segment_id' => $segment?->id,
            'product_segment_ids' => $segments->pluck('id')->all(),
            'product_line_id' => $line?->id,
            'product_classification_id' => $classification?->id,
            'product_family_id' => $family?->id,
            'product_type_id' => $type?->id,
            'segment' => $segment?->name ?? $segmentName,
            'famcons' => $this->stringOrNull($this->getImportValue($norm, 'FAMCONS')),
            'family' => $family?->name ?? $familyName,
            'classification' => $classificationName,
            'type' => $typeName,
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
            ['description' => "Línea de productos: {$line}", 'status' => 1]
        );

        if ($category->status === null) {
            $category->update(['status' => 1]);
        }

        $categoryCache[$line] = $category;

        return $category;
    }

    private function resolveTaxonomy(string $model, string $name, array &$taxonomyCache)
    {
        $name = $this->normalizeTaxonomyName($name);
        $key = $model . ':' . $this->taxonomyLookupKey($name);

        if (isset($taxonomyCache[$key])) {
            return $taxonomyCache[$key];
        }

        $taxonomy = $model::query()
            ->whereNotNull('status')
            ->get()
            ->first(fn ($row) => $this->taxonomyLookupKey($row->name) === $this->taxonomyLookupKey($name));

        if (!$taxonomy) {
            $taxonomy = $model::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => null,
                'status' => 1,
            ]);
        } elseif ($taxonomy->status === null) {
            $taxonomy->update(['status' => 1]);
        }

        $taxonomyCache[$key] = $taxonomy;

        return $taxonomy;
    }

    private function normalizeTaxonomyName(string $name): string
    {
        $name = str_replace("\xC2\xA0", ' ', $name);
        $name = preg_replace('/\s+/u', ' ', $name) ?: $name;

        return trim($name);
    }

    private function taxonomyLookupKey(string $name): string
    {
        $name = mb_strtolower($this->normalizeTaxonomyName($name));
        $ascii = function_exists('iconv') ? @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name) : false;

        if ($ascii !== false) {
            $name = $ascii;
        }

        return preg_replace('/[^a-z0-9]/', '', $name) ?: mb_strtoupper($this->normalizeTaxonomyName($name));
    }

    private function normalizeCatalogLabel(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        $value = $this->normalizeTaxonomyName($value);
        $lookup = $this->taxonomyLookupKey($value);

        $aliases = [
            'predialoedificaciones' => 'Predial',
            'predialedificaciones' => 'Predial',
            'saneamientooinfraestructura' => 'Saneamiento',
            'saneamientoinfraestructura' => 'Saneamiento',
            'aguafria' => 'Agua Fría',
            'aguapotable' => 'Agua Potable',
            'alcantarillado' => 'Alcantarillado',
            'desague' => 'Desagüe',
            'electrico' => 'Eléctrico',
            'anillosdecaucho' => 'Anillos de Caucho',
            'claseliviana' => 'Clase Liviana',
            'clasepesada' => 'Clase Pesada',
            'sap' => 'SAP',
            'sel' => 'SEL',
            'sistemaroscado' => 'Sistema Roscado',
            'sistemasimplepresion' => 'Sistema Simple Presión',
            'sistemauniónflexible' => 'Sistema Unión Flexible (UF)',
            'sistemauniónflexibleuf' => 'Sistema Unión Flexible (UF)',
        ];

        return $aliases[$lookup] ?? Str::of($value)->lower()->title()->toString();
    }

    private function segmentNamesFromImport(?string $value): array
    {
        if (!$value) {
            return [];
        }

        $normalized = $this->normalizeTaxonomyName($value);
        $wholeKey = $this->taxonomyLookupKey($normalized);
        $grouped = match ($wholeKey) {
            'predialoedificaciones', 'predialedificaciones' => ['Predial', 'Edificaciones'],
            'saneamientooinfraestructura', 'saneamientoinfraestructura' => ['Saneamiento', 'Infraestructura'],
            default => null,
        };

        if ($grouped) {
            return $grouped;
        }

        $parts = preg_split('/\s*(?:\||,|;|\/|\bo\b)\s*/iu', $normalized) ?: [];
        $segments = collect($parts)
            ->map(fn ($part) => $this->normalizeCatalogLabel($part))
            ->filter()
            ->flatMap(function ($part) {
                return match ($this->taxonomyLookupKey($part)) {
                    'predialoedificaciones', 'predialedificaciones' => ['Predial', 'Edificaciones'],
                    'saneamientooinfraestructura', 'saneamientoinfraestructura' => ['Saneamiento', 'Infraestructura'],
                    default => [$part],
                };
            })
            ->unique(fn ($part) => $this->taxonomyLookupKey($part))
            ->values()
            ->all();

        return $segments ?: [$this->normalizeCatalogLabel($value)];
    }

    private function normalizeCatalogType(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        return match ($this->taxonomyLookupKey($value)) {
            'tubo', 'tubos' => 'Tubos',
            'conexion', 'conexiones', 'anillo', 'anillos' => 'Conexiones',
            default => $this->normalizeCatalogLabel($value),
        };
    }

    private function taxonomyName(string $model, $id): ?string
    {
        if (!$id) {
            return null;
        }

        return $model::query()->whereKey($id)->value('name');
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
            $sheetPath = $this->sheetPathByName($zip, 'Prod') ?? $this->firstSheetPath($zip);
            $sheetXml = $zip->getFromName($sheetPath);

            if ($sheetXml === false) {
                throw new Exception('No se encontró una hoja válida dentro del Excel.');
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

    private function sheetPathByName(ZipArchive $zip, string $name): ?string
    {
        $workbookText = $zip->getFromName('xl/workbook.xml');
        $relsText = $zip->getFromName('xl/_rels/workbook.xml.rels');

        if ($workbookText === false || $relsText === false) {
            return null;
        }

        $workbook = simplexml_load_string($workbookText);
        $rels = simplexml_load_string($relsText);

        if ($workbook === false || $rels === false) {
            return null;
        }

        $workbook->registerXPathNamespace('s', 'http://schemas.openxmlformats.org/spreadsheetml/2006/main');
        $targetRelationId = null;

        foreach ($workbook->xpath('//s:sheets/s:sheet') ?: [] as $sheet) {
            if (trim((string) $sheet['name']) !== $name) {
                continue;
            }

            $targetRelationId = (string) $sheet
                ->attributes('http://schemas.openxmlformats.org/officeDocument/2006/relationships')['id'];
            break;
        }

        if (!$targetRelationId) {
            return null;
        }

        $rels->registerXPathNamespace('r', 'http://schemas.openxmlformats.org/package/2006/relationships');
        foreach ($rels->xpath('//r:Relationship') ?: [] as $relationship) {
            if ((string) $relationship['Id'] === $targetRelationId) {
                return $this->resolveXlsxPath((string) $relationship['Target']);
            }
        }

        return null;
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

    private function readImagePackage(string $path): array
    {
        return $this->readArchivePackage($path, 'imágenes', ['jpg', 'jpeg', 'png', 'webp']);
    }

    private function readSheetPackage(string $path): array
    {
        return $this->readArchivePackage($path, 'fichas técnicas', ['pdf']);
    }

    /**
     * Agrupa por SKU el contenido de un comprimido (.zip o .rar), quedandose solo
     * con los archivos cuya extension esta en $allowed.
     */
    private function readArchivePackage(string $path, string $label, array $allowed): array
    {
        $groups = [];
        $ignored = 0;
        $errors = [];

        foreach ($this->archiveEntries($path, $label) as $entry) {
            $basename = basename(str_replace('\\', '/', $entry['name']));

            if ($basename === '' || str_starts_with($basename, '.')) {
                continue;
            }

            $extension = mb_strtolower(pathinfo($basename, PATHINFO_EXTENSION));
            $filename = pathinfo($basename, PATHINFO_FILENAME);

            if (!in_array($extension, $allowed, true)) {
                $ignored++;
                continue;
            }

            if (!preg_match('/^(.+?)(?:-(\d+))?$/', $filename, $matches)) {
                $ignored++;
                continue;
            }

            $content = $entry['content'];
            if ($content === false || $content === null || $content === '') {
                $ignored++;
                continue;
            }

            $sku = trim($matches[1]);
            if ($sku === '') {
                $ignored++;
                continue;
            }

            $order = isset($matches[2]) ? (int) $matches[2] : 0;
            $groups[$this->imagePackageKey($sku)][] = [
                'original' => $basename,
                'extension' => $extension,
                'order' => $order,
                'content' => $content,
            ];
        }

        foreach ($groups as &$files) {
            usort($files, function ($a, $b) {
                if ($a['order'] === $b['order']) {
                    return strnatcasecmp($a['original'], $b['original']);
                }

                return $a['order'] <=> $b['order'];
            });
        }

        return compact('groups', 'ignored', 'errors');
    }

    /**
     * Recorre un comprimido detectando el formato por firma binaria, no por extension:
     * el archivo temporal de PHP no conserva el nombre original.
     */
    private function archiveEntries(string $path, string $label): iterable
    {
        $handle = @fopen($path, 'rb');

        if ($handle === false) {
            throw new Exception("No se pudo leer el comprimido de {$label}.");
        }

        $magic = (string) fread($handle, 8);
        fclose($handle);

        if (str_starts_with($magic, "Rar!\x1A\x07")) {
            return $this->rarEntries($path, $label);
        }

        if (str_starts_with($magic, "PK\x03\x04") || str_starts_with($magic, "PK\x05\x06") || str_starts_with($magic, "PK\x07\x08")) {
            return $this->zipEntries($path, $label);
        }

        throw new Exception("El paquete de {$label} debe ser un archivo .zip o .rar válido.");
    }

    private function zipEntries(string $path, string $label): iterable
    {
        $zip = new ZipArchive();

        if ($zip->open($path) !== true) {
            throw new Exception("No se pudo abrir el zip de {$label}.");
        }

        try {
            for ($i = 0; $i < $zip->numFiles; $i++) {
                $entry = $zip->statIndex($i);
                $name = str_replace('\\', '/', $entry['name'] ?? '');

                if ($name === '' || str_ends_with($name, '/')) {
                    continue;
                }

                yield ['name' => $name, 'content' => $zip->getFromIndex($i)];
            }
        } finally {
            $zip->close();
        }
    }

    private function rarEntries(string $path, string $label): iterable
    {
        $directory = $this->makeTempDirectory();

        try {
            $this->extractRar($path, $directory, $label);

            $files = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS)
            );

            foreach ($files as $file) {
                if (!$file->isFile()) {
                    continue;
                }

                yield ['name' => $file->getFilename(), 'content' => @file_get_contents($file->getPathname())];
            }
        } finally {
            $this->deleteDirectory($directory);
        }
    }

    /**
     * PHP no descomprime RAR de forma nativa: se delega en el primer binario disponible.
     */
    private function extractRar(string $path, string $target, string $label): void
    {
        $finder = new ExecutableFinder();

        $candidates = [
            'unrar' => ['x', '-y', '-inul', '-o+', $path, $target . DIRECTORY_SEPARATOR],
            'bsdtar' => ['-x', '-f', $path, '-C', $target],
            '7zz' => ['x', '-y', '-o' . $target, $path],
            '7z' => ['x', '-y', '-o' . $target, $path],
        ];

        foreach ($candidates as $binary => $arguments) {
            $executable = $finder->find($binary);

            if (!$executable) {
                continue;
            }

            $process = new Process(array_merge([$executable], $arguments));
            $process->setTimeout(300);
            $process->run();

            if ($process->isSuccessful()) {
                return;
            }

            $detail = trim($process->getErrorOutput() ?: $process->getOutput());
            throw new Exception("No se pudo descomprimir el rar de {$label}." . ($detail ? " {$detail}" : ''));
        }

        throw new Exception("El servidor no tiene instalado un extractor de RAR (unrar, bsdtar o 7z). Sube el paquete de {$label} en formato .zip.");
    }

    private function makeTempDirectory(): string
    {
        $directory = rtrim(sys_get_temp_dir(), '/\\') . DIRECTORY_SEPARATOR . 'tuboplast-rar-' . Str::random(12);

        if (!mkdir($directory, 0775, true) && !is_dir($directory)) {
            throw new Exception('No se pudo crear el directorio temporal para descomprimir.');
        }

        return $directory;
    }

    private function deleteDirectory(string $directory): void
    {
        if (!is_dir($directory)) {
            return;
        }

        $items = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($items as $item) {
            $item->isDir() ? @rmdir($item->getPathname()) : @unlink($item->getPathname());
        }

        @rmdir($directory);
    }

    private function imagePackageKey(string $sku): string
    {
        return $this->taxonomyLookupKey($sku);
    }

    private function replaceItemImages(Item $item, array $images): int
    {
        $item->loadMissing('images');
        foreach ($item->images as $image) {
            $this->queueFileForDeletion($image->path);
        }
        $item->images()->delete();

        $associated = 0;
        $primaryPath = null;

        foreach (array_values($images) as $index => $image) {
            $path = 'items/' . Str::slug($item->sku ?: 'item-' . $item->id) . '-' . Str::lower(Str::random(10)) . '.' . $image['extension'];
            Storage::disk('public')->put($path, $image['content']);

            $item->images()->create([
                'path' => $path,
                'sort_order' => $index,
            ]);

            $primaryPath ??= $path;
            $associated++;
        }

        if ($primaryPath) {
            if ($item->image && $item->image !== $primaryPath) {
                $this->queueFileForDeletion($item->image);
            }

            $item->forceFill(['image' => $primaryPath])->save();
        }

        return $associated;
    }

    private function replaceSheetsForExistingItems(array $sheetGroups, int $initialIgnored): array
    {
        $matched = 0;
        $sheetsAssociated = 0;
        $sheetsIgnored = $initialIgnored;
        $notFound = 0;
        $ambiguous = 0;
        $errors = [];

        $itemsByKey = Item::query()
            ->whereNotNull('sku')
            ->get(['id', 'sku', 'technical_sheet'])
            ->groupBy(fn ($item) => $this->imagePackageKey((string) $item->sku));

        foreach ($sheetGroups as $skuKey => $sheets) {
            $candidates = $itemsByKey->get($skuKey, collect());

            if ($candidates->isEmpty()) {
                $notFound++;
                $sheetsIgnored += count($sheets);
                $this->pushImportError($errors, "No existe producto para la ficha técnica {$skuKey}.");
                continue;
            }

            if ($candidates->count() > 1) {
                $ambiguous++;
                $sheetsIgnored += count($sheets);
                $this->pushImportError($errors, "Ficha técnica {$skuKey} coincide con más de un producto.");
                continue;
            }

            $item = Item::find($candidates->first()->id);
            if (!$item) {
                $notFound++;
                $sheetsIgnored += count($sheets);
                continue;
            }

            $sheetsAssociated += $this->replaceItemSheet($item, $sheets[0]);
            $sheetsIgnored += max(0, count($sheets) - 1);
            $matched++;
        }

        if ($matched === 0) {
            throw new Exception('No se cargó ninguna ficha técnica: ningún nombre de archivo coincide claramente con un SKU existente.');
        }

        return [
            'matched_items' => $matched,
            'sheets_associated' => $sheetsAssociated,
            'sheets_ignored' => $sheetsIgnored,
            'not_found' => $notFound,
            'ambiguous' => $ambiguous,
            'errors' => $errors,
        ];
    }

    private function replaceItemSheet(Item $item, array $sheet): int
    {
        if ($item->technical_sheet) {
            $this->queueFileForDeletion($item->technical_sheet);
        }

        $path = 'items/sheets/' . Str::slug($item->sku ?: 'item-' . $item->id) . '-' . Str::lower(Str::random(10)) . '.pdf';
        Storage::disk('public')->put($path, $sheet['content']);
        $item->forceFill(['technical_sheet' => $path])->save();

        return 1;
    }

    private function syncManualImageGallery(Request $request, Item $item): void
    {
        if (!Schema::hasTable('item_images')) {
            return;
        }

        if ($request->has('gallery_order')) {
            $item->loadMissing('images');

            $newFiles = array_values($request->file('gallery_images', []));
            $existingImages = $item->images->keyBy(fn ($image) => (string) $image->id);
            $keptExistingIds = [];
            $finalPaths = [];
            $primaryPath = null;
            $sortOrder = 0;

            foreach ($request->input('gallery_order', []) as $token) {
                if (Str::startsWith($token, 'existing:')) {
                    $id = Str::after($token, 'existing:');
                    $image = $existingImages->get((string) $id);
                    if (!$image) {
                        continue;
                    }

                    $image->forceFill(['sort_order' => $sortOrder])->save();
                    $keptExistingIds[] = (int) $image->id;
                    $finalPaths[] = $image->path;
                    $primaryPath ??= $image->path;
                    $sortOrder++;
                    continue;
                }

                if (Str::startsWith($token, 'new:')) {
                    $index = (int) Str::after($token, 'new:');
                    $file = $newFiles[$index] ?? null;
                    if (!$file) {
                        continue;
                    }

                    $path = $file->store('items', 'public');
                    $item->images()->create([
                        'path' => $path,
                        'sort_order' => $sortOrder,
                    ]);
                    $finalPaths[] = $path;
                    $primaryPath ??= $path;
                    $sortOrder++;
                }
            }

            $item->images
                ->filter(fn ($image) => !in_array((int) $image->id, $keptExistingIds, true))
                ->each(function ($image) {
                    $this->queueFileForDeletion($image->path);
                    $image->delete();
                });

            if ($primaryPath && $primaryPath !== $item->image) {
                if ($item->image && !in_array($item->image, $finalPaths, true)) {
                    $this->queueFileForDeletion($item->image);
                }
                $item->forceFill(['image' => $primaryPath])->save();
            }

            return;
        }

        if ($request->hasFile('gallery_images')) {
            $item->loadMissing('images');
            foreach ($item->images as $image) {
                $this->queueFileForDeletion($image->path);
            }
            $item->images()->delete();

            $primaryPath = null;
            foreach (array_values($request->file('gallery_images')) as $index => $file) {
                $path = $file->store('items', 'public');
                $item->images()->create([
                    'path' => $path,
                    'sort_order' => $index,
                ]);
                $primaryPath ??= $path;
            }

            if ($primaryPath && $primaryPath !== $item->image) {
                if ($item->image) {
                    $this->queueFileForDeletion($item->image);
                }
                $item->forceFill(['image' => $primaryPath])->save();
            }

            return;
        }

        if (!$request->hasFile('image') || !$item->image) {
            return;
        }

        $item->loadMissing('images');
        foreach ($item->images as $image) {
            if ($image->path !== $item->image) {
                Storage::disk('public')->delete($image->path);
            }
        }

        $item->images()->delete();
        $item->images()->create([
            'path' => $item->image,
            'sort_order' => 0,
        ]);
    }

    private function queueCurrentItemImageFilesForDeletion(): void
    {
        $paths = Item::query()
            ->whereNotNull('image')
            ->pluck('image');

        $paths = $paths->merge(
            Item::query()
                ->whereNotNull('technical_sheet')
                ->pluck('technical_sheet')
        );

        if (Schema::hasTable('item_images')) {
            $paths = $paths->merge(
                DB::table('item_images')
                    ->whereNotNull('path')
                    ->pluck('path')
            );
        }

        $paths
            ->filter()
            ->unique()
            ->each(fn ($path) => $this->queueFileForDeletion($path));
    }

    private function queueFileForDeletion(?string $path): void
    {
        if (!$path) {
            return;
        }

        $this->filesPendingDeletion[] = $path;
    }

    private function deletePendingFiles(): void
    {
        collect($this->filesPendingDeletion)
            ->filter()
            ->map(fn ($path) => $this->storagePathForPublicDisk((string) $path))
            ->filter()
            ->unique()
            ->each(fn ($path) => Storage::disk('public')->delete($path));

        $this->filesPendingDeletion = [];
    }

    private function storagePathForPublicDisk(string $path): string
    {
        $path = trim($path);

        if (Str::startsWith($path, '/storage/')) {
            return Str::after($path, '/storage/');
        }

        if (Str::startsWith($path, 'storage/')) {
            return Str::after($path, 'storage/');
        }

        return ltrim($path, '/');
    }
}

