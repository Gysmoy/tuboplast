<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LandingController extends BasicController
{

    public $reactView = 'Landing';
    public $reactRootView ='public';
}