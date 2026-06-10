<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('about_pages', function (Blueprint $table) {
            $table->string('policy_scope_eyebrow')->nullable()->after('policy_title');
            $table->string('policy_scope_title')->nullable()->after('policy_scope_eyebrow');
            $table->text('policy_scope_paragraph_1')->nullable()->after('policy_scope_title');
            $table->text('policy_scope_paragraph_2')->nullable()->after('policy_scope_paragraph_1');
            $table->string('policy_commitment_text')->nullable()->after('policy_scope_paragraph_2');
            $table->string('policy_certifications_title')->nullable()->after('policy_commitment_text');
        });
    }

    public function down(): void
    {
        Schema::table('about_pages', function (Blueprint $table) {
            $table->dropColumn([
                'policy_scope_eyebrow',
                'policy_scope_title',
                'policy_scope_paragraph_1',
                'policy_scope_paragraph_2',
                'policy_commitment_text',
                'policy_certifications_title',
            ]);
        });
    }
};
