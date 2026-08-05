<?php

namespace App\Http\Controllers;

use App\Models\Distribuidor;
use App\Models\Sucursal;
use App\Models\ClubExpert;
use App\Models\AboutPage;
use App\Models\BlogPage;
use App\Models\Message;
use App\Models\Item;
use App\Models\Category;
use App\Models\ProductClassification;
use App\Models\ProductLine;
use App\Models\ProductSegment;
use App\Models\ProductType;
use App\Models\Quote;
use App\Models\Slider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;
use Illuminate\Validation\ValidationException;

class LandingController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';
    public ?string $blogSlug = null;

    public function setReactViewProperties(Request $request)
    {
        $aboutData = $this->normalizeAboutPage(AboutPage::current());
        $blogData = $this->normalizeBlogPage(BlogPage::current());
        $sliderData = $this->normalizeSliders();

        $properties = [
            'token' => csrf_token(),
            'about' => $aboutData,
            'blog' => $blogData,
            'sliders' => $sliderData,
            'expertCategories' => $this->normalizeExpertCategories(),
        ];

        if ($this->reactView === 'BlogPost') {
            $post = $this->resolveBlogPost($blogData['posts'] ?? [], $this->blogSlug);

            if (!$post) {
                abort(404);
            }

            $properties['post'] = $post;
            $properties['postSlug'] = $this->blogSlug;

            $postImage = $post['image_url'] ?? $post['image_fallback'] ?? null;
            $this->seo = [
                'title' => ($post['title'] ?? 'Blog') . ' | ' . env('APP_NAME', 'Tuboplast'),
                'description' => Str::limit(strip_tags($post['description'] ?? $post['lead'] ?? ''), 180),
                'image' => $postImage
                    ? (Str::startsWith($postImage, 'http') ? $postImage : url($postImage))
                    : url('/assets/img/icons/og-image.jpg'),
                'type' => 'article',
                'url' => route('blog.post', ['slug' => $this->blogSlug]),
            ];
        }

        if ($this->reactView === 'Catalog') {
            $paginator = $this->catalogQuery($request)->paginate($this->catalogPerPage($request));

            $properties['items'] = collect($paginator->items())
                ->map(fn ($item) => $this->mapCatalogItem($item))
                ->values();
            $properties['pagination'] = $this->paginationMeta($paginator);
            $properties['facets'] = $this->catalogFacetsForRequest($request);

            $this->seo = [
                'description' => 'Catálogo Tuboplast: tuberías y conexiones de PVC para agua fría, desagüe, instalaciones eléctricas, agua potable y alcantarillado. Filtra por segmento, línea, tipo y diámetro.',
                'url' => route('catalog'),
            ];
        }

        if ($this->reactView === 'Distributors') {
            $properties['distributors'] = Distribuidor::query()
                ->where('status', true)
                ->orderByDesc('featured')
                ->orderBy('department')
                ->orderBy('province')
                ->orderBy('district')
                ->get()
                ->map(fn ($row) => [
                    'id' => $row->id,
                    'name' => $row->name,
                    'department' => $row->department,
                    'province' => $row->province,
                    'district' => $row->district,
                    'address' => $row->address,
                    'reference' => $row->reference,
                    'phone' => $row->phone,
                    'phone_prefix' => $row->phone_prefix,
                    'hours' => $row->business_hours,
                    'highlighted' => (bool) $row->featured,
                    'latitude' => $row->latitude,
                    'longitude' => $row->longitude,
                ])
                ->values();
        }

        if ($this->reactView === 'Contact') {
            $properties['branches'] = Sucursal::query()
                ->where('status', true)
                ->orderBy('id')
                ->get()
                ->map(fn ($row) => [
                    'id' => $row->id,
                    'name' => 'Tuboplast - ' . ($row->district ?: 'Sede'),
                    'department' => $row->department,
                    'province' => $row->province,
                    'district' => $row->district,
                    'address' => $row->address,
                    'reference' => $row->reference,
                    'latitude' => $row->latitude !== null ? (float) $row->latitude : null,
                    'longitude' => $row->longitude !== null ? (float) $row->longitude : null,
                ])
                ->values();
        }

        $sectionTitles = [
            'Catalog' => 'Catálogo de productos',
            'Blog' => 'Blog técnico',
            'AboutFamilia' => 'Nosotros · Familia e historia',
            'AboutPolitica' => 'Política del Sistema de Gestión Integrado',
            'Contact' => 'Contacto y asesoría técnica',
            'Distributors' => 'Distribuidores autorizados',
            'Club' => 'Club Experto Tuboplast',
        ];

        if (empty($this->seo['title']) && !empty($sectionTitles[$this->reactView])) {
            $this->seo['title'] = $sectionTitles[$this->reactView] . ' | ' . env('APP_NAME', 'Tuboplast');
        }

        return $properties;
    }

    public function catalogItems(Request $request)
    {
        $paginator = $this->catalogQuery($request)->paginate($this->catalogPerPage($request));

        return response()->json([
            'data' => collect($paginator->items())
                ->map(fn ($item) => $this->mapCatalogItem($item))
                ->values(),
            'meta' => $this->paginationMeta($paginator),
            'facets' => $this->catalogFacetsForRequest($request),
        ]);
    }

    private function catalogPerPage(Request $request): int
    {
        $perPage = (int) $request->query('per_page', 12);

        return max(3, min($perPage, 48));
    }

    private function catalogQuery(Request $request)
    {
        $query = $this->catalogBaseQuery();
        $this->applyCatalogSearch($query, $request);
        $this->applyCatalogFilters($query, $request);

        $sort = $request->query('sort', 'popular');
        if ($sort === 'name-asc') {
            $query->orderBy('title');
        } elseif ($sort === 'name-desc') {
            $query->orderByDesc('title');
        } else {
            $query->orderByDesc('views')->orderBy('title');
        }

        return $query;
    }

    private function catalogBaseQuery()
    {
        return Item::query()
            ->where('status', true)
            ->with('category', 'productSegment', 'productSegments', 'productLine', 'productClassification', 'productType');
    }

    private function applyCatalogSearch($query, Request $request): void
    {
        $term = trim((string) $request->query('q', ''));
        if ($term === '') {
            return;
        }

        $query->where(function ($where) use ($term) {
            $where->where('title', 'like', "%{$term}%")
                ->orWhere('sku', 'like', "%{$term}%")
                ->orWhere('classification', 'like', "%{$term}%")
                ->orWhereHas('productLine', fn ($c) => $c->where('name', 'like', "%{$term}%"))
                ->orWhereHas('productClassification', fn ($c) => $c->where('name', 'like', "%{$term}%"))
                ->orWhereHas('category', fn ($c) => $c->where('name', 'like', "%{$term}%"));
        });
    }

    private function applyCatalogFilters($query, Request $request, ?string $until = null): void
    {
        $hasProductLines = ProductLine::query()->exists();

        foreach (['segment', 'line', 'classification', 'type'] as $group) {
            if ($until === $group) {
                return;
            }

            $values = array_filter((array) $request->query($group, []));
            if (!$values) {
                continue;
            }

            if ($group === 'segment') {
                $this->whereSegmentTaxonomy($query, $values);
            } elseif ($group === 'line') {
                $query->where(function ($where) use ($values, $hasProductLines) {
                    $this->whereTaxonomy($where, 'product_line_id', ProductLine::class, $values, null);
                    if (!$hasProductLines) {
                        $where->orWhereHas('category', fn ($c) => $c->whereIn('name', $values));
                    }
                });
            } elseif ($group === 'classification') {
                $this->whereTaxonomy($query, 'product_classification_id', ProductClassification::class, $values, 'classification');
            } elseif ($group === 'type') {
                $this->whereTaxonomy($query, 'product_type_id', ProductType::class, $values, 'type');
            }
        }
    }

    private function catalogFacetsForRequest(Request $request): array
    {
        $segmentQuery = $this->catalogBaseQuery();
        $this->applyCatalogSearch($segmentQuery, $request);

        $lineQuery = $this->catalogBaseQuery();
        $this->applyCatalogSearch($lineQuery, $request);
        $this->applyCatalogFilters($lineQuery, $request, 'line');

        $classificationQuery = $this->catalogBaseQuery();
        $this->applyCatalogSearch($classificationQuery, $request);
        $this->applyCatalogFilters($classificationQuery, $request, 'classification');

        $typeQuery = $this->catalogBaseQuery();
        $this->applyCatalogSearch($typeQuery, $request);
        $this->applyCatalogFilters($typeQuery, $request, 'type');

        return [
            'segment' => $this->segmentFacetFromQuery($segmentQuery),
            'line' => $this->lineFacetFromQuery($lineQuery),
            'classification' => $this->taxonomyFacetFromQuery($classificationQuery, ProductClassification::class, 'product_classification_id', 'classification'),
            'type' => $this->taxonomyFacetFromQuery($typeQuery, ProductType::class, 'product_type_id', 'type'),
        ];
    }

    private function catalogFacets(): array
    {
        // Cacheado para que siga siendo barato aunque el catálogo crezca a miles de productos.
        return Cache::remember('tuboplast.catalog.facets', now()->addMinutes(10), function () {
            return [
                'segment' => $this->segmentFacet(),
                'line' => $this->lineFacet(),
                'classification' => $this->taxonomyFacet(ProductClassification::class, 'product_classification_id', 'classification'),
                'type' => $this->taxonomyFacet(ProductType::class, 'product_type_id', 'type'),
            ];
        });
    }

    private function whereTaxonomy($query, string $foreignKey, string $model, array $values, ?string $legacyColumn): void
    {
        $hasTaxonomies = $model::query()->exists();
        $selectedKeys = collect($values)
            ->map(fn ($value) => $this->facetLookupKey($this->canonicalFacetLabel($value)))
            ->filter()
            ->values();

        $ids = $model::query()
            ->where('status', true)
            ->get(['id', 'name'])
            ->filter(fn ($row) => $selectedKeys->contains($this->facetLookupKey($this->canonicalFacetLabel($row->name))))
            ->pluck('id')
            ->all();

        $legacyValues = collect($values)
            ->flatMap(fn ($value) => $this->legacyFacetAliases($value))
            ->unique(fn ($value) => $this->facetLookupKey($value))
            ->values()
            ->all();

        $query->where(function ($where) use ($foreignKey, $ids, $legacyValues, $legacyColumn, $hasTaxonomies) {
            if ($ids) {
                $where->whereIn($foreignKey, $ids);
            }

            if ($legacyColumn && !$hasTaxonomies) {
                $ids ? $where->orWhereIn($legacyColumn, $legacyValues) : $where->whereIn($legacyColumn, $legacyValues);
            }
        });
    }

    private function whereSegmentTaxonomy($query, array $values): void
    {
        $selectedKeys = collect($values)
            ->flatMap(fn ($value) => $this->segmentLabelsFor($value))
            ->map(fn ($value) => $this->facetLookupKey($value))
            ->filter()
            ->unique()
            ->values();

        if ($selectedKeys->isEmpty()) {
            return;
        }

        $ids = ProductSegment::query()
            ->where('status', true)
            ->get(['id', 'name'])
            ->filter(fn ($row) => $selectedKeys->contains($this->facetLookupKey($row->name)))
            ->pluck('id')
            ->all();

        $legacyValues = collect($values)
            ->flatMap(fn ($value) => $this->segmentLegacyAliases($value))
            ->unique(fn ($value) => $this->facetLookupKey($value))
            ->values()
            ->all();

        $query->where(function ($where) use ($ids, $legacyValues) {
            $hasCondition = false;

            if ($ids && Schema::hasTable('item_product_segment')) {
                $where->whereHas('productSegments', fn ($segment) => $segment->whereIn('product_segments.id', $ids));
                $hasCondition = true;
            }

            if ($ids) {
                $hasCondition ? $where->orWhereIn('product_segment_id', $ids) : $where->whereIn('product_segment_id', $ids);
                $hasCondition = true;
            }

            if (!$hasCondition && $legacyValues) {
                $where->whereIn('segment', $legacyValues);
            }
        });
    }

    private function taxonomyFacet(string $model, string $foreignKey, string $legacyColumn)
    {
        $hasTaxonomies = $model::query()->exists();
        $fromRelations = $model::query()
            ->where('status', true)
            ->whereIn('id', Item::query()->where('status', true)->whereNotNull($foreignKey)->distinct()->pluck($foreignKey))
            ->pluck('name');

        if ($hasTaxonomies || $fromRelations->isNotEmpty()) {
            return $fromRelations->pipe(fn ($values) => $this->cleanFacetValues($values));
        }

        return Item::query()
            ->where('status', true)
            ->whereNotNull($legacyColumn)
            ->distinct()
            ->pluck($legacyColumn)
            ->map(fn ($value) => $this->canonicalFacetLabel($value))
            ->pipe(fn ($values) => $this->cleanFacetValues($values));
    }

    private function segmentFacet()
    {
        $fromPivot = collect();

        if (Schema::hasTable('item_product_segment')) {
            $fromPivot = ProductSegment::query()
                ->where('status', true)
                ->whereIn('id', function ($query) {
                    $query->select('item_product_segment.product_segment_id')
                        ->from('item_product_segment')
                        ->join('items', 'items.id', '=', 'item_product_segment.item_id')
                        ->where('items.status', true);
                })
                ->pluck('name');
        }

        $fromPrimary = ProductSegment::query()
            ->where('status', true)
            ->whereIn('id', Item::query()->where('status', true)->whereNotNull('product_segment_id')->distinct()->pluck('product_segment_id'))
            ->pluck('name');

        return $fromPivot
            ->merge($fromPrimary)
            ->pipe(fn ($values) => $this->cleanFacetValues($values));
    }

    private function taxonomyFacetFromQuery($query, string $model, string $foreignKey, string $legacyColumn)
    {
        $hasTaxonomies = $model::query()->exists();
        $fromRelations = $model::query()
            ->where('status', true)
            ->whereIn('id', (clone $query)->whereNotNull($foreignKey)->distinct()->pluck($foreignKey))
            ->pluck('name');

        if ($hasTaxonomies || $fromRelations->isNotEmpty()) {
            return $fromRelations->pipe(fn ($values) => $this->cleanFacetValues($values));
        }

        return (clone $query)
            ->whereNotNull($legacyColumn)
            ->distinct()
            ->pluck($legacyColumn)
            ->map(fn ($value) => $this->canonicalFacetLabel($value))
            ->pipe(fn ($values) => $this->cleanFacetValues($values));
    }

    private function segmentFacetFromQuery($query)
    {
        $itemIds = (clone $query)->pluck('items.id');
        $fromPivot = collect();

        if (Schema::hasTable('item_product_segment')) {
            $fromPivot = ProductSegment::query()
                ->where('status', true)
                ->whereIn('id', function ($segmentQuery) use ($itemIds) {
                    $segmentQuery->select('product_segment_id')
                        ->from('item_product_segment')
                        ->whereIn('item_id', $itemIds);
                })
                ->pluck('name');
        }

        $fromPrimary = ProductSegment::query()
            ->where('status', true)
            ->whereIn('id', (clone $query)->whereNotNull('product_segment_id')->distinct()->pluck('product_segment_id'))
            ->pluck('name');

        return $fromPivot
            ->merge($fromPrimary)
            ->pipe(fn ($values) => $this->cleanFacetValues($values));
    }

    private function lineFacet()
    {
        $hasTaxonomies = ProductLine::query()->exists();
        $fromRelations = ProductLine::query()
            ->where('status', true)
            ->whereIn('id', Item::query()->where('status', true)->whereNotNull('product_line_id')->distinct()->pluck('product_line_id'))
            ->pluck('name');

        if ($hasTaxonomies || $fromRelations->isNotEmpty()) {
            return $fromRelations->pipe(fn ($values) => $this->cleanFacetValues($values));
        }

        return Category::query()
            ->whereIn('id', Item::query()->where('status', true)->distinct()->pluck('category_id'))
            ->pluck('name')
            ->map(fn ($value) => $this->canonicalFacetLabel($value))
            ->pipe(fn ($values) => $this->cleanFacetValues($values));
    }

    private function lineFacetFromQuery($query)
    {
        $hasTaxonomies = ProductLine::query()->exists();
        $fromRelations = ProductLine::query()
            ->where('status', true)
            ->whereIn('id', (clone $query)->whereNotNull('product_line_id')->distinct()->pluck('product_line_id'))
            ->pluck('name');

        if ($hasTaxonomies || $fromRelations->isNotEmpty()) {
            return $fromRelations->pipe(fn ($values) => $this->cleanFacetValues($values));
        }

        return Category::query()
            ->whereIn('id', (clone $query)->whereNotNull('category_id')->distinct()->pluck('category_id'))
            ->pluck('name')
            ->map(fn ($value) => $this->canonicalFacetLabel($value))
            ->pipe(fn ($values) => $this->cleanFacetValues($values));
    }

    private function cleanFacetValues($values)
    {
        return collect($values)
            ->map(function ($value) {
                $value = str_replace("\xC2\xA0", ' ', (string) $value);
                $value = preg_replace('/\s+/u', ' ', $value) ?: $value;

                return trim($value);
            })
            ->filter()
            ->unique(fn ($value) => $this->facetLookupKey($value))
            ->sort(fn ($a, $b) => strnatcasecmp((string) $a, (string) $b))
            ->values();
    }

    private function facetLookupKey(string $value): string
    {
        $value = mb_strtolower(trim($value));
        $ascii = function_exists('iconv') ? @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) : false;

        if ($ascii !== false) {
            $value = $ascii;
        }

        return preg_replace('/[^a-z0-9]/', '', $value) ?: mb_strtoupper(trim($value));
    }

    private function canonicalFacetLabel($value): string
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
            'tubo' => 'Tubos',
            'tubos' => 'Tubos',
            'conexion' => 'Conexiones',
            'conexiones' => 'Conexiones',
            'anillo' => 'Conexiones',
            'anillos' => 'Conexiones',
        ];

        return $aliases[$this->facetLookupKey($value)] ?? Str::of($value)->lower()->title()->toString();
    }

    private function legacyFacetAliases($value): array
    {
        $canonical = $this->canonicalFacetLabel($value);

        $aliases = [
            'Agricultura' => ['Agricultura', 'AGRICULTURA'],
            'Mineria' => ['Mineria', 'Minería', 'MINERIA', 'MINERÍA'],
            'Tubos' => ['Tubos', 'TUBOS', 'Tubo', 'TUBO'],
            'Conexiones' => ['Conexiones', 'CONEXIONES', 'Conexion', 'Conexión', 'CONEXION', 'CONEXIÓN', 'Anillos', 'ANILLOS'],
            'Sistema Simple Presion' => ['Sistema Simple Presion', 'Sistema Simple Presión', 'SISTEMA SIMPLE PRESION', 'SISTEMA SIMPLE PRESIÓN'],
            'Sistema Union Flexible (UF)' => ['Sistema Union Flexible (UF)', 'Sistema Union Flexible', 'SISTEMA UNION FLEXIBLE', 'SISTEMA UNION FLEXIBLE (UF)'],
        ];

        return $aliases[$canonical] ?? [$canonical, (string) $value];
    }

    private function segmentLabelsFor($value): array
    {
        $key = $this->facetLookupKey((string) $value);

        return match ($key) {
            default => [$this->canonicalFacetLabel($value)],
        };
    }

    private function segmentLegacyAliases($value): array
    {
        $key = $this->facetLookupKey((string) $value);

        return match ($key) {
            'predial' => ['Predial', 'PREDIAL'],
            'edificaciones' => ['Edificaciones'],
            'saneamiento' => ['Saneamiento'],
            'infraestructura' => ['Infraestructura', 'INFRAESTRUCTURA'],
            default => $this->legacyFacetAliases($value),
        };
    }

    private function paginationMeta($paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'total' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ];
    }

    private function moneyLabel(?float $price, ?string $currency): ?string
    {
        if ($price === null) {
            return null;
        }

        $symbol = strtoupper((string) $currency) === 'USD' ? '$ ' : 'S/ ';

        return $symbol . number_format($price, 2);
    }

    private function mapCatalogItem(Item $item): array
    {
        $price = $item->price !== null ? (float) $item->price : null;
        $diameters = is_array($item->diameters) ? $item->diameters : [];
        $segments = $item->productSegments->pluck('name')->filter()->values();
        $segmentLabel = $segments->isNotEmpty()
            ? $segments->join(' · ')
            : ($item->productSegment->name ?? $item->segment);

        return [
            'id' => $item->id,
            'sku' => $item->sku,
            'title' => $item->title,
            'categoryLabel' => $item->productLine->name ?? $item->category->name ?? 'Producto',
            'segment' => $segmentLabel,
            'segments' => $segments,
            'classification' => $item->productClassification->name ?? $item->classification,
            'type' => $item->productType->name ?? $item->type,
            'use' => $item->use_type,
            'material' => $item->material,
            'color' => $item->color,
            'image' => $item->image ? '/storage/' . $item->image : '/assets/img/items/item-1.png',
            'price' => $this->moneyLabel($price, $item->currency),
            'unitPrice' => $price,
            'currency' => strtoupper($item->currency ?: 'PEN'),
            'pressure' => $this->shortPressure($item->pressure),
            'diameter' => $item->nominal_diameter ?: ($item->diameter ?: $this->diameterLabel($diameters)),
            'diameters' => $diameters,
            'views' => (int) $item->views,
            'detailUrl' => $item->slug
                ? route('products.show', ['slug' => $item->slug])
                : route('catalog'),
        ];
    }

    private function normalizeSliders(): array
    {
        if (!Schema::hasTable('sliders')) {
            return [];
        }

        return Slider::query()
            ->where('status', true)
            ->with('item.category')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function (Slider $slider) {
                return [
                    'id' => $slider->id,
                    'title' => $slider->title,
                    'description' => $slider->description,
                    'image_path' => $slider->image,
                    'image_url' => $slider->image ? '/storage/' . $slider->image : null,
                    'primary_button_text' => $slider->primary_button_text,
                    'primary_button_link' => $slider->primary_button_link,
                    'secondary_button_text' => $slider->secondary_button_text,
                    'secondary_button_link' => $slider->secondary_button_link,
                    'metrics' => [
                        [
                            'value' => $slider->metric_one_value,
                            'label' => $slider->metric_one_label,
                        ],
                        [
                            'value' => $slider->metric_two_value,
                            'label' => $slider->metric_two_label,
                        ],
                    ],
                    'item' => $slider->item ? $this->mapHeroItem($slider->item) : null,
                ];
            })
            ->values()
            ->all();
    }

    private function normalizeExpertCategories(): array
    {
        if (
            !Schema::hasTable('product_segments')
            || !Schema::hasTable('item_product_segment')
            || !Schema::hasColumn('product_segments', 'featured')
        ) {
            return [];
        }

        return ProductSegment::query()
            ->where('status', true)
            ->where('featured', true)
            ->whereHas('items', fn ($items) => $items->where('items.status', true))
            ->orderBy('featured_order')
            ->orderBy('id')
            ->get()
            ->map(function (ProductSegment $segment) {
                return [
                    'id' => $segment->id,
                    'title' => $segment->name,
                    'image' => $this->expertCategoryImageUrl($segment->image),
                    'segment' => $segment->name,
                    'href' => route('catalog') . '?segment%5B%5D=' . rawurlencode($segment->name),
                ];
            })
            ->values()
            ->all();
    }

    private function expertCategoryImageUrl(?string $image): string
    {
        if (!$image) {
            return '/assets/img/categories/category-1.webp';
        }

        if (Str::startsWith($image, ['http://', 'https://', '/'])) {
            return $image;
        }

        if (Str::startsWith($image, 'assets/')) {
            return '/' . $image;
        }

        return '/storage/' . $image;
    }

    private function mapHeroItem(Item $item): array
    {
        $catalogItem = $this->mapCatalogItem($item);

        return [
            ...$catalogItem,
            'description' => $item->description
                ? Str::limit(strip_tags($item->description), 180)
                : 'Producto destacado Tuboplast para proyectos profesionales.',
            'material' => $item->material,
            'pressure' => $this->shortPressure($item->pressure),
            'specOneLabel' => 'Material',
            'specOneValue' => $item->material ?: ($item->category->name ?? 'Tuboplast'),
            'specTwoLabel' => 'Normativa',
            'specTwoValue' => $this->shortPressure($item->pressure ?: $item->use_type),
        ];
    }

    public function searchProducts(Request $request)
    {
        $term = trim((string) $request->query('q', ''));

        if (mb_strlen($term) < 2) {
            return response()->json(['data' => []]);
        }

        $items = Item::query()
            ->where('status', true)
            ->with('category')
            ->with('productSegments', 'productLine', 'productClassification', 'productType')
            ->where(function ($query) use ($term) {
                $query->where('title', 'like', "%{$term}%")
                    ->orWhere('sku', 'like', "%{$term}%")
                    ->orWhere('classification', 'like', "%{$term}%")
                    ->orWhereHas('productLine', fn ($c) => $c->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('productClassification', fn ($c) => $c->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('category', fn ($c) => $c->where('name', 'like', "%{$term}%"));
            })
            ->orderByDesc('views')
            ->orderBy('title')
            ->limit(8)
            ->get()
            ->map(function ($item) {
                $price = $item->price !== null ? (float) $item->price : null;

                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'categoryLabel' => $item->productLine->name ?? $item->category->name ?? 'Producto',
                    'type' => $item->productType->name ?? $item->type,
                    'image' => $item->image ? '/storage/' . $item->image : '/assets/img/items/item-1.png',
                    'price' => $this->moneyLabel($price, $item->currency),
                    'detailUrl' => $item->slug
                        ? route('products.show', ['slug' => $item->slug])
                        : route('catalog'),
                ];
            });

        return response()->json(['data' => $items]);
    }

    public function catalogView(Request $request)
    {
        $this->reactView = 'Catalog';

        return parent::reactView($request);
    }

    public function distributorsView(Request $request)
    {
        $this->reactView = 'Distributors';

        return parent::reactView($request);
    }

    public function aboutView(Request $request)
    {
        $this->reactView = 'AboutFamilia';

        return parent::reactView($request);
    }

    public function aboutMedia(Request $request, string $path)
    {
        $path = ltrim($path, '/');
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $absolute = storage_path('app/public/' . $path);
        $mime = File::mimeType($absolute) ?: 'application/octet-stream';
        $content = Storage::disk('public')->get($path);

        return response($content, 200, [
            'Content-Type' => $mime,
            'Content-Disposition' => str_starts_with($mime, 'image/')
                ? 'inline'
                : 'inline; filename="' . basename($path) . '"',
        ]);
    }

    public function blogMedia(Request $request, string $path)
    {
        $path = ltrim($path, '/');
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $absolute = storage_path('app/public/' . $path);
        $mime = File::mimeType($absolute) ?: 'application/octet-stream';
        $content = Storage::disk('public')->get($path);

        return response($content, 200, [
            'Content-Type' => $mime,
            'Content-Disposition' => str_starts_with($mime, 'image/')
                ? 'inline'
                : 'inline; filename="' . basename($path) . '"',
        ]);
    }

    public function aboutFamiliaView(Request $request)
    {
        $this->reactView = 'AboutFamilia';

        return parent::reactView($request);
    }

    public function aboutPoliticaView(Request $request)
    {
        $this->reactView = 'AboutPolitica';

        return parent::reactView($request);
    }

    public function contactView(Request $request)
    {
        $this->reactView = 'Contact';

        return parent::reactView($request);
    }

    public function clubView(Request $request)
    {
        $this->reactView = 'Club';

        return parent::reactView($request);
    }

    public function blogView(Request $request)
    {
        $this->reactView = 'Blog';

        return parent::reactView($request);
    }

    public function blogPostView(Request $request, string $slug)
    {
        $this->reactView = 'BlogPost';
        $this->blogSlug = $slug;

        return parent::reactView($request);
    }

    public function storeContact(Request $request)
    {
        $validated = $request->validate([
            'business' => 'nullable|string|max:160',
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:180',
            'celular' => 'required|digits:9',
            'ruc' => 'nullable|digits:11',
            'service' => 'nullable|string|max:160',
            'source' => 'nullable|string|max:60',
            'message' => 'required|string|max:2000',
        ]);

        $tracking = $this->detectClientTracking($request);

        Message::create([
            'business' => $validated['business'] ?? null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'celular' => $validated['celular'],
            'ruc' => $validated['ruc'] ?? null,
            'service' => $validated['service'] ?? null,
            'source' => $validated['source'] ?? 'landing',
            'message' => $validated['message'],
            ...$tracking,
            'seen' => false,
            'status' => true,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Gracias. Tu mensaje fue enviado correctamente.',
        ]);
    }

    public function storeClub(Request $request)
    {
        $validated = $request->validate([
            'accepted' => 'accepted',
            'department' => 'required|string|max:120',
            'district' => 'required|string|max:120',
            'dni' => 'required|string|min:8|max:12',
            'email' => 'required|email|max:180',
            'celular' => 'required|digits:9',
            'name' => 'required|string|max:120',
            'province' => 'required|string|max:120',
            'specialty' => 'required|string|max:120',
            'ubigeo' => 'required|string|max:12',
        ]);

        if (!$this->hasValidUbigeo($validated)) {
            throw ValidationException::withMessages([
                'district' => 'Selecciona una ubicación válida.',
            ]);
        }

        ClubExpert::create([
            'name' => $validated['name'],
            'dni' => $validated['dni'],
            'email' => $validated['email'],
            'celular' => $validated['celular'],
            'specialty' => $validated['specialty'],
            'department' => $validated['department'],
            'province' => $validated['province'],
            'district' => $validated['district'],
            'ubigeo' => $validated['ubigeo'],
            'accepted_terms' => true,
            ...$this->detectClientTracking($request),
            'seen' => false,
            'status' => true,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Gracias. Tu solicitud fue registrada correctamente.',
        ]);
    }

    public function storeQuote(Request $request)
    {
        $validated = $request->validate([
            'accepted' => 'accepted',
            'name' => 'required|string|max:120',
            'business' => 'nullable|string|max:160',
            'ruc' => 'nullable|digits:11',
            'email' => 'required|email|max:180',
            'phone_prefix' => 'nullable|string|max:8',
            'phone' => 'nullable|string|max:30',
            'department' => 'required|string|max:120',
            'province' => 'required|string|max:120',
            'district' => 'required|string|max:120',
            'ubigeo' => 'required|string|max:12',
            'observations' => 'nullable|string|max:2000',
            'items' => 'required|array|min:1',
            'items.*.title' => 'required|string|max:255',
            'items.*.sku' => 'nullable|string|max:120',
            'items.*.image' => 'nullable|string|max:500',
            'items.*.detailUrl' => 'nullable|string|max:500',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'nullable|string|max:40',
            'items.*.unitPrice' => 'nullable|numeric',
            'items.*.currency' => 'nullable|string|max:3',
        ]);

        $items = array_map(function ($item) {
            return [
                'title' => $item['title'],
                'sku' => $item['sku'] ?? null,
                'image' => $item['image'] ?? null,
                'detailUrl' => $item['detailUrl'] ?? null,
                'quantity' => max(1, (int) $item['quantity']),
                'price' => $item['price'] ?? null,
                'unitPrice' => isset($item['unitPrice']) ? (float) $item['unitPrice'] : null,
                'currency' => strtoupper($item['currency'] ?? 'PEN'),
            ];
        }, $validated['items']);

        if (!$this->hasValidUbigeo($validated)) {
            throw ValidationException::withMessages([
                'district' => 'Selecciona una ubicación válida.',
            ]);
        }

        $totalItems = array_sum(array_column($items, 'quantity'));
        $location = trim(implode(', ', array_filter([
            $validated['district'] ?? null,
            $validated['province'] ?? null,
            $validated['department'] ?? null,
        ])));

        $quote = Quote::create([
            'name' => $validated['name'],
            'business' => $validated['business'] ?? null,
            'ruc' => $validated['ruc'] ?? null,
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'phone_prefix' => $validated['phone_prefix'] ?? null,
            'region' => $location ?: null,
            'department' => $validated['department'],
            'province' => $validated['province'],
            'district' => $validated['district'],
            'ubigeo' => $validated['ubigeo'],
            'observations' => $validated['observations'] ?? null,
            'accepted_terms' => true,
            'items' => $items,
            'total_items' => $totalItems,
            ...$this->detectClientTracking($request),
            'seen' => false,
            'status' => true,
        ]);

        $quote->update([
            'code' => 'COT-' . now()->format('Y') . '-' . str_pad((string) $quote->id, 5, '0', STR_PAD_LEFT),
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Tu cotización fue registrada correctamente.',
            'data' => [
                'id' => $quote->id,
                'code' => $quote->code,
                'created_at' => $quote->created_at?->toIso8601String(),
            ],
        ]);
    }

    private function shortPressure(?string $pressure): string
    {
        if (!$pressure) {
            return '-';
        }

        $low = mb_strtolower($pressure);
        if (str_contains($low, 'no aplica')) return 'No aplica';
        if (str_contains($low, 'gravedad') || str_contains($low, 'sin presion')) return 'Gravedad';
        if (str_contains($low, 'roscado')) return 'Roscado';
        if (preg_match('/PN-?[\d.]+/i', $pressure, $m)) return strtoupper($m[0]);
        if (preg_match('/C-?[\d.]+/i', $pressure, $m)) return strtoupper($m[0]);
        if (preg_match('/[\d.]+\s*bar/i', $pressure, $m)) return $m[0];
        if (preg_match('/Sn\d[\w.-]*/i', $pressure, $m)) return strtoupper($m[0]);

        return mb_strlen($pressure) > 16 ? (mb_substr($pressure, 0, 14) . '…') : $pressure;
    }

    private function diameterLabel(array $diameters): string
    {
        if (!count($diameters)) {
            return '-';
        }

        if (count($diameters) === 1) {
            return $diameters[0];
        }

        return $diameters[0] . ' – ' . end($diameters);
    }

    private function hasValidUbigeo(array $data): bool
    {
        $path = storage_path('app/utils/ubigeo-inei.json');
        if (!File::exists($path)) return false;

        $rows = json_decode(File::get($path), true);
        if (!is_array($rows)) return false;

        foreach ($rows as $row) {
            if (
                ($row['code'] ?? null) === $data['ubigeo']
                && ($row['department'] ?? null) === $data['department']
                && ($row['province'] ?? null) === $data['province']
                && ($row['district'] ?? null) === $data['district']
            ) {
                return true;
            }
        }

        return false;
    }

    private function detectClientTracking(Request $request): array
    {
        $userAgent = $request->userAgent() ?? '';

        return [
            'ip_address' => $request->ip(),
            'browser' => $this->detectBrowser($userAgent),
            'device_type' => preg_match('/Mobile|Android|iPhone|iPod|iPad|Tablet|IEMobile|Opera Mini/i', $userAgent)
                ? 'mobile'
                : 'desktop',
            'operating_system' => $this->detectOperatingSystem($userAgent),
            'user_agent' => $userAgent ?: null,
        ];
    }

    private function detectBrowser(string $userAgent): string
    {
        $browsers = [
            'Edge' => '/Edg(?:A|iOS)?\/([\d.]+)/i',
            'Opera' => '/(?:OPR|Opera)\/([\d.]+)/i',
            'Chrome' => '/(?:Chrome|CriOS)\/([\d.]+)/i',
            'Firefox' => '/(?:Firefox|FxiOS)\/([\d.]+)/i',
            'Safari' => '/Version\/([\d.]+).*Safari/i',
            'Internet Explorer' => '/(?:MSIE\s|Trident\/.*rv:)([\d.]+)/i',
        ];

        foreach ($browsers as $name => $pattern) {
            if (preg_match($pattern, $userAgent, $matches)) {
                return "{$name} {$matches[1]}";
            }
        }

        return 'Desconocido';
    }

    private function detectOperatingSystem(string $userAgent): string
    {
        $operatingSystems = [
            'Windows' => '/Windows NT/i',
            'Android' => '/Android/i',
            'iOS' => '/iPhone|iPad|iPod/i',
            'macOS' => '/Mac OS X|Macintosh/i',
            'Chrome OS' => '/CrOS/i',
            'Linux' => '/Linux/i',
        ];

        foreach ($operatingSystems as $name => $pattern) {
            if (preg_match($pattern, $userAgent)) {
                return $name;
            }
        }

        return 'Desconocido';
    }

    private function normalizeAboutPage(AboutPage $about): array
    {
        $aboutData = $about->toArray();
        $aboutData['family_image_url'] = $about->family_image ? route('about.media', ['path' => $about->family_image]) : null;
        $aboutData['policy_image_url'] = $about->policy_image ? route('about.media', ['path' => $about->policy_image]) : null;
        $aboutData['certifications'] = array_map(function ($item) {
            return [
                'title' => $item['title'] ?? '',
                'description' => $item['description'] ?? '',
                'image_path' => $item['image_path'] ?? null,
                'image_url' => !empty($item['image_path']) ? route('about.media', ['path' => $item['image_path']]) : null,
                'file_path' => $item['file_path'] ?? null,
                'file_url' => !empty($item['file_path']) ? route('about.media', ['path' => $item['file_path']]) : null,
            ];
        }, is_array($aboutData['certifications'] ?? null) ? $aboutData['certifications'] : []);

        return $aboutData;
    }

    private function normalizeBlogPage(BlogPage $blog): array
    {
        $blogData = $blog->toArray();
        $blogData['hero_image_url'] = $blog->hero_image ? route('blog.media', ['path' => $blog->hero_image]) : null;
        $fallbacks = [
            '/assets/img/categories/category-1.png',
            '/assets/img/categories/category-2.png',
            '/assets/img/categories/category-3.png',
            '/assets/img/categories/category-1.png',
            '/assets/img/categories/category-2.png',
            '/assets/img/categories/category-3.png',
        ];

        $posts = is_array($blogData['posts'] ?? null) ? $blogData['posts'] : [];
        $blogData['posts'] = array_map(function ($item, $index) use ($fallbacks) {
            $imagePath = $item['image_path'] ?? null;
            $slug = $this->blogPostSlug($item['slug'] ?? ($item['title'] ?? 'post'), $index);

            return [
                'slug' => $slug,
                'detail_url' => route('blog.post', ['slug' => $slug]),
                'category' => $item['category'] ?? '',
                'title' => $item['title'] ?? '',
                'description' => $item['description'] ?? '',
                'eyebrow' => $item['eyebrow'] ?? '',
                'author' => $item['author'] ?? '',
                'role' => $item['role'] ?? '',
                'published' => $item['published'] ?? '',
                'read_time' => $item['read_time'] ?? '',
                'lead' => $item['lead'] ?? '',
                'content_html' => $item['content_html'] ?? '',
                'highlight_label' => $item['highlight_label'] ?? '',
                'highlight' => $item['highlight'] ?? '',
                'image_path' => $imagePath,
                'image_url' => $imagePath ? route('blog.media', ['path' => $imagePath]) : null,
                'image_fallback' => $fallbacks[$index] ?? '/assets/img/categories/category-1.png',
            ];
        }, $posts, array_keys($posts));

        $blogData['most_read'] = array_map(function ($item) {
            return [
                'number' => $item['number'] ?? '',
                'title' => $item['title'] ?? '',
                'category' => $item['category'] ?? '',
            ];
        }, is_array($blogData['most_read'] ?? null) ? $blogData['most_read'] : []);

        return $blogData;
    }

    private function blogPostSlug(string $value, int $index): string
    {
        $base = trim(Str::slug($value) ?: 'post', '-');

        if (preg_match('/-\d+$/', $base)) {
            return $base;
        }

        return $base . '-' . ($index + 1);
    }

    private function resolveBlogPost(array $posts, ?string $slug): ?array
    {
        if (!$slug) {
            return null;
        }

        foreach ($posts as $index => $post) {
            $candidate = $this->blogPostSlug((string) ($post['slug'] ?? ($post['title'] ?? 'post')), $index);

            if ($candidate === $slug) {
                return $post + [
                    'slug' => $candidate,
                    'detail_url' => route('blog.post', ['slug' => $candidate]),
                ];
            }
        }

        return null;
    }
}
