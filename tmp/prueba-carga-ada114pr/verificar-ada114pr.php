<?php

use App\Models\Item;

require __DIR__ . '/../../vendor/autoload.php';

$app = require __DIR__ . '/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$items = Item::with('images')
    ->where('sku', 'ADA114PR')
    ->orderBy('id')
    ->get();

echo json_encode($items->map(fn (Item $item) => [
    'id' => $item->id,
    'sku' => $item->sku,
    'name' => $item->name,
    'image' => $item->image,
    'technical_sheet' => $item->technical_sheet,
    'visible' => $item->visible,
    'gallery_count' => $item->images->count(),
    'gallery' => $item->images->map(fn ($image) => [
        'path' => $image->path,
        'sort_order' => $image->sort_order,
        'exists' => Storage::disk('public')->exists($image->path),
    ])->values(),
    'image_exists' => $item->image ? Storage::disk('public')->exists($item->image) : false,
    'technical_sheet_exists' => $item->technical_sheet ? Storage::disk('public')->exists($item->technical_sheet) : false,
])->values(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
