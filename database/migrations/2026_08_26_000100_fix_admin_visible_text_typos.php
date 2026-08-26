<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $replacements = [
            'Se el primero en saber' => 'Sé el primero en saber',
            'SE EL PRIMERO EN SABER' => 'SÉ EL PRIMERO EN SABER',
            'instalacion' => 'instalación',
            'Instalacion' => 'Instalación',
            'INSTALACION' => 'INSTALACIÓN',
            'Sin descripcion' => 'Sin descripción',
            'Titulo' => 'Título',
            'Metricas' => 'Métricas',
            'metrica' => 'métrica',
            'Anos de trayectoria' => 'Años de trayectoria',
            'Anos de vida útil' => 'Años de vida útil',
            'casos de exito' => 'casos de éxito',
            ' y como ayudamos' => ' y cómo ayudamos',
            'Sabias este dato?' => '¿Sabías este dato?',
            'se comunicara contigo' => 'se comunicará contigo',
            'codigos sin producto' => 'códigos sin producto',
            'codigos ambiguos' => 'códigos ambiguos',
            'imagenes asociadas' => 'imágenes asociadas',
            'imagenes ignoradas' => 'imágenes ignoradas',
            'galeria de imágenes aun' => 'galería de imágenes aún',
            'galeria de imagenes aun' => 'galería de imágenes aún',
            'desde este modulo' => 'desde este módulo',
            'contrasena' => 'contraseña',
            'confirmacion' => 'confirmación',
            'DevEx Consultinh' => 'DevEx Consulting',
            'uniónes' => 'uniones',
            'Uniónes' => 'Uniones',
            'decisiónes' => 'decisiones',
            'reacciónan' => 'reaccionan',
            'reacciónar' => 'reaccionar',
            'humaños' => 'humanos',
            'operaciónal' => 'operacional',
            'alíneado' => 'alineado',
            'Agua Fria' => 'Agua Fría',
            'AGUA FRIA' => 'AGUA FRÍA',
            'Desague' => 'Desagüe',
            'DESAGUE' => 'DESAGÜE',
            'Electrico' => 'Eléctrico',
            'ELECTRICO' => 'ELÉCTRICO',
            'Mineria' => 'Minería',
            'Sistema Simple Presion' => 'Sistema Simple Presión',
            'Sistema Union Flexible' => 'Sistema Unión Flexible',
            'Sistema Termofusion' => 'Sistema Termofusión',
            'Conduccion de agua a Presion' => 'Conducción de agua a presión',
            'Conduccion de agua a Presión' => 'Conducción de agua a presión',
            'catalogo tuboplast, peru' => 'catálogo tuboplast, Perú',
        ];

        $this->replaceText('blog_pages', [
            'hero_title',
            'hero_description',
            'section_title',
            'posts',
            'most_read',
            'newsletter_eyebrow',
            'newsletter_title',
            'newsletter_description',
            'newsletter_placeholder',
            'newsletter_button_label',
        ], $replacements);

        $this->replaceText('about_pages', [
            'hero_title',
            'hero_description',
            'stats',
            'milestones',
            'commitment_title',
            'commitment_description',
            'family_eyebrow',
            'family_title',
            'family_lead',
            'family_paragraph_1',
            'family_paragraph_2',
            'family_metric_label',
            'family_aside_1_title',
            'family_aside_1_text',
            'family_aside_2_title',
            'family_aside_2_text',
            'mission_eyebrow',
            'mission_title',
            'mission_text',
            'vision_eyebrow',
            'vision_title',
            'vision_text',
            'family_values',
            'policy_eyebrow',
            'policy_title',
            'policy_scope_eyebrow',
            'policy_scope_title',
            'policy_scope_paragraph_1',
            'policy_scope_paragraph_2',
            'policy_commitment_text',
            'policy_certifications_title',
            'policy_description',
            'policy_bullets',
            'certifications',
        ], $replacements);

        $this->replaceText('sliders', [
            'title',
            'description',
            'primary_button_text',
            'secondary_button_text',
            'metric_one_label',
            'metric_two_label',
        ], $replacements);

        foreach ([
            'categories',
            'items',
            'product_segments',
            'product_lines',
            'product_classifications',
            'product_families',
            'product_types',
        ] as $table) {
            $this->replaceText($table, [
                'name',
                'title',
                'description',
                'segment',
                'classification',
                'family',
                'type',
                'use_type',
            ], $replacements);
        }
    }

    public function down(): void
    {
        //
    }

    private function replaceText(string $table, array $columns, array $replacements): void
    {
        if (!Schema::hasTable($table)) {
            return;
        }

        foreach ($columns as $column) {
            if (!Schema::hasColumn($table, $column)) {
                continue;
            }

            foreach ($replacements as $from => $to) {
                DB::statement(
                    "UPDATE `{$table}` SET `{$column}` = REPLACE(`{$column}`, ?, ?) WHERE `{$column}` LIKE ?",
                    [$from, $to, '%' . $from . '%']
                );
            }
        }
    }
};
