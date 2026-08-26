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
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductTaxonomyController extends BasicController
{
    public function reactView(Request $request)
    {
        $this->ensureBaseRows();

        return parent::reactView($request);
    }

    public function paginate(Request $request): HttpResponse|ResponseFactory
    {
        $this->ensureBaseRows();

        return parent::paginate($request);
    }

    public function setPaginationInstance(string $model)
    {
        $table = (new $model)->getTable();
        $foreignKey = match ($model) {
            ProductSegment::class => 'product_segment_id',
            ProductLine::class => 'product_line_id',
            ProductClassification::class => 'product_classification_id',
            ProductFamily::class => 'product_family_id',
            ProductType::class => 'product_type_id',
            default => null,
        };

        if (!$foreignKey) {
            return parent::setPaginationInstance($model);
        }

        $activeItemsCount = DB::table('items')
            ->selectRaw('COUNT(DISTINCT items.id)')
            ->where('items.status', true)
            ->whereColumn("items.{$foreignKey}", "{$table}.id");

        return $model::query()
            ->select("{$table}.*")
            ->selectSub($activeItemsCount, 'active_items_count');
    }

    public function beforeSave(Request $request)
    {
        $this->ensureBaseRows();
        $id = $request->input('id');

        $validated = $request->validate([
            'name' => 'required|string|max:160',
            'description' => 'nullable|string|max:1000',
            'status' => 'nullable',
        ]);

        $validated['name'] = trim($validated['name']);
        $this->assertUniqueName($validated['name'], $id);
        $validated['slug'] = Str::slug($validated['name']);

        if (array_key_exists('status', $validated)) {
            $validated['status'] = in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0;
        } else {
            $validated['status'] = 1;
        }

        return [
            'id' => $id,
            ...$validated,
        ];
    }

    protected function assertUniqueName(string $name, $ignoreId): void
    {
        $target = $this->lookupKey($name);
        $exists = $this->model::query()
            ->whereNotNull('status')
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->get()
            ->contains(fn ($row) => $this->lookupKey($row->name) === $target);

        if ($exists) {
            throw ValidationException::withMessages([
                'name' => 'Ya existe un registro con ese nombre.',
            ]);
        }
    }

    protected function lookupKey(string $name): string
    {
        $name = str_replace("\xC2\xA0", ' ', $name);
        $name = preg_replace('/\s+/u', ' ', $name) ?: $name;
        $name = mb_strtolower(trim($name));
        $ascii = function_exists('iconv') ? @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name) : false;

        if ($ascii !== false) {
            $name = $ascii;
        }

        return preg_replace('/[^a-z0-9]/', '', $name) ?: mb_strtoupper(trim($name));
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        Cache::forget('tuboplast.catalog.facets');

        return null;
    }

    public function status(Request $request)
    {
        Cache::forget('tuboplast.catalog.facets');

        return parent::status($request);
    }

    public function delete(Request $request, string $id)
    {
        Cache::forget('tuboplast.catalog.facets');

        return parent::delete($request, $id);
    }

    public function ensureBaseRows(): void
    {
        if ($this->model::query()->exists()) {
            $this->normalizeExistingRows();
            return;
        }

        $base = collect(match ($this->model) {
            ProductSegment::class => [
                'Predial',
                'Edificaciones',
                'Saneamiento',
                'Infraestructura',
                'Agricultura',
                'Minería',
            ],
            ProductLine::class => [
                'Agua Fría',
                'Agua Potable',
                'Alcantarillado',
                'Desagüe',
                'Eléctrico',
                'PE (HDPE)',
                'Conduccion de agua a Presión',
            ],
            ProductClassification::class => [
                'Sistema Simple Presión',
                'Sistema Roscado',
                'Clase Liviana',
                'Clase Pesada',
                'SEL',
                'SAP',
                'Sistema Unión Flexible (UF)',
                'Sistema Termofusión',
            ],
            ProductFamily::class => Item::query()
                ->whereNotNull('family')
                ->distinct()
                ->pluck('family'),
            ProductType::class => [
                'Tubos',
                'Conexiones',
            ],
            default => [],
        })
            ->merge($this->legacyNamesForCurrentModel())
            ->map(fn ($name) => $this->canonicalTaxonomyName($name))
            ->filter()
            ->unique(fn ($name) => $this->lookupKey($name))
            ->values();

        foreach ($base as $name) {
            $this->model::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => null,
                'status' => 1,
            ]);
        }

        $this->syncLegacyItemsForCurrentModel();
        Cache::forget('tuboplast.catalog.facets');
    }

    private function normalizeExistingRows(): void
    {
        $groups = $this->model::query()
            ->get(['id', 'name', 'status'])
            ->groupBy(fn ($row) => $this->lookupKey($this->canonicalTaxonomyName($row->name)));

        foreach ($groups as $rows) {
            $canonical = $this->canonicalTaxonomyName($rows->first()->name);
            $keeper = $rows->sortByDesc(fn ($row) => (bool) $row->status)->sortBy('id')->first();

            $keeper->update([
                'name' => $canonical,
                'slug' => Str::slug($canonical),
            ]);

            foreach ($rows as $row) {
                if ($row->id === $keeper->id) {
                    continue;
                }

                    $foreignKey = match ($this->model) {
                        ProductSegment::class => 'product_segment_id',
                        ProductLine::class => 'product_line_id',
                        ProductClassification::class => 'product_classification_id',
                        ProductFamily::class => 'product_family_id',
                        ProductType::class => 'product_type_id',
                        default => null,
                };

                if ($foreignKey) {
                    Item::query()->where($foreignKey, $row->id)->update([$foreignKey => $keeper->id]);
                }

                $row->delete();
            }
        }

        $this->syncLegacyItemsForCurrentModel();
        Cache::forget('tuboplast.catalog.facets');
    }

    private function legacyNamesForCurrentModel()
    {
        return match ($this->model) {
            ProductSegment::class => Item::query()
                ->whereNotNull('segment')
                ->distinct()
                ->pluck('segment'),
            ProductLine::class => Category::query()
                ->whereIn('id', Item::query()->whereNotNull('category_id')->distinct()->pluck('category_id'))
                ->pluck('name')
                ->merge(Item::query()->whereNotNull('famcons')->distinct()->pluck('famcons')),
            ProductClassification::class => Item::query()
                ->whereNotNull('classification')
                ->distinct()
                ->pluck('classification'),
            ProductFamily::class => Item::query()
                ->whereNotNull('family')
                ->distinct()
                ->pluck('family'),
            ProductType::class => Item::query()
                ->whereNotNull('type')
                ->distinct()
                ->pluck('type'),
            default => collect(),
        };
    }

    private function syncLegacyItemsForCurrentModel(): void
    {
        $rows = $this->model::query()->get(['id', 'name']);

        Item::query()
            ->with('category')
            ->chunkById(100, function ($items) use ($rows) {
                foreach ($items as $item) {
                    $legacyName = match ($this->model) {
                        ProductSegment::class => $item->segment,
                        ProductLine::class => $item->famcons ?: $item->category?->name,
                        ProductClassification::class => $item->classification,
                        ProductFamily::class => $item->family,
                        ProductType::class => $item->type,
                        default => null,
                    };

                    if (!$legacyName) {
                        continue;
                    }

                    $targetKey = $this->lookupKey($this->canonicalTaxonomyName($legacyName));
                    $taxonomy = $rows->first(fn ($row) => $this->lookupKey($row->name) === $targetKey);

                    if (!$taxonomy) {
                        continue;
                    }

                    $payload = match ($this->model) {
                        ProductSegment::class => [
                            'product_segment_id' => $taxonomy->id,
                            'segment' => $taxonomy->name,
                        ],
                        ProductLine::class => [
                            'product_line_id' => $taxonomy->id,
                            'famcons' => $taxonomy->name,
                        ],
                        ProductClassification::class => [
                            'product_classification_id' => $taxonomy->id,
                            'classification' => $taxonomy->name,
                        ],
                        ProductFamily::class => [
                            'product_family_id' => $taxonomy->id,
                            'family' => $taxonomy->name,
                        ],
                        ProductType::class => [
                            'product_type_id' => $taxonomy->id,
                            'type' => $taxonomy->name,
                        ],
                        default => [],
                    };

                    if ($payload) {
                        $item->update($payload);
                    }
                }
            });
    }

    private function canonicalTaxonomyName($value): string
    {
        $value = trim((string) $value);
        $aliases = [
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
            'sistematermofusion' => 'Sistema Termofusión',
            'tubo' => 'Tubos',
            'tubos' => 'Tubos',
            'conexion' => 'Conexiones',
            'conexiones' => 'Conexiones',
            'anillo' => 'Conexiones',
            'anillos' => 'Conexiones',
        ];

        $key = $this->lookupKey($value);

        if (isset($aliases[$key])) {
            return $aliases[$key];
        }

        if ($this->model === ProductLine::class) {
            if (str_contains($key, 'aguafria')) return 'Agua Fría';
            if (str_contains($key, 'aguapotable')) return 'Agua Potable';
            if (str_contains($key, 'alcantarillado')) return 'Alcantarillado';
            if (str_contains($key, 'desagüe')) return 'Desagüe';
            if (str_contains($key, 'eléctrico') || str_contains($key, 'elctrico')) return 'Eléctrico';
            if (str_contains($key, 'hdpe')) return 'PE (HDPE)';
            if (str_contains($key, 'conduccióndeaguaapresión')) return 'Conduccion de agua a Presión';
        }

        if ($this->model === ProductClassification::class) {
            if (str_contains($key, 'sistemaroscado') || preg_match('/(^|pvc)r(aguafria)?$/', $key)) return 'Sistema Roscado';
            if (str_contains($key, 'sistemasimplepresion') || str_contains($key, 'sp')) return 'Sistema Simple Presión';
            if (str_contains($key, 'sistemauniónflexible') || str_contains($key, 'uf')) return 'Sistema Unión Flexible (UF)';
            if (str_contains($key, 'sistematermofusion') || str_contains($key, 'termofusion')) return 'Sistema Termofusión';
            if (str_contains($key, 'claseliviana') || str_contains($key, 'clasel') || str_contains($key, 'salcl')) return 'Clase Liviana';
            if (str_contains($key, 'clasepesada') || str_contains($key, 'clasep') || str_contains($key, 'salcp')) return 'Clase Pesada';
            if (str_contains($key, 'sel')) return 'SEL';
            if (str_contains($key, 'sap') || str_contains($key, 'cajasdepase') || str_contains($key, 'cajasdepaso')) return 'SAP';
            if (str_contains($key, 'anillosdecaucho') || str_contains($key, 'anilloscaucho')) return 'Anillos de Caucho';
        }

        return Str::of($value)->lower()->title()->toString();
    }
}

