<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('distribuidores', function (Blueprint $table) {
            $table->string('distributor_type', 40)->default('point_of_sale')->after('featured');
        });

        DB::table('distribuidores')
            ->where('featured', true)
            ->update(['distributor_type' => 'distributor']);

        DB::table('distribuidores')
            ->where(function ($query) {
                $query->whereNull('featured')->orWhere('featured', false);
            })
            ->update(['distributor_type' => 'point_of_sale']);
    }

    public function down(): void
    {
        Schema::table('distribuidores', function (Blueprint $table) {
            $table->dropColumn('distributor_type');
        });
    }
};
