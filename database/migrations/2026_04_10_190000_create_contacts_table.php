<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('business')->nullable();
            $table->string('name');
            $table->string('email');
            $table->string('phone_prefix', 8)->nullable();
            $table->string('phone', 25)->nullable();
            $table->string('service')->nullable();
            $table->string('source')->nullable();
            $table->text('message')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
