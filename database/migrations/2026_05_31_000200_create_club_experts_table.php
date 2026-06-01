<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('club_experts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 120);
            $table->string('dni', 12);
            $table->string('email', 180);
            $table->string('specialty', 120);
            $table->string('department', 120);
            $table->string('province', 120);
            $table->string('district', 120);
            $table->string('ubigeo', 12);
            $table->boolean('accepted_terms')->default(false);
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
        Schema::dropIfExists('club_experts');
    }
};
