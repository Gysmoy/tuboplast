<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('home_expert_categories');
    }

    public function down(): void
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
    }
};
