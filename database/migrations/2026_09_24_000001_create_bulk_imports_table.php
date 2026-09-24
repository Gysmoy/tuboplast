<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bulk_imports', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->string('mode')->nullable();
            $table->string('status')->default('pending');
            $table->string('file_path')->nullable();
            $table->string('images_zip_path')->nullable();
            $table->string('sheets_zip_path')->nullable();
            $table->text('message')->nullable();
            $table->json('result')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bulk_imports');
    }
};
