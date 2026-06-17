<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('code', 40)->nullable();
            $table->string('name', 120);
            $table->string('business', 160)->nullable();
            $table->string('ruc', 11)->nullable();
            $table->string('email', 180);
            $table->string('phone', 40)->nullable();
            $table->string('region', 120)->nullable();
            $table->boolean('accepted_terms')->default(false);
            $table->json('items')->nullable();
            $table->unsignedInteger('total_items')->default(0);
            $table->string('ip_address', 45)->nullable();
            $table->string('browser', 160)->nullable();
            $table->string('device_type', 20)->nullable();
            $table->string('operating_system', 160)->nullable();
            $table->text('user_agent')->nullable();
            $table->boolean('seen')->default(false);
            $table->boolean('status')->nullable()->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
