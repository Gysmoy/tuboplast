<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('distribuidores', function (Blueprint $table) {
            $table->string('name', 160)->nullable()->after('id');
            $table->string('phone', 60)->nullable()->after('reference');
            $table->string('business_hours', 120)->nullable()->after('phone');
            $table->boolean('featured')->default(false)->after('business_hours');
        });
    }

    public function down(): void
    {
        Schema::table('distribuidores', function (Blueprint $table) {
            $table->dropColumn(['name', 'phone', 'business_hours', 'featured']);
        });
    }
};
