<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach ([
            'product_segments',
            'product_lines',
            'product_classifications',
            'product_types',
        ] as $tableName) {
            Schema::create($tableName, function (Blueprint $table) {
                $table->id();
                $table->string('name', 160);
                $table->string('slug', 180)->nullable()->index();
                $table->text('description')->nullable();
                $table->boolean('status')->nullable()->default(true);
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('product_types');
        Schema::dropIfExists('product_classifications');
        Schema::dropIfExists('product_lines');
        Schema::dropIfExists('product_segments');
    }
};
