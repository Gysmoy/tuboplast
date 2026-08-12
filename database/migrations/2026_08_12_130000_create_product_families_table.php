<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_families', function (Blueprint $table) {
            $table->id();
            $table->string('name', 160);
            $table->string('slug', 180)->nullable()->index();
            $table->text('description')->nullable();
            $table->boolean('status')->nullable()->default(true);
            $table->timestamps();
        });

        Schema::table('items', function (Blueprint $table) {
            $table->foreignId('product_family_id')
                ->nullable()
                ->after('product_classification_id')
                ->constrained('product_families')
                ->nullOnDelete();
        });

        DB::table('items')
            ->whereNotNull('family')
            ->where('family', '!=', '')
            ->orderBy('family')
            ->pluck('family')
            ->unique(fn ($name) => $this->lookupKey((string) $name))
            ->each(function ($name) {
                $name = trim((string) $name);
                $familyId = DB::table('product_families')->insertGetId([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'description' => null,
                    'status' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                DB::table('items')->where('family', $name)->update([
                    'product_family_id' => $familyId,
                ]);
            });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_family_id');
        });

        Schema::dropIfExists('product_families');
    }

    private function lookupKey(string $name): string
    {
        $name = str_replace("\xC2\xA0", ' ', $name);
        $name = preg_replace('/\s+/u', ' ', $name) ?: $name;
        $name = mb_strtolower(trim($name));
        $ascii = function_exists('iconv') ? @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $name) : false;

        if ($ascii !== false) {
            $name = $ascii;
        }

        return preg_replace('/[^a-z0-9]/', '', $name) ?: mb_strtoupper(trim($name));
    }
};
