<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->foreignId('product_segment_id')->nullable()->after('category_id')->constrained('product_segments')->nullOnDelete();
            $table->foreignId('product_line_id')->nullable()->after('product_segment_id')->constrained('product_lines')->nullOnDelete();
            $table->foreignId('product_classification_id')->nullable()->after('product_line_id')->constrained('product_classifications')->nullOnDelete();
            $table->foreignId('product_type_id')->nullable()->after('product_classification_id')->constrained('product_types')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropConstrainedForeignId('product_type_id');
            $table->dropConstrainedForeignId('product_classification_id');
            $table->dropConstrainedForeignId('product_line_id');
            $table->dropConstrainedForeignId('product_segment_id');
        });
    }
};
