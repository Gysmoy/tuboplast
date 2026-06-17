<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->string('segment', 120)->nullable()->after('category_id');
            $table->string('classification', 160)->nullable()->after('segment');
            $table->string('type', 60)->nullable()->after('classification');
            $table->json('diameters')->nullable()->after('diameter');
            $table->string('source_url', 500)->nullable()->after('diameters');
        });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn(['segment', 'classification', 'type', 'diameters', 'source_url']);
        });
    }
};
