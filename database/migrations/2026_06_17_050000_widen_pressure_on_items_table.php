<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

        if (Schema::hasColumn('items', 'pressure')) {
            DB::statement('ALTER TABLE items MODIFY pressure VARCHAR(255) NULL');
        }
    }

    public function down(): void
    {
        if (DB::connection()->getDriverName() === 'sqlite') {
            return;
        }

        if (Schema::hasColumn('items', 'pressure')) {
            DB::statement('ALTER TABLE items MODIFY pressure VARCHAR(60) NULL');
        }
    }
};
