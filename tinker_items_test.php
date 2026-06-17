<?php

use App\Models\Category;
use App\Models\Item;

$c = Category::create(['name' => '__TestCat', 'status' => 1]);
$i = Item::create([
    'category_id' => $c->id,
    'title' => 'Tubo Demo',
    'sku' => 'DEMO-1',
    'slug' => 'tubo-demo',
    'price' => 28.30,
    'pressure' => '150 PSI',
    'diameter' => '33 mm',
    'status' => 1,
]);

$mapped = Item::where('status', true)->with('category')->get()->map(fn ($x) => [
    'title' => $x->title,
    'cat' => $x->category->name ?? null,
    'price' => 'S/ ' . number_format((float) $x->price, 2),
]);

echo $mapped->toJson() . PHP_EOL;

$i->forceDelete();
$c->forceDelete();
echo 'cleaned' . PHP_EOL;
