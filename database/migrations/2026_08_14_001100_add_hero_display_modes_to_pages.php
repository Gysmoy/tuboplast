<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('blog_pages', function (Blueprint $table) {
            $table->string('hero_display_mode', 40)->default('image_only')->after('hero_image');
        });

        Schema::table('about_pages', function (Blueprint $table) {
            $table->string('family_hero_display_mode', 40)->default('image_with_text')->after('family_image');
            $table->string('policy_hero_display_mode', 40)->default('image_with_text')->after('policy_image');
        });
    }

    public function down(): void
    {
        Schema::table('blog_pages', function (Blueprint $table) {
            $table->dropColumn('hero_display_mode');
        });

        Schema::table('about_pages', function (Blueprint $table) {
            $table->dropColumn(['family_hero_display_mode', 'policy_hero_display_mode']);
        });
    }
};
