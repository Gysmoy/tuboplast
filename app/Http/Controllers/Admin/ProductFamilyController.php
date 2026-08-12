<?php

namespace App\Http\Controllers\Admin;

use App\Models\ProductFamily;

class ProductFamilyController extends ProductTaxonomyController
{
    public $reactView = 'Admin/ProductFamilies';
    public $model = ProductFamily::class;
}
