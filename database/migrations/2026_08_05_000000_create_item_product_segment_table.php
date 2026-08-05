<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_product_segment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('item_id')->constrained('items')->cascadeOnDelete();
            $table->foreignId('product_segment_id')->constrained('product_segments')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['item_id', 'product_segment_id']);
        });

        $segmentIds = $this->ensureSegments([
            'Predial',
            'Edificaciones',
            'Saneamiento',
            'Infraestructura',
            'Mineria',
            'Agricultura',
        ]);

        DB::table('items')
            ->whereNotNull('status')
            ->orderBy('id')
            ->get(['id', 'product_segment_id', 'segment'])
            ->each(function ($item) use ($segmentIds) {
                $names = $this->segmentNamesFor($item->segment);

                if (!$names && $item->product_segment_id) {
                    $name = DB::table('product_segments')->where('id', $item->product_segment_id)->value('name');
                    $names = $this->segmentNamesFor($name);
                }

                $ids = collect($names)
                    ->map(fn ($name) => $segmentIds[$this->lookupKey($name)] ?? null)
                    ->filter()
                    ->values();

                if ($ids->isEmpty() && $item->product_segment_id) {
                    $ids->push($item->product_segment_id);
                }

                foreach ($ids->unique() as $segmentId) {
                    DB::table('item_product_segment')->insertOrIgnore([
                        'item_id' => $item->id,
                        'product_segment_id' => $segmentId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                $primaryId = $ids->first();
                if ($primaryId) {
                    DB::table('items')->where('id', $item->id)->update([
                        'product_segment_id' => $primaryId,
                        'segment' => DB::table('product_segments')->where('id', $primaryId)->value('name'),
                        'updated_at' => now(),
                    ]);
                }
            });

        DB::table('product_segments')
            ->get(['id', 'name'])
            ->filter(fn ($row) => in_array($this->lookupKey($row->name), [
                'predialoedificaciones',
                'saneamientooinfraestructura',
            ], true))
            ->each(fn ($row) => DB::table('product_segments')->where('id', $row->id)->update([
                'status' => null,
                'updated_at' => now(),
            ]));
    }

    public function down(): void
    {
        Schema::dropIfExists('item_product_segment');
    }

    private function ensureSegments(array $names): array
    {
        $ids = [];

        foreach ($names as $name) {
            $existing = DB::table('product_segments')
                ->get(['id', 'name'])
                ->first(fn ($row) => $this->lookupKey($row->name) === $this->lookupKey($name));

            if ($existing) {
                DB::table('product_segments')->where('id', $existing->id)->update([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'status' => 1,
                    'updated_at' => now(),
                ]);
                $ids[$this->lookupKey($name)] = $existing->id;
                continue;
            }

            $ids[$this->lookupKey($name)] = DB::table('product_segments')->insertGetId([
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => null,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return $ids;
    }

    private function segmentNamesFor(?string $value): array
    {
        return match ($this->lookupKey((string) $value)) {
            'predialoedificaciones' => ['Predial', 'Edificaciones'],
            'saneamientooinfraestructura' => ['Saneamiento', 'Infraestructura'],
            'predial' => ['Predial'],
            'edificaciones' => ['Edificaciones'],
            'saneamiento' => ['Saneamiento'],
            'infraestructura' => ['Infraestructura'],
            'mineria' => ['Mineria'],
            'agricultura' => ['Agricultura'],
            default => $value ? [trim($value)] : [],
        };
    }

    private function lookupKey(string $value): string
    {
        $value = mb_strtolower(trim(preg_replace('/\s+/u', ' ', str_replace("\xC2\xA0", ' ', $value))));
        $ascii = function_exists('iconv') ? @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) : false;

        if ($ascii !== false) {
            $value = $ascii;
        }

        return preg_replace('/[^a-z0-9]/', '', $value) ?: mb_strtoupper(trim($value));
    }
};
