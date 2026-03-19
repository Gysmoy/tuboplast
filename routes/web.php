<?php

use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'reactView'])->name('landing');
Route::get('/privacy-policy', [LandingController::class, 'reactView']);