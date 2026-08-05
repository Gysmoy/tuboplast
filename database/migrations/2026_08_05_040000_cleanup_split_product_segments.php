<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['Predial', 'Edificaciones', 'Saneamiento', 'Infraestructura', 'Agricultura', 'Mineria'] as $name) {
            $row = DB::table('product_segments')
                ->get(['id', 'name'])
                ->first(fn ($segment) => $this->lookupKey($segment->name) === $this->lookupKey($name));

            if ($row) {
                DB::table('product_segments')->where('id', $row->id)->update([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'status' => 1,
                    'updated_at' => now(),
                ]);
                continue;
            }

            DB::table('product_segments')->insert([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => null,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::table('product_segments')
            ->whereIn('name', ['Predial o Edificaciones', 'Saneamiento o Infraestructura'])
            ->delete();
    }

    public function down(): void
    {
        foreach (['Predial o Edificaciones', 'Saneamiento o Infraestructura'] as $name) {
            DB::table('product_segments')->insert([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => null,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
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
