<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_pages', function (Blueprint $table) {
            $table->id();
            $table->string('hero_badge')->nullable();
            $table->string('hero_title')->nullable();
            $table->text('hero_description')->nullable();
            $table->string('hero_primary_label')->nullable();
            $table->string('hero_secondary_label')->nullable();
            $table->json('hero_cards')->nullable();
            $table->json('milestones')->nullable();
            $table->json('values')->nullable();
            $table->string('commitment_eyebrow')->nullable();
            $table->string('commitment_title')->nullable();
            $table->text('commitment_description')->nullable();
            $table->string('family_eyebrow')->nullable();
            $table->string('family_title')->nullable();
            $table->text('family_lead')->nullable();
            $table->text('family_paragraph_1')->nullable();
            $table->text('family_paragraph_2')->nullable();
            $table->string('family_metric_value')->nullable();
            $table->string('family_metric_label')->nullable();
            $table->string('family_aside_1_title')->nullable();
            $table->text('family_aside_1_text')->nullable();
            $table->string('family_aside_2_title')->nullable();
            $table->text('family_aside_2_text')->nullable();
            $table->string('mission_eyebrow')->nullable();
            $table->string('mission_title')->nullable();
            $table->text('mission_text')->nullable();
            $table->string('vision_eyebrow')->nullable();
            $table->string('vision_title')->nullable();
            $table->text('vision_text')->nullable();
            $table->json('family_values')->nullable();
            $table->string('policy_eyebrow')->nullable();
            $table->string('policy_title')->nullable();
            $table->text('policy_description')->nullable();
            $table->json('policy_bullets')->nullable();
            $table->json('certifications')->nullable();
            $table->boolean('status')->nullable()->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_pages');
    }
};
