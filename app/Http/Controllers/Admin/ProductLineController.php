<?php

namespace App\Http\Controllers\Admin;

use App\Models\ProductLine;

class ProductLineController extends ProductTaxonomyController
{
    public $reactView = 'Admin/ProductLines';
    public $model = ProductLine::class;
}
