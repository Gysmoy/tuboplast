<?php

namespace App\Http\Controllers\Admin;

use App\Models\ProductClassification;

class ProductClassificationController extends ProductTaxonomyController
{
    public $reactView = 'Admin/ProductClassifications';
    public $model = ProductClassification::class;
}
