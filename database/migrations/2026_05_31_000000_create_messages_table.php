<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('business', 160)->nullable();
            $table->string('name', 120);
            $table->string('email', 180);
            $table->string('service', 160)->nullable();
            $table->string('source', 60)->nullable();
            $table->text('message');
            $table->string('ip_address', 45)->nullable();
            $table->string('browser', 160)->nullable();
            $table->string('device_type', 20)->nullable();
            $table->string('operating_system', 160)->nullable();
            $table->text('user_agent')->nullable();
            $table->boolean('status')->nullable()->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
