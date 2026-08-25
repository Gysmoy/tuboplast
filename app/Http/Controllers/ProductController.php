<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ProductController extends BasicController
{
    public $reactView = 'ProductDetail';
    public $reactRootView = 'public';

    private string $slug;

    public function show(Request $request, string $slug)
    {
        $this->slug = $slug;

        return parent::reactView($request);
    }

    public function setReactViewProperties(Request $request)
    {
        $relations = ['category', 'productSegment', 'productSegments', 'productLine', 'productClassification', 'productFamily', 'productType'];
        if (Schema::hasTable('item_images')) {
            $relations[] = 'images';
        }

        $item = Item::query()
            ->where('status', true)
            ->where('slug', $this->slug)
            ->with($relations)
            ->first();

        if (!$item) {
            abort(404);
        }

        $this->trackView($item, $request);

        $image = $this->imageUrl($item);
        $this->seo = [
            'title' => $item->title . ' | ' . env('APP_NAME', 'Tuboplast'),
            'description' => Str::limit(strip_tags($item->description ?: ($item->category->name ?? 'Producto Tuboplast')), 180),
            'image' => Str::startsWith($image, 'http') ? $image : url($image),
            'type' => 'product',
            'url' => route('products.show', ['slug' => $item->slug]),
        ];

        return [
            'token' => csrf_token(),
            'product' => $this->mapProduct($item),
            'relatedProducts' => $this->relatedProducts($item),
        ];
    }

    /**
     * Cuenta una vista por sesión: usa una cookie de sesión con los IDs ya
     * vistos, de modo que actualizar la página no vuelve a contar, pero una
     * próxima sesión (nuevo navegador) sí cuenta de nuevo.
     */
    private function trackView(Item $item, Request $request): void
    {
        $cookieName = 'tuboplast_viewed_items';
        $raw = $request->cookie($cookieName);
        $viewed = is_string($raw) ? array_filter(explode(',', $raw)) : [];

        if (in_array((string) $item->id, $viewed, true)) {
            return;
        }

        $item->increment('views');
        $viewed[] = (string) $item->id;

        Cookie::queue($cookieName, implode(',', $viewed), 0); // minutes 0 => cookie de sesión
    }

    private function imageUrl(Item $item): string
    {
        return $this->publicImageUrl($item->image);
    }

    private function publicImageUrl(?string $path): string
    {
        $path = trim((string) $path);

        if ($path === '') {
            return '/assets/img/items/item-1.png';
        }

        if (Str::startsWith($path, ['http://', 'https://', '/assets/', '/storage/'])) {
            return $path;
        }

        return '/storage/' . ltrim($path, '/');
    }

    private function shortPressure(?string $pressure): string
    {
        if (!$pressure) return '-';
        $low = mb_strtolower($pressure);
        if (str_contains($low, 'no aplica')) return 'No aplica';
        if (str_contains($low, 'gravedad') || str_contains($low, 'sin presión')) return 'Gravedad';
        if (str_contains($low, 'roscado')) return 'Roscado';
        if (preg_match('/PN-?[\d.]+/i', $pressure, $m)) return strtoupper($m[0]);
        if (preg_match('/C-?[\d.]+/i', $pressure, $m)) return strtoupper($m[0]);
        if (preg_match('/[\d.]+\s*bar/i', $pressure, $m)) return $m[0];
        if (preg_match('/Sn\d[\w.-]*/i', $pressure, $m)) return strtoupper($m[0]);
        return mb_strlen($pressure) > 16 ? (mb_substr($pressure, 0, 14) . '…') : $pressure;
    }

    private function diameterLabel(array $diameters): string
    {
        if (!count($diameters)) return '-';
        if (count($diameters) === 1) return $diameters[0];
        return $diameters[0] . ' – ' . end($diameters);
    }

    private function moneyLabel(?float $price, ?string $currency): ?string
    {
        if ($price === null) {
            return null;
        }

        $symbol = strtoupper((string) $currency) === 'USD' ? '$ ' : 'S/ ';

        return $symbol . number_format($price, 2);
    }

    private function spec(?string $label, $value): ?array
    {
        $value = is_string($value) ? trim($value) : $value;

        return ($value === null || $value === '') ? null : ['label' => $label, 'value' => (string) $value];
    }

    private function num($value, string $suffix = ''): ?string
    {
        if ($value === null || $value === '' || (float) $value == 0.0) {
            return null;
        }

        $clean = rtrim(rtrim(number_format((float) $value, 3, '.', ''), '0'), '.');

        return $clean . $suffix;
    }

    private function mapProduct(Item $item): array
    {
        $price = $item->price !== null ? (float) $item->price : null;
        $category = $item->productLine->name ?? $item->category->name ?? 'Producto';
        $segments = $item->productSegments->pluck('name')->filter()->values();
        $segment = $segments->isNotEmpty()
            ? $segments->join(' · ')
            : ($item->productSegment->name ?? $item->segment);
        $classification = $item->productClassification->name ?? $item->classification;
        $type = $item->productType->name ?? $item->type;
        $image = $this->imageUrl($item);
        $gallery = $item->relationLoaded('images')
            ? $item->images
                ->pluck('path')
                ->filter()
                ->map(fn ($path) => $this->publicImageUrl($path))
                ->values()
                ->all()
            : [];

        if (!count($gallery)) {
            $gallery = [$image];
        }

        $diameters = is_array($item->diameters) ? $item->diameters : [];
        $diameterLabel = $item->nominal_diameter ?: ($item->diameter ?: $this->diameterLabel($diameters));

        $specItems = array_values(array_filter([
            $this->spec('Segmento', $segment),
            $this->spec('Línea', $category),
            $this->spec('Clasificación', $classification),
            $this->spec('Familia', $item->productFamily->name ?? ($item->family ?: $item->famcons)),
            $this->spec('Tipo', $type),
            $this->spec('Uso', $item->use_type),
            $this->spec('Material', $item->material),
            $this->spec('Color', $item->color),
            $this->spec('Marca', $item->brand),
            $item->pressure ? $this->spec('Presión', $this->shortPressure($item->pressure)) : null,
            $this->spec('Diámetro nominal', $diameterLabel !== '-' ? $diameterLabel : null),
        ]));

        $logisticItems = array_values(array_filter([
            $this->spec('Unidad de medida', $item->unit),
            $item->masterpack ? $this->spec('Masterpack', (string) $item->masterpack) : null,
            $this->spec('N° de piezas', $item->pieces),
            $this->spec('Tipo de empaque', $item->package_type),
            $this->spec('País de origen', $item->origin_country),
            $this->spec('Peso del producto', $this->num($item->product_weight, ' kg')),
            $this->spec('Alto del producto', $this->num($item->product_height)),
            $this->spec('Ancho del producto', $this->num($item->product_width)),
            $this->spec('Profundidad del producto', $this->num($item->product_depth)),
            $this->spec('Peso u. logística', $this->num($item->logistic_weight, ' kg')),
            $this->spec('Alto u. logística', $this->num($item->logistic_height)),
            $this->spec('Ancho u. logística', $this->num($item->logistic_width)),
            $this->spec('Profundidad u. logística', $this->num($item->logistic_depth)),
        ]));

        $notices = array_values(array_filter([
            $this->spec('Garantía', $item->warranty),
            $this->spec('Características', $item->features),
            $this->spec('Recomendaciones de uso', $item->usage_recommendations),
            $this->spec('Observaciones', $item->observations),
            $this->spec('Advertencia de uso', $item->usage_warning),
            $this->spec('Perecible', $item->perishable),
            $this->spec('Producto peligroso', $item->hazardous),
        ]));

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'sku' => $item->sku ?: '-',
            'categoryLabel' => $category,
            'title' => $item->title,
            'description' => $item->description ?: 'Producto fabricado bajo los estándares de calidad de Tuboplast.',
            'image' => $image,
            'gallery' => $gallery,
            'technicalSheetUrl' => $item->technical_sheet ? $this->publicImageUrl($item->technical_sheet) : null,
            'unitPrice' => $price,
            'price' => $this->moneyLabel($price, $item->currency),
            'currency' => strtoupper($item->currency ?: 'PEN'),
            'standard' => $category,
            'stockLabel' => 'Stock disponible',
            'detailUrl' => route('products.show', ['slug' => $item->slug]),
            'summary' => array_slice(array_values(array_filter([
                $this->spec('Uso', $item->use_type) ?: $this->spec('Línea', $category),
                $this->spec('Tipo', $type),
                ['label' => 'Diámetro', 'value' => $diameterLabel],
                ['label' => 'SKU', 'value' => $item->sku ?: '-'],
            ])), 0, 4),
            'technicalSpecifications' => array_values(array_filter([
                count($specItems) ? ['title' => 'Especificaciones', 'items' => $specItems] : null,
                count($logisticItems) ? ['title' => 'Logística', 'items' => $logisticItems] : null,
                count($diameters) ? [
                    'title' => 'Diámetros disponibles',
                    'items' => [],
                    'badges' => $diameters,
                ] : null,
            ])),
            'notices' => $notices,
        ];
    }

    private function relatedProducts(Item $current): array
    {
        $query = Item::query()
            ->where('status', true)
            ->where('id', '!=', $current->id);

        if ($current->product_line_id) {
            $query->where('product_line_id', $current->product_line_id);
        } elseif ($current->category_id) {
            $query->where('category_id', $current->category_id);
        }

        return $query
            ->with('category', 'productLine')
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($item) {
                $price = $item->price !== null ? (float) $item->price : null;
                $diameters = is_array($item->diameters) ? $item->diameters : [];

                return [
                    'id' => $item->id,
                    'sku' => $item->sku,
                    'categoryLabel' => $item->productLine->name ?? $item->category->name ?? 'Producto',
                    'title' => $item->title,
                    'image' => $this->imageUrl($item),
                    'price' => $this->moneyLabel($price, $item->currency),
                    'unitPrice' => $price,
                    'currency' => strtoupper($item->currency ?: 'PEN'),
                    'use' => $item->use_type,
                    'pressure' => $this->shortPressure($item->pressure),
                    'diameter' => $item->nominal_diameter ?: ($item->diameter ?: $this->diameterLabel($diameters)),
                    'detailUrl' => route('products.show', ['slug' => $item->slug]),
                ];
            })
            ->values()
            ->all();
    }
}

