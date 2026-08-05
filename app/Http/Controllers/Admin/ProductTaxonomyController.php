<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Category;
use App\Models\Item;
use App\Models\ProductClassification;
use App\Models\ProductLine;
use App\Models\ProductSegment;
use App\Models\ProductType;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Cache;
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

    private function assertUniqueName(string $name, $ignoreId): void
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

    private function lookupKey(string $name): string
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
                'Mineria',
            ],
            ProductLine::class => [
                'Agua Fria',
                'Agua Potable',
                'Alcantarillado',
                'Desague',
                'Electrico',
                'PE (HDPE)',
                'Conduccion de agua a Presion',
            ],
            ProductClassification::class => [
                'Sistema Simple Presion',
                'Sistema Roscado',
                'Clase Liviana',
                'Clase Pesada',
                'SEL',
                'SAP',
                'Sistema Union Flexible (UF)',
                'Sistema Termofusion',
            ],
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
            'aguafria' => 'Agua Fria',
            'aguapotable' => 'Agua Potable',
            'alcantarillado' => 'Alcantarillado',
            'desague' => 'Desague',
            'electrico' => 'Electrico',
            'anillosdecaucho' => 'Anillos de Caucho',
            'claseliviana' => 'Clase Liviana',
            'clasepesada' => 'Clase Pesada',
            'sap' => 'SAP',
            'sel' => 'SEL',
            'sistemaroscado' => 'Sistema Roscado',
            'sistemasimplepresion' => 'Sistema Simple Presion',
            'sistemaunionflexible' => 'Sistema Union Flexible (UF)',
            'sistemaunionflexibleuf' => 'Sistema Union Flexible (UF)',
            'sistematermofusion' => 'Sistema Termofusion',
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
            if (str_contains($key, 'aguafria')) return 'Agua Fria';
            if (str_contains($key, 'aguapotable')) return 'Agua Potable';
            if (str_contains($key, 'alcantarillado')) return 'Alcantarillado';
            if (str_contains($key, 'desague')) return 'Desague';
            if (str_contains($key, 'electrico') || str_contains($key, 'elctrico')) return 'Electrico';
            if (str_contains($key, 'hdpe')) return 'PE (HDPE)';
            if (str_contains($key, 'conducciondeaguaapresion')) return 'Conduccion de agua a Presion';
        }

        if ($this->model === ProductClassification::class) {
            if (str_contains($key, 'sistemaroscado') || preg_match('/(^|pvc)r(aguafria)?$/', $key)) return 'Sistema Roscado';
            if (str_contains($key, 'sistemasimplepresion') || str_contains($key, 'sp')) return 'Sistema Simple Presion';
            if (str_contains($key, 'sistemaunionflexible') || str_contains($key, 'uf')) return 'Sistema Union Flexible (UF)';
            if (str_contains($key, 'sistematermofusion') || str_contains($key, 'termofusion')) return 'Sistema Termofusion';
            if (str_contains($key, 'claseliviana') || str_contains($key, 'clasel') || str_contains($key, 'salcl')) return 'Clase Liviana';
            if (str_contains($key, 'clasepesada') || str_contains($key, 'clasep') || str_contains($key, 'salcp')) return 'Clase Pesada';
            if (str_contains($key, 'sel')) return 'SEL';
            if (str_contains($key, 'sap') || str_contains($key, 'cajasdepase') || str_contains($key, 'cajasdepaso')) return 'SAP';
            if (str_contains($key, 'anillosdecaucho') || str_contains($key, 'anilloscaucho')) return 'Anillos de Caucho';
        }

        return Str::of($value)->lower()->title()->toString();
    }
}
