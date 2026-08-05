<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $this->copySegmentItems('Predial', 'Edificaciones');
        $this->copySegmentItems('Saneamiento', 'Infraestructura');
    }

    public function down(): void
    {
        //
    }

    private function copySegmentItems(string $fromName, string $toName): void
    {
        $fromId = DB::table('product_segments')->where('name', $fromName)->value('id');
        $toId = DB::table('product_segments')->where('name', $toName)->value('id');

        if (!$fromId || !$toId) {
            return;
        }

        DB::table('item_product_segment')
            ->where('product_segment_id', $fromId)
            ->orderBy('item_id')
            ->get(['item_id'])
            ->each(function ($row) use ($toId) {
                DB::table('item_product_segment')->insertOrIgnore([
                    'item_id' => $row->item_id,
                    'product_segment_id' => $toId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });
    }
};
