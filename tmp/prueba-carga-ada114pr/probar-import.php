<?php

use App\Http\Controllers\Admin\ItemController;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

require __DIR__ . '/../../vendor/autoload.php';

$app = require __DIR__ . '/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$base = __DIR__;

$request = Request::create('/api/items/import', 'POST', [
    'mode' => 'upsert',
]);

$request->files->set('file', new UploadedFile(
    $base . '/items-ada114pr.csv',
    'items-ada114pr.csv',
    'text/csv',
    null,
    true
));

$request->files->set('images_zip', new UploadedFile(
    $base . '/imagenes-ada114pr.zip',
    'imagenes-ada114pr.zip',
    'application/zip',
    null,
    true
));

$request->files->set('sheets_zip', new UploadedFile(
    $base . '/fichas-ada114pr.zip',
    'fichas-ada114pr.zip',
    'application/zip',
    null,
    true
));

$response = app(ItemController::class)->import($request);
$payload = json_decode($response->getContent(), true);

$item = Item::with('images')->where('sku', 'ADA114PR')->first();

echo json_encode([
    'status' => $response->getStatusCode(),
    'payload' => $payload,
    'item' => $item ? [
        'sku' => $item->sku,
        'image' => $item->image,
        'technical_sheet' => $item->technical_sheet,
        'gallery_count' => $item->images->count(),
        'gallery' => $item->images->pluck('path')->values(),
        'image_exists' => $item->image ? Storage::disk('public')->exists($item->image) : false,
        'technical_sheet_exists' => $item->technical_sheet ? Storage::disk('public')->exists($item->technical_sheet) : false,
    ] : null,
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
