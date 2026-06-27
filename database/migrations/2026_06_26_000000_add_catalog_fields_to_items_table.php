<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            // Moneda por item (el catálogo mezcla USD y PEN).
            $table->string('currency', 3)->nullable()->default('PEN')->after('price');

            // Especificaciones
            $table->string('use_type', 120)->nullable()->after('type');   // USO
            $table->string('material', 120)->nullable()->after('use_type');
            $table->string('color', 60)->nullable()->after('material');
            $table->string('brand', 120)->nullable()->after('color');      // Marca
            $table->string('unit', 20)->nullable()->after('brand');        // Unidad de Medida
            $table->unsignedInteger('masterpack')->nullable()->after('unit');
            $table->string('pieces', 20)->nullable()->after('masterpack'); // Número de piezas
            $table->string('origin_country', 120)->nullable()->after('pieces');
            $table->string('nominal_diameter', 60)->nullable()->after('diameter'); // Diametro Nominal
            $table->string('famcons', 160)->nullable()->after('classification');    // FAMCONS
            $table->string('family', 160)->nullable()->after('famcons');            // FAMILIA

            // Logística
            $table->string('package_type', 60)->nullable();      // Tipo de empaque
            $table->string('perishable', 60)->nullable();        // Perecible
            $table->string('hazardous', 60)->nullable();         // Producto peligroso
            $table->decimal('product_height', 10, 2)->nullable();
            $table->decimal('product_width', 10, 2)->nullable();
            $table->decimal('product_depth', 10, 2)->nullable();
            $table->decimal('product_weight', 10, 3)->nullable();
            $table->decimal('logistic_height', 10, 2)->nullable();
            $table->decimal('logistic_width', 10, 2)->nullable();
            $table->decimal('logistic_depth', 10, 2)->nullable();
            $table->decimal('logistic_weight', 10, 3)->nullable();

            // Avisos / uso
            $table->text('warranty')->nullable();               // Garantía
            $table->text('features')->nullable();               // Características
            $table->text('usage_recommendations')->nullable();  // Recomendaciones De Uso
            $table->text('observations')->nullable();           // Observaciones
            $table->text('usage_warning')->nullable();          // Advertencia de uso
        });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropColumn([
                'currency', 'use_type', 'material', 'color', 'brand', 'unit',
                'masterpack', 'pieces', 'origin_country', 'nominal_diameter',
                'famcons', 'family', 'package_type', 'perishable', 'hazardous',
                'product_height', 'product_width', 'product_depth', 'product_weight',
                'logistic_height', 'logistic_width', 'logistic_depth', 'logistic_weight',
                'warranty', 'features', 'usage_recommendations', 'observations', 'usage_warning',
            ]);
        });
    }
};
