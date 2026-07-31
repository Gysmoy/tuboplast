<?php

namespace App\Http\Controllers\Admin;

use App\Models\ProductSegment;

class ProductSegmentController extends ProductTaxonomyController
{
    public $reactView = 'Admin/ProductSegments';
    public $model = ProductSegment::class;
}
