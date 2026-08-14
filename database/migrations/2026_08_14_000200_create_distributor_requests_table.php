<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('distributor_requests', function (Blueprint $table) {
            $table->id();
            $table->string('business', 160);
            $table->string('name', 120);
            $table->string('email', 180);
            $table->string('celular', 9);
            $table->string('ruc', 11);
            $table->string('service', 160);
            $table->string('department', 120);
            $table->string('province', 120);
            $table->string('district', 120);
            $table->string('ubigeo', 12);
            $table->text('message')->nullable();
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
        Schema::dropIfExists('distributor_requests');
    }
};
