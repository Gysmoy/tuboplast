<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
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
        $item = Item::query()
            ->where('status', true)
            ->where('slug', $this->slug)
            ->with('category')
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
        return $item->image ? '/storage/' . $item->image : '/assets/img/items/item-1.png';
    }

    private function shortPressure(?string $pressure): string
    {
        if (!$pressure) return '-';
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
        if (!count($diameters)) return '-';
        if (count($diameters) === 1) return $diameters[0];
        return $diameters[0] . ' – ' . end($diameters);
    }

    private function mapProduct(Item $item): array
    {
        $price = $item->price !== null ? (float) $item->price : null;
        $category = $item->category->name ?? 'Producto';
        $image = $this->imageUrl($item);

        $diameters = is_array($item->diameters) ? $item->diameters : [];
        $diameterLabel = $item->diameter ?: $this->diameterLabel($diameters);

        return [
            'id' => $item->id,
            'slug' => $item->slug,
            'sku' => $item->sku ?: '-',
            'categoryLabel' => $category,
            'title' => $item->title,
            'description' => $item->description ?: 'Producto fabricado bajo los estándares de calidad de Tuboplast.',
            'image' => $image,
            'gallery' => [$image],
            'unitPrice' => $price,
            'price' => $price !== null ? 'S/ ' . number_format($price, 2) : null,
            'standard' => $category,
            'stockLabel' => 'Stock disponible',
            'detailUrl' => route('products.show', ['slug' => $item->slug]),
            'summary' => array_values(array_filter([
                ['label' => 'Línea', 'value' => $category],
                $item->type ? ['label' => 'Tipo', 'value' => $item->type] : null,
                ['label' => 'Diámetros', 'value' => $diameterLabel],
                ['label' => 'SKU', 'value' => $item->sku ?: '-'],
            ])),
            'technicalSpecifications' => array_values(array_filter([
                [
                    'title' => 'Especificaciones',
                    'items' => array_values(array_filter([
                        $item->segment ? ['label' => 'Segmento', 'value' => $item->segment] : null,
                        ['label' => 'Línea', 'value' => $category],
                        $item->classification ? ['label' => 'Clasificación', 'value' => $item->classification] : null,
                        $item->type ? ['label' => 'Tipo', 'value' => $item->type] : null,
                        $item->pressure ? ['label' => 'Presión', 'value' => $item->pressure] : null,
                    ])),
                ],
                count($diameters) ? [
                    'title' => 'Diámetros disponibles',
                    'items' => [],
                    'badges' => $diameters,
                ] : null,
            ])),
        ];
    }

    private function relatedProducts(Item $current): array
    {
        return Item::query()
            ->where('status', true)
            ->where('id', '!=', $current->id)
            ->with('category')
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($item) {
                $price = $item->price !== null ? (float) $item->price : null;
                $diameters = is_array($item->diameters) ? $item->diameters : [];

                return [
                    'id' => $item->id,
                    'sku' => $item->sku,
                    'categoryLabel' => $item->category->name ?? 'Producto',
                    'title' => $item->title,
                    'image' => $this->imageUrl($item),
                    'price' => $price !== null ? 'S/ ' . number_format($price, 2) : null,
                    'unitPrice' => $price,
                    'pressure' => $this->shortPressure($item->pressure),
                    'diameter' => $item->diameter ?: $this->diameterLabel($diameters),
                    'detailUrl' => route('products.show', ['slug' => $item->slug]),
                ];
            })
            ->values()
            ->all();
    }
}
