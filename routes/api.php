<?php

use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::post('landing', [LandingController::class, 'save']);