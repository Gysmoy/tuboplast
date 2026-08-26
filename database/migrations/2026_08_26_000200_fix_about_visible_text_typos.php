<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $replacements = [
            'Certificacion' => 'Certificación',
            'certificacion' => 'certificación',
            'Gestion' => 'Gestión',
            'gestion' => 'gestión',
            'Fabricacion' => 'Fabricación',
            'fabricacion' => 'fabricación',
            'Categoria' => 'Categoría',
            'categoria' => 'categoría',
            'Organizacion' => 'Organización',
            'organizacion' => 'organización',
            'Atencion' => 'Atención',
            'atencion' => 'atención',
            'Creacion' => 'Creación',
            'creacion' => 'creación',
            'Tuberias' => 'Tuberías',
            'tuberias' => 'tuberías',
            'Introduccion' => 'Introducción',
            'introduccion' => 'introducción',
            'Distribucion' => 'Distribución',
            'distribucion' => 'distribución',
            'Agricola' => 'Agrícola',
            'agricola' => 'agrícola',
            'Produccion' => 'Producción',
            'produccion' => 'producción',
            'Tecnica' => 'Técnica',
            'tecnica' => 'técnica',
            'cercaño' => 'cercano',
            'Cercaño' => 'Cercano',
            'Forma Parte' => 'Forma parte',
            'forma Parte' => 'forma parte',
            'Ultimas' => 'Últimas',
            'ultimas' => 'últimas',
            'INSTALACIONÉS' => 'INSTALACIONES',
            'Instalaciónes' => 'Instalaciones',
            'instalaciónes' => 'instalaciones',
            'Instalacionés' => 'Instalaciones',
            'instalacionés' => 'instalaciones',
            'Correo electronico' => 'Correo electrónico',
            'correo electronico' => 'correo electrónico',
            'BLOGTUBOPLAST' => 'BLOG TUBOPLAST',
            'BlogTuboplast' => 'Blog Tuboplast',
            'CONSTRUCCION' => 'CONSTRUCCIÓN',
            'Construccion' => 'Construcción',
            'construccion' => 'construcción',
            'Telefono' => 'Teléfono',
            'telefono' => 'teléfono',
            'Telefonica' => 'Telefónica',
            'telefonica' => 'telefónica',
            'Whatsapp' => 'WhatsApp',
            'WHATSAPP' => 'WhatsApp',
            'Siguenos' => 'Síguenos',
            'Siguénos' => 'Síguenos',
            'requerimientos tecnicos' => 'requerimientos técnicos',
            'equipo de ingenieria' => 'equipo de ingeniería',
            'Nuestras Recomendaciones' => 'Nuestras recomendaciones',
            'Especificaciones Tecnicas' => 'Especificaciones Técnicas',
            'especificaciones tecnicas' => 'especificaciones técnicas',
            'ESPECIFICACIONES TECNICAS' => 'ESPECIFICACIONES TÉCNICAS',
            'Linea Completa' => 'Línea Completa',
            'linea completa' => 'línea completa',
            'Soporte en Obra' => 'Soporte en obra',
            'Durabilidad Extrema' => 'Durabilidad extrema',
            'Alta Presion' => 'Alta Presión',
            'alta presion' => 'alta presión',
            'conduccion de agua' => 'conducción de agua',
            'Conduccion de agua' => 'Conducción de agua',
            'Politica' => 'Política',
            'politica' => 'política',
            'Certificaciónes' => 'Certificaciones',
            'certificaciónes' => 'certificaciones',
            'ISO 9 001' => 'ISO 9001',
            'ISO 14 001' => 'ISO 14001',
            'ISO 45 001' => 'ISO 45001',
            'normás' => 'normas',
        ];

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

        $this->replaceText('sliders', [
            'title',
            'description',
            'primary_button_text',
            'secondary_button_text',
            'metric_one_label',
            'metric_two_label',
        ], $replacements);

        $this->replaceText('categories', [
            'name',
            'description',
        ], $replacements);

        $this->replaceText('items', [
            'title',
            'description',
            'pressure',
            'diameter',
            'type',
            'classification',
            'use_type',
            'material',
            'color',
            'brand',
            'unit',
            'pieces',
            'origin_country',
            'nominal_diameter',
            'famcons',
            'family',
            'package_type',
            'perishable',
            'hazardous',
            'warranty',
            'features',
            'usage_recommendations',
            'observations',
            'usage_warning',
        ], $replacements);

        foreach ([
            'product_segments',
            'product_lines',
            'product_classifications',
            'product_families',
            'product_types',
        ] as $table) {
            $this->replaceText($table, [
                'name',
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
