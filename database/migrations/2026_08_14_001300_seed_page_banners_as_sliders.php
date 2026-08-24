<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private array $banners = [
        [
            'placement' => 'blog',
            'title' => 'Realiza tus cotizaciónes con facilidad',
            'description' => 'Ultimás actualizaciones del blog Tuboplast.',
            'image' => 'blog/blog-cotizaciónes-banner.png',
            'display_mode' => 'image_only',
            'sort_order' => 1,
        ],
        [
            'placement' => 'distributors',
            'title' => 'Ubica a nuestros distribuidores',
            'description' => 'Red de distribuidores a nivel nacional.',
            'image' => 'distributors/banner-distribuidores.png',
            'display_mode' => 'image_only',
            'sort_order' => 1,
        ],
        [
            'placement' => 'club_primary',
            'title' => 'Club Experto Tuboplast',
            'description' => 'Beneficios que construyen tu futuro.',
            'image' => 'club/club-experto-cta.png',
            'display_mode' => 'image_only',
            'sort_order' => 1,
        ],
        [
            'placement' => 'club_secondary',
            'title' => 'Tu aliado en construcción',
            'description' => 'Experto Tuboplast.',
            'image' => 'club/club-experto-hero.png',
            'display_mode' => 'image_only',
            'sort_order' => 1,
        ],
        [
            'placement' => 'about_family',
            'title' => 'Estamos presentes desde 1966',
            'description' => 'Líderes en soluciones para edificaciones, infraestructura, minería, agricultura y más.',
            'image' => 'about/red-distribución-banner.png',
            'display_mode' => 'image_only',
            'sort_order' => 1,
        ],
        [
            'placement' => 'about_policy',
            'title' => 'Política del Sistema de Gestión Integrado',
            'description' => 'Compromiso con calidad, seguridad, medio ambiente y mejora continua.',
            'image' => 'landing/bg-main.webp',
            'display_mode' => 'image_with_text',
            'sort_order' => 1,
        ],
    ];

    public function up(): void
    {
        if (!Schema::hasTable('sliders') || !Schema::hasColumn('sliders', 'placement')) {
            return;
        }

        foreach ($this->banners as $banner) {
            DB::table('sliders')->updateOrInsert(
                ['placement' => $banner['placement'], 'sort_order' => $banner['sort_order']],
                [
                    ...$banner,
                    'status' => true,
                    'updated_at' => now(),
                    'created_at' => now(),
                ],
            );
        }
    }

    public function down(): void
    {
        if (!Schema::hasTable('sliders') || !Schema::hasColumn('sliders', 'placement')) {
            return;
        }

        DB::table('sliders')
            ->whereIn('placement', array_column($this->banners, 'placement'))
            ->delete();
    }
};

