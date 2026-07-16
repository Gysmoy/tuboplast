<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $titles = [
        'Expertos en Tuberias y Conexiones de PVC',
        'Soluciones PVC para Obras de Alto Rendimiento',
    ];

    public function up(): void
    {
        if (!Schema::hasTable('sliders')) {
            return;
        }

        $this->copySliderAssets();

        $itemIds = Schema::hasTable('items')
            ? DB::table('items')->whereNotNull('status')->orderBy('id')->limit(2)->pluck('id')->all()
            : [];

        $firstItemId = $itemIds[0] ?? null;
        $secondItemId = $itemIds[1] ?? $firstItemId;
        $now = now();

        $rows = [
            [
                'item_id' => $firstItemId,
                'title' => $this->titles[0],
                'description' => 'Mas de 60 anos fabricando sistemas de conduccion confiables para los sectores de Edificaciones, Infraestructura, Mineria e Industria y Agricola en todo el Peru.',
                'image' => 'sliders/hero-home.webp',
                'primary_button_text' => 'Ver catalogo',
                'primary_button_link' => '/catalog',
                'secondary_button_text' => 'Solicitar cotizacion',
                'secondary_button_link' => '/contact',
                'metric_one_value' => '60+',
                'metric_one_label' => 'Anos de trayectoria',
                'metric_two_value' => 'ISO',
                'metric_two_label' => 'Calidad certificada',
                'sort_order' => 1,
                'status' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'item_id' => $secondItemId,
                'title' => $this->titles[1],
                'description' => 'Linea completa de tuberias y conexiones para agua, desague, saneamiento e infraestructura con soporte tecnico especializado.',
                'image' => 'sliders/banner-tuboplast.webp',
                'primary_button_text' => 'Explorar productos',
                'primary_button_link' => '/catalog',
                'secondary_button_text' => 'Hablar con un asesor',
                'secondary_button_link' => '/contact',
                'metric_one_value' => '24"',
                'metric_one_label' => 'Linea completa',
                'metric_two_value' => '50+',
                'metric_two_label' => 'Anos de vida util',
                'sort_order' => 2,
                'status' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        foreach ($rows as $row) {
            DB::table('sliders')->updateOrInsert(
                ['title' => $row['title']],
                $row
            );
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('sliders')) {
            return;
        }

        DB::table('sliders')->whereIn('title', $this->titles)->delete();
    }

    private function copySliderAssets(): void
    {
        foreach (['hero-home.webp', 'banner-tuboplast.webp'] as $filename) {
            $source = public_path("assets/img/sliders/{$filename}");
            $target = storage_path("app/public/sliders/{$filename}");

            if (!File::exists($source) || File::exists($target)) {
                continue;
            }

            File::ensureDirectoryExists(dirname($target));
            File::copy($source, $target);
        }
    }
};
