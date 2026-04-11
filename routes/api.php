<?php

use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::post('landing', [LandingController::class, 'storeContact']);
Route::get('projects/media/{uuid}', [ProjectController::class, 'media']);

Route::middleware('auth')->group(function () {
    Route::delete('logout', [AuthController::class, 'destroy']);

    Route::post('contacts/paginate', [ContactController::class, 'paginate']);
    Route::delete('contacts/{id}', [ContactController::class, 'delete']);

    Route::post('projects/paginate', [ProjectController::class, 'paginate']);
    Route::post('projects', [ProjectController::class, 'save']);
    Route::get('projects/{id}', [ProjectController::class, 'get']);
    Route::delete('projects/{id}', [ProjectController::class, 'delete']);
});
