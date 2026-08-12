<?php

use App\Models\Item;

require __DIR__ . '/../../vendor/autoload.php';

$app = require __DIR__ . '/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

Item::where('sku', 'ADA114PR')->get()->each(function (Item $item) {
    $item->images()->delete();
    $item->productSegments()->detach();
    $item->delete();
});

echo "ADA114PR reset\n";
