<?php

use App\Models\Item;

// Sibling images already downloaded for the two products whose source image 404'd.
$roscadaImage = Item::where('title', 'Tubos PVC Agua Fria R')->value('image'); // Agua Fría tube photo
$ufImage = Item::where('title', 'like', 'Tuberia PVC Alcantarillado%')->whereNotNull('image')->value('image'); // UF tube photo

if ($roscadaImage) {
    $n = Item::where('title', 'like', 'Tuberia PVC Agua Fria SP%')->whereNull('image')->update(['image' => $roscadaImage]);
    echo "Agua Fria SP actualizados: {$n}" . PHP_EOL;
}

if ($ufImage) {
    $n = Item::where('title', 'like', 'Tuberia PVC Agua Potable%')->whereNull('image')->update(['image' => $ufImage]);
    echo "Agua Potable UF actualizados: {$n}" . PHP_EOL;
}

echo 'Items sin imagen restantes: ' . Item::whereNull('image')->count() . PHP_EOL;
