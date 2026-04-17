<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('distribuidores', function (Blueprint $table) {
            $table->id();
            $table->string('department', 120);
            $table->string('province', 120);
            $table->string('district', 120);
            $table->string('ubigeo', 12);
            $table->string('address', 255);
            $table->string('reference', 255)->nullable();
            $table->decimal('latitude', 11, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('status')->nullable()->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distribuidores');
    }
};

