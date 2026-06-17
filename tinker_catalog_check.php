<?php

use App\Models\Item;

$total = Item::where('status', true)->count();
$page = Item::where('status', true)->orderByDesc('views')->paginate(9);
echo "total activos: {$total}" . PHP_EOL;
echo "items en pagina 1: " . $page->count() . " / last_page: " . $page->lastPage() . PHP_EOL;
echo "filtro diametro 2\": " . Item::where('status', true)->whereJsonContains('diameters', '2"')->count() . PHP_EOL;
echo "filtro segmento Saneamiento: " . Item::where('status', true)->where('segment', 'Saneamiento')->count() . PHP_EOL;
