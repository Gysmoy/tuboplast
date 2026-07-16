<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sliders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->nullable()->constrained('items')->nullOnDelete();
            $table->string('title', 180);
            $table->text('description')->nullable();
            $table->string('image', 500)->nullable();
            $table->string('primary_button_text', 120)->nullable();
            $table->string('primary_button_link', 500)->nullable();
            $table->string('secondary_button_text', 120)->nullable();
            $table->string('secondary_button_link', 500)->nullable();
            $table->string('metric_one_value', 40)->nullable();
            $table->string('metric_one_label', 120)->nullable();
            $table->string('metric_two_value', 40)->nullable();
            $table->string('metric_two_label', 120)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('status')->nullable()->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sliders');
    }
};
