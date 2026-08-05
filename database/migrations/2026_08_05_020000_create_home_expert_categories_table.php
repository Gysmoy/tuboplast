<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_expert_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_segment_id')->nullable()->constrained('product_segments')->nullOnDelete();
            $table->string('title', 120);
            $table->string('image', 500)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('status')->default(true);
            $table->timestamps();
        });

        foreach ($this->defaults() as $row) {
            DB::table('home_expert_categories')->insert([
                'product_segment_id' => DB::table('product_segments')->where('name', $row['segment'])->value('id'),
                'title' => $row['title'],
                'image' => $row['image'],
                'sort_order' => $row['sort_order'],
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('home_expert_categories');
    }

    private function defaults(): array
    {
        return [
            ['title' => 'Edificación', 'segment' => 'Edificaciones', 'image' => 'assets/img/categories/category-1.webp', 'sort_order' => 10],
            ['title' => 'Saneamiento', 'segment' => 'Saneamiento', 'image' => 'assets/img/categories/category-2.webp', 'sort_order' => 20],
            ['title' => 'Minería', 'segment' => 'Mineria', 'image' => 'assets/img/categories/category-3.webp', 'sort_order' => 30],
            ['title' => 'Agricultura', 'segment' => 'Agricultura', 'image' => 'assets/img/categories/category-4.webp', 'sort_order' => 40],
        ];
    }
};
