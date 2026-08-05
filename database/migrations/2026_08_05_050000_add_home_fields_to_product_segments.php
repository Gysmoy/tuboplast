<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_segments', function (Blueprint $table) {
            if (!Schema::hasColumn('product_segments', 'image')) {
                $table->string('image', 500)->nullable()->after('description');
            }

            if (!Schema::hasColumn('product_segments', 'featured')) {
                $table->boolean('featured')->default(false)->after('image');
            }

            if (!Schema::hasColumn('product_segments', 'featured_order')) {
                $table->unsignedInteger('featured_order')->default(0)->after('featured');
            }
        });

        foreach ($this->defaults() as $row) {
            DB::table('product_segments')
                ->where('name', $row['name'])
                ->update([
                    'image' => $row['image'],
                    'featured' => $row['featured'],
                    'featured_order' => $row['featured_order'],
                    'updated_at' => now(),
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('product_segments', function (Blueprint $table) {
            if (Schema::hasColumn('product_segments', 'featured_order')) {
                $table->dropColumn('featured_order');
            }

            if (Schema::hasColumn('product_segments', 'featured')) {
                $table->dropColumn('featured');
            }

            if (Schema::hasColumn('product_segments', 'image')) {
                $table->dropColumn('image');
            }
        });
    }

    private function defaults(): array
    {
        return [
            ['name' => 'Edificaciones', 'image' => 'assets/img/categories/category-1.webp', 'featured' => 1, 'featured_order' => 10],
            ['name' => 'Saneamiento', 'image' => 'assets/img/categories/category-2.webp', 'featured' => 1, 'featured_order' => 20],
            ['name' => 'Mineria', 'image' => 'assets/img/categories/category-3.webp', 'featured' => 1, 'featured_order' => 30],
            ['name' => 'Agricultura', 'image' => 'assets/img/categories/category-4.webp', 'featured' => 1, 'featured_order' => 40],
        ];
    }
};
