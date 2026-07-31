<?php

namespace App\Http\Controllers\Admin;

use App\Models\ProductType;

class ProductTypeController extends ProductTaxonomyController
{
    public $reactView = 'Admin/ProductTypes';
    public $model = ProductType::class;
}
