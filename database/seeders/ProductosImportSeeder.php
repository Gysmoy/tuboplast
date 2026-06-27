<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

/**
 * Importa el catálogo nuevo desde database/data/productos.json.
 *
 * Las claves del JSON vienen con acentos (y a veces con mojibake UTF-8 como
 * "DescripciÃ³n de Producto"); por eso cada fila se re-indexa con una clave
 * normalizada (solo a-z0-9) para que el mapeo no dependa de la codificación.
 *
 * Uso:  php artisan db:seed --class=Database\\Seeders\\ProductosImportSeeder
 */
class ProductosImportSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/productos.json');

        if (!file_exists($path)) {
            $this->command?->error('No se encontró database/data/productos.json');
            return;
        }

        $rows = json_decode(file_get_contents($path), true);
        if (!is_array($rows)) {
            $this->command?->error('productos.json no es un arreglo JSON válido');
            return;
        }

        $categoryCache = [];
        $usedSlugs = [];
        $seq = 0;
        $imported = 0;

        foreach ($rows as $raw) {
            $seq++;
            $norm = $this->normalizeRow($raw);

            $title = $this->get($norm, 'Descripción de Producto') ?? ('Producto ' . $seq);
            $sku = $this->get($norm, 'Codigo Producto');

            // Línea de producto = FAMCONS (cae a FAMILIA o genérico)
            $line = $this->get($norm, 'FAMCONS')
                ?? $this->get($norm, 'FAMILIA')
                ?? 'Productos';

            if (!isset($categoryCache[$line])) {
                $categoryCache[$line] = Category::firstOrCreate(
                    ['name' => $line],
                    ['description' => "Línea de productos: {$line}", 'status' => 1]
                );
            }
            $category = $categoryCache[$line];

            $base = Str::slug($title) ?: ('item-' . $seq);
            $slug = $base;
            $suffix = 1;
            while (in_array($slug, $usedSlugs, true)) {
                $slug = $base . '-' . (++$suffix);
            }
            $usedSlugs[] = $slug;

            $nominal = $this->get($norm, 'Diametro Nominal del Producto');
            $currency = strtoupper((string) ($this->get($norm, 'Moneda') ?? 'PEN'));
            $currency = in_array($currency, ['USD', 'PEN'], true) ? $currency : 'PEN';

            Item::updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $category->id,
                    'segment' => $this->get($norm, 'SEGMENTO'),
                    'famcons' => $this->get($norm, 'FAMCONS'),
                    'family' => $this->get($norm, 'FAMILIA'),
                    'classification' => $this->get($norm, 'FAMILIA'),
                    'type' => $this->get($norm, 'TIPO'),
                    'use_type' => $this->get($norm, 'USO'),
                    'material' => $this->get($norm, 'Material'),
                    'color' => $this->get($norm, 'Color'),
                    'brand' => $this->get($norm, 'Marca'),
                    'unit' => $this->get($norm, 'Unidad de Medida'),
                    'masterpack' => $this->intOrNull($this->get($norm, 'Masterpack')),
                    'pieces' => $this->get($norm, 'Número de piezas'),
                    'origin_country' => $this->get($norm, 'País de origen'),
                    'sku' => $sku ?: ('TBP-' . str_pad((string) $seq, 5, '0', STR_PAD_LEFT)),
                    'title' => $title,
                    'description' => $this->buildDescription($norm),
                    'price' => $this->floatOrNull($this->get($norm, 'Precio Unitario')),
                    'currency' => $currency,
                    'pressure' => null,
                    'diameter' => $nominal,
                    'nominal_diameter' => $nominal,
                    'diameters' => $nominal ? [$nominal] : [],
                    'package_type' => $this->get($norm, 'Tipo de empaque'),
                    'perishable' => $this->get($norm, 'Perecible'),
                    'hazardous' => $this->get($norm, 'Producto peligroso'),
                    'product_height' => $this->floatOrNull($this->get($norm, 'Altura Del Producto')),
                    'product_width' => $this->floatOrNull($this->get($norm, 'Ancho Del Producto')),
                    'product_depth' => $this->floatOrNull($this->get($norm, 'Profundidad Del Producto')),
                    'product_weight' => $this->floatOrNull($this->get($norm, 'Peso Del Producto (Kg)')),
                    'logistic_height' => $this->floatOrNull($this->get($norm, 'Altura De La Unidad Logística')),
                    'logistic_width' => $this->floatOrNull($this->get($norm, 'Ancho De La Unidad Logística')),
                    'logistic_depth' => $this->floatOrNull($this->get($norm, 'Profundidad De La Unidad Logística')),
                    'logistic_weight' => $this->floatOrNull($this->get($norm, 'Peso De La Unidad Logística')),
                    'warranty' => $this->get($norm, 'Garantía'),
                    'features' => $this->get($norm, 'Características'),
                    'usage_recommendations' => $this->get($norm, 'Recomendaciones De Uso'),
                    'observations' => $this->get($norm, 'Observaciones'),
                    'usage_warning' => $this->get($norm, 'Advertencia de uso'),
                    'status' => 1,
                ]
            );
            $imported++;
        }

        Cache::forget('tuboplast.catalog.facets');

        $this->command?->info(sprintf(
            'Importados %d productos en %d líneas (categorías).',
            $imported,
            count($categoryCache)
        ));
    }

    /** Re-indexa la fila con claves normalizadas (solo a-z0-9). */
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
        return preg_replace('/[^a-z0-9]/', '', mb_strtolower($key));
    }

    /** Devuelve el valor por nombre legible; '#N/A', 0 y '' se tratan como null. */
    private function get(array $norm, string $cleanName)
    {
        $value = $norm[$this->normalizeKey($cleanName)] ?? null;

        if ($value === null) {
            return null;
        }
        if (is_string($value)) {
            $value = trim($value);
            if ($value === '' || strtoupper($value) === '#N/A') {
                return null;
            }
            return $value;
        }
        if ($value === 0 || $value === '0') {
            return null;
        }

        return $value;
    }

    private function floatOrNull($value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }
        return is_numeric($value) ? (float) $value : null;
    }

    private function intOrNull($value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }
        return is_numeric($value) ? (int) $value : null;
    }

    private function buildDescription(array $norm): string
    {
        $parts = array_filter([
            $this->get($norm, 'TIPO'),
            $this->get($norm, 'USO'),
            $this->get($norm, 'Material'),
            $this->get($norm, 'FAMILIA'),
        ]);

        $features = $this->get($norm, 'Características');
        $text = 'Producto Tuboplast · ' . implode(' · ', $parts) . '.';
        if ($features) {
            $text .= ' ' . Str::limit($features, 240);
        }

        return $text;
    }
}
