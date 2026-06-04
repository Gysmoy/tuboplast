<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('about_pages', function (Blueprint $table) {
            $table->string('policy_image')->nullable()->after('family_image');
        });
    }

    public function down(): void
    {
        Schema::table('about_pages', function (Blueprint $table) {
            $table->dropColumn('policy_image');
        });
    }
};
