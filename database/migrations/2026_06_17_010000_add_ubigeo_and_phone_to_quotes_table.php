<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->string('phone_prefix', 8)->nullable()->after('phone');
            $table->string('department', 120)->nullable()->after('region');
            $table->string('province', 120)->nullable()->after('department');
            $table->string('district', 120)->nullable()->after('province');
            $table->string('ubigeo', 12)->nullable()->after('district');
        });
    }

    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn(['phone_prefix', 'department', 'province', 'district', 'ubigeo']);
        });
    }
};
