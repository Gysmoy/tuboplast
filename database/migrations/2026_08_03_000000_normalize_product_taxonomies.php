<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $this->normalizeTable('product_segments', 'product_segment_id', 'segment');
        $this->normalizeTable('product_lines', 'product_line_id', 'famcons');
        $this->normalizeTable('product_classifications', 'product_classification_id', 'classification');
        $this->normalizeTable('product_types', 'product_type_id', 'type');

        DB::table('product_classifications')
            ->orderBy('id')
            ->get(['id', 'name'])
            ->each(function ($classification) {
                DB::table('items')
                    ->where('product_classification_id', $classification->id)
                    ->update([
                        'family' => $classification->name,
                        'classification' => $classification->name,
                    ]);
            });
    }

    public function down(): void
    {
        //
    }

    private function normalizeTable(string $table, string $foreignKey, string $legacyColumn): void
    {
        $rows = DB::table($table)->orderBy('id')->get();
        $keepers = [];

        foreach ($rows as $row) {
            $name = $this->canonicalName($row->name);
            $key = $this->lookupKey($name);

            if (!isset($keepers[$key])) {
                DB::table($table)->where('id', $row->id)->update([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'status' => 1,
                    'updated_at' => now(),
                ]);

                $keepers[$key] = (object) ['id' => $row->id, 'name' => $name];
                continue;
            }

            DB::table('items')->where($foreignKey, $row->id)->update([$foreignKey => $keepers[$key]->id]);
            DB::table($table)->where('id', $row->id)->delete();
        }

        foreach ($keepers as $keeper) {
            DB::table('items')->where($foreignKey, $keeper->id)->update([$legacyColumn => $keeper->name]);
        }
    }

    private function canonicalName(?string $name): string
    {
        $aliases = [
            'predial' => 'Predial o Edificaciones',
            'predialoedificaciones' => 'Predial o Edificaciones',
            'infraestructura' => 'Saneamiento o Infraestructura',
            'saneamientooinfraestructura' => 'Saneamiento o Infraestructura',
            'aguafria' => 'Agua Fria',
            'aguapotable' => 'Agua Potable',
            'alcantarillado' => 'Alcantarillado',
            'desague' => 'Desague',
            'electrico' => 'Electrico',
            'anillosdecaucho' => 'Anillos de Caucho',
            'claseliviana' => 'Clase Liviana',
            'clasepesada' => 'Clase Pesada',
            'sap' => 'SAP',
            'sel' => 'SEL',
            'sistemaroscado' => 'Sistema Roscado',
            'sistemasimplepresion' => 'Sistema Simple Presion',
            'sistemaunionflexible' => 'Sistema Union Flexible (UF)',
            'sistemaunionflexibleuf' => 'Sistema Union Flexible (UF)',
            'tubo' => 'Tubos',
            'tubos' => 'Tubos',
            'conexion' => 'Conexiones',
            'conexiones' => 'Conexiones',
            'anillo' => 'Conexiones',
            'anillos' => 'Conexiones',
        ];

        $name = trim((string) $name);

        return $aliases[$this->lookupKey($name)] ?? Str::of($name)->lower()->title()->toString();
    }

    private function lookupKey(string $value): string
    {
        $value = mb_strtolower(trim(preg_replace('/\s+/u', ' ', str_replace("\xC2\xA0", ' ', $value))));
        $ascii = function_exists('iconv') ? @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) : false;

        if ($ascii !== false) {
            $value = $ascii;
        }

        return preg_replace('/[^a-z0-9]/', '', $value) ?: mb_strtoupper(trim($value));
    }
};
