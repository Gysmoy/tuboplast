<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('data/tuboplast-catalog.json');

        if (!file_exists($path)) {
            $this->command?->error('No se encontró database/data/tuboplast-catalog.json');
            return;
        }

        $data = json_decode(file_get_contents($path), true);
        $rows = $data['items'] ?? [];

        $imageCache = [];
        $categoryCache = [];
        $usedSlugs = [];
        $seq = 0;
        $copied = 0;

        foreach ($rows as $raw) {
            $seq++;
            $line = trim($raw['linea_de_producto'] ?? 'Productos');

            if (!isset($categoryCache[$line])) {
                $categoryCache[$line] = Category::firstOrCreate(
                    ['name' => $line],
                    ['description' => "Línea de productos: {$line}", 'status' => 1]
                );
            }
            $category = $categoryCache[$line];

            $base = Str::slug($raw['nombre'] ?? ('item-' . $seq)) ?: ('item-' . $seq);
            $slug = $base;
            $suffix = 1;
            while (in_array($slug, $usedSlugs, true)) {
                $slug = $base . '-' . (++$suffix);
            }
            $usedSlugs[] = $slug;

            $imageUrl = $raw['imagen'] ?? null;
            $imageFile = null;

            if ($imageUrl) {
                if (array_key_exists($imageUrl, $imageCache)) {
                    $imageFile = $imageCache[$imageUrl];
                } else {
                    $imageFile = $this->copyImage($imageUrl, $copied);
                    $imageCache[$imageUrl] = $imageFile;
                }
            }

            $diameters = array_values(array_filter(array_map(
                fn ($d) => trim((string) $d),
                $raw['diametros_resumen'] ?? []
            )));

            Item::updateOrCreate(
                ['slug' => $slug],
                [
                    'category_id' => $category->id,
                    'segment' => $raw['segmento_de_negocio'] ?? null,
                    'classification' => $raw['clasificacion'] ?? null,
                    'type' => $raw['tipo'] ?? null,
                    'sku' => 'TBP-' . str_pad((string) $seq, 4, '0', STR_PAD_LEFT),
                    'title' => $raw['nombre'] ?? 'Producto',
                    'description' => $this->buildDescription($raw),
                    'image' => $imageFile,
                    'price' => isset($raw['precio']) ? (float) $raw['precio'] : null,
                    'pressure' => $raw['presion'] ?? null,
                    'diameter' => null,
                    'diameters' => $diameters,
                    'source_url' => $raw['url'] ?? null,
                    'status' => 1,
                ]
            );
        }

        $this->command?->info(sprintf(
            'Catálogo poblado: %d items, %d categorías, %d imágenes copiadas a storage/app/public/items.',
            count($rows),
            count($categoryCache),
            $copied
        ));
    }

    /**
     * Copies a bundled catalog image (database/seeders/catalog/images) into the
     * public storage disk so it is served through the storage:link symlink.
     */
    private function copyImage(string $url, int &$copied): ?string
    {
        $basename = basename(parse_url($url, PHP_URL_PATH) ?? '');
        if (!$basename) {
            return null;
        }

        $source = database_path('seeders/catalog/images/' . $basename);
        if (!file_exists($source)) {
            $this->command?->warn('Imagen no incluida en el repo: ' . $basename);
            return null;
        }

        $target = 'items/' . $basename;
        if (!Storage::disk('public')->exists($target)) {
            Storage::disk('public')->put($target, file_get_contents($source));
            $copied++;
        }

        return $target;
    }

    private function buildDescription(array $raw): string
    {
        $parts = array_filter([
            $raw['segmento_de_negocio'] ?? null,
            $raw['linea_de_producto'] ?? null,
            $raw['clasificacion'] ?? null,
            $raw['tipo'] ?? null,
        ]);

        $text = 'Producto Tuboplast · ' . implode(' · ', $parts) . '.';
        if (!empty($raw['presion'])) {
            $text .= ' ' . $raw['presion'] . '.';
        }

        return $text;
    }
}
