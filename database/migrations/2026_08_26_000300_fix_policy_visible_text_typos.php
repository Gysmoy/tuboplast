<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $replacements = [
            'Politica' => 'Política',
            'politica' => 'política',
            'POLITICA' => 'POLÍTICA',
            'Certificaciónes' => 'Certificaciones',
            'certificaciónes' => 'certificaciones',
            'Certificacionés' => 'Certificaciones',
            'certificacionés' => 'certificaciones',
            'ISO 9 001' => 'ISO 9001',
            'ISO 14 001' => 'ISO 14001',
            'ISO 45 001' => 'ISO 45001',
            'ISO 90 01' => 'ISO 9001',
            'ISO 140 01' => 'ISO 14001',
            'ISO 450 01' => 'ISO 45001',
            'normás' => 'normas',
            'Normás' => 'Normas',
            'Sistema de Gestion Integrado' => 'Sistema de Gestión Integrado',
            'sistema de gestion integrado' => 'sistema de gestión integrado',
        ];

        $this->replaceText('about_pages', [
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
