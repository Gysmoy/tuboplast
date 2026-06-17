<?php

use Database\Seeders\CatalogSeeder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('items') || !Schema::hasTable('categories')) {
            return;
        }

        // Poblar el catálogo y copiar las imágenes incluidas en el repo hacia
        // el disco público (storage/app/public/items), accesible vía storage:link.
        (new CatalogSeeder())->run();
    }

    public function down(): void
    {
        // El catálogo no se elimina automáticamente al revertir.
    }
};
