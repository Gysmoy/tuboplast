<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->copySliderImage();
        $this->updateSliders();
        $this->updateInfrastructureSegment();
    }

    public function down(): void
    {
        //
    }

    private function copySliderImage(): void
    {
        $source = public_path('assets/img/sliders/hero-obras-alto-rendimiento.png');
        $target = storage_path('app/public/sliders/hero-obras-alto-rendimiento.png');

        if (!File::exists($source)) {
            return;
        }

        File::ensureDirectoryExists(dirname($target));
        File::copy($source, $target);
    }

    private function updateSliders(): void
    {
        if (!Schema::hasTable('sliders')) {
            return;
        }

        $now = now();

        $first = DB::table('sliders')
            ->where('sort_order', 1)
            ->orWhere('title', 'Expertos en Tuberías y Conexiones de PVC')
            ->first();

        if ($first) {
            DB::table('sliders')->where('id', $first->id)->update([
                'title' => 'Expertos en Tuberías y Conexiones de PVC',
                'description' => 'Más de 60 años fabricando sistemas de conducción confiables para los sectores de Edificaciones, Infraestructura, Minería e Industria y Agrícola en todo el Perú.',
                'primary_button_text' => 'Ver catálogo',
                'secondary_button_text' => 'Solicitar cotización',
                'metric_one_label' => 'Años de trayectoria',
                'updated_at' => $now,
            ]);
        }

        $second = DB::table('sliders')
            ->where('sort_order', 2)
            ->orWhereIn('title', [
                'Soluciones PVC para Obras de Alto Rendimiento',
                'Soluciones de PVC para Obras de Alto Rendimiento',
            ])
            ->first();

        if ($second) {
            DB::table('sliders')->where('id', $second->id)->update([
                'title' => 'Soluciones de PVC para Obras de Alto Rendimiento',
                'description' => 'Contamos con Líneas completas de tuberías y conexiones de PVC desde ½” hasta 24” con soporte técnico especializado.',
                'image' => 'sliders/hero-obras-alto-rendimiento.png',
                'metric_one_value' => '24”',
                'metric_one_label' => 'Línea completa',
                'metric_two_value' => '50+',
                'metric_two_label' => 'Años de vida útil',
                'updated_at' => $now,
            ]);
        }
    }

    private function updateInfrastructureSegment(): void
    {
        if (!Schema::hasTable('product_segments')) {
            return;
        }

        DB::table('product_segments')
            ->where('name', 'Infraestructura')
            ->update([
                'image' => 'assets/img/categories/category-infraestructura.png',
                'featured' => 1,
                'featured_order' => 25,
                'updated_at' => now(),
            ]);
    }
};
