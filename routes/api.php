<?php

use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DistribuidorController;
use App\Http\Controllers\Admin\SucursalController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\UbigeoController;
use Illuminate\Support\Facades\Route;

Route::post('landing', [LandingController::class, 'storeContact']);
Route::get('categories/media/{uuid}', [CategoryController::class, 'media']);
Route::get('ubigeo/inei', [UbigeoController::class, 'inei']);

Route::middleware('auth')->group(function () {
    Route::delete('logout', [AuthController::class, 'destroy']);

    Route::post('contacts/paginate', [ContactController::class, 'paginate']);
    Route::delete('contacts/{id}', [ContactController::class, 'delete']);
    Route::post('messages/paginate', [MessageController::class, 'paginate']);
    Route::patch('messages/seen', [MessageController::class, 'seen']);
    Route::delete('messages/{id}', [MessageController::class, 'delete']);

    Route::post('roles/paginate', [RoleController::class, 'paginate']);
    Route::post('roles', [RoleController::class, 'save']);
    Route::get('roles/options', [RoleController::class, 'options']);
    Route::get('permissions/options', [RoleController::class, 'permissionsOptions']);
    Route::get('roles/{id}', [RoleController::class, 'get']);
    Route::patch('roles/status', [RoleController::class, 'status']);
    Route::delete('roles/{id}', [RoleController::class, 'delete']);

    Route::post('users/paginate', [UserController::class, 'paginate']);
    Route::post('users', [UserController::class, 'save']);
    Route::get('users/{id}', [UserController::class, 'get']);
    Route::patch('users/status', [UserController::class, 'status']);
    Route::delete('users/{id}', [UserController::class, 'delete']);

    Route::post('distribuidores/paginate', [DistribuidorController::class, 'paginate']);
    Route::post('distribuidores', [DistribuidorController::class, 'save']);
    Route::get('distribuidores/{id}', [DistribuidorController::class, 'get']);
    Route::delete('distribuidores/{id}', [DistribuidorController::class, 'delete']);

    Route::post('sucursales/paginate', [SucursalController::class, 'paginate']);
    Route::post('sucursales', [SucursalController::class, 'save']);
    Route::get('sucursales/{id}', [SucursalController::class, 'get']);
    Route::delete('sucursales/{id}', [SucursalController::class, 'delete']);
    
    Route::post('categories/paginate', [CategoryController::class, 'paginate']);
    Route::post('categories', [CategoryController::class, 'save']);
    Route::get('categories/{id}', [CategoryController::class, 'get']);
    Route::patch('categories/status', [CategoryController::class, 'status']);
    Route::delete('categories/{id}', [CategoryController::class, 'delete']);

    Route::put('account/profile', [AccountController::class, 'updateProfile']);
    Route::patch('account/password', [AccountController::class, 'updatePassword']);
    Route::post('account/avatar', [AccountController::class, 'updateAvatar']);
});
