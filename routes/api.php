<?php

use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\ClubController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DistribuidorController;
use App\Http\Controllers\Admin\SucursalController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\Admin\ProductClassificationController;
use App\Http\Controllers\Admin\ProductLineController;
use App\Http\Controllers\Admin\ProductSegmentController;
use App\Http\Controllers\Admin\ProductTypeController;
use App\Http\Controllers\Admin\AboutController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\QuoteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\UbigeoController;
use Illuminate\Support\Facades\Route;

Route::post('landing', [LandingController::class, 'storeContact']);
Route::get('catalog/search', [LandingController::class, 'searchProducts']);
Route::get('catalog/items', [LandingController::class, 'catalogItems']);
Route::get('categories/media/{uuid}', [CategoryController::class, 'media']);
Route::get('ubigeo/inei', [UbigeoController::class, 'inei']);

Route::middleware('auth')->group(function () {
    Route::delete('logout', [AuthController::class, 'destroy']);

    Route::get('admin/dashboard', [HomeController::class, 'data']);

    Route::post('contacts/paginate', [ContactController::class, 'paginate']);
    Route::delete('contacts/{id}', [ContactController::class, 'delete']);
    Route::post('messages/paginate', [MessageController::class, 'paginate']);
    Route::patch('messages/seen', [MessageController::class, 'seen']);
    Route::delete('messages/{id}', [MessageController::class, 'delete']);
    Route::post('club/paginate', [ClubController::class, 'paginate']);
    Route::patch('club/seen', [ClubController::class, 'seen']);
    Route::delete('club/{id}', [ClubController::class, 'delete']);
    Route::post('quotes/paginate', [QuoteController::class, 'paginate']);
    Route::patch('quotes/seen', [QuoteController::class, 'seen']);
    Route::patch('quotes/state', [QuoteController::class, 'changeState']);
    Route::delete('quotes/{id}', [QuoteController::class, 'delete']);

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

    Route::post('sliders/paginate', [SliderController::class, 'paginate']);
    Route::post('sliders', [SliderController::class, 'save']);
    Route::get('sliders/{id}', [SliderController::class, 'get']);
    Route::patch('sliders/status', [SliderController::class, 'status']);
    Route::delete('sliders/{id}', [SliderController::class, 'delete']);
    
    Route::post('categories/paginate', [CategoryController::class, 'paginate']);
    Route::post('categories', [CategoryController::class, 'save']);
    Route::get('categories/{id}', [CategoryController::class, 'get']);
    Route::patch('categories/status', [CategoryController::class, 'status']);
    Route::delete('categories/{id}', [CategoryController::class, 'delete']);

    Route::post('product-segments/paginate', [ProductSegmentController::class, 'paginate']);
    Route::post('product-segments', [ProductSegmentController::class, 'save']);
    Route::get('product-segments/{id}', [ProductSegmentController::class, 'get']);
    Route::patch('product-segments/status', [ProductSegmentController::class, 'status']);
    Route::delete('product-segments/{id}', [ProductSegmentController::class, 'delete']);

    Route::post('product-lines/paginate', [ProductLineController::class, 'paginate']);
    Route::post('product-lines', [ProductLineController::class, 'save']);
    Route::get('product-lines/{id}', [ProductLineController::class, 'get']);
    Route::patch('product-lines/status', [ProductLineController::class, 'status']);
    Route::delete('product-lines/{id}', [ProductLineController::class, 'delete']);

    Route::post('product-classifications/paginate', [ProductClassificationController::class, 'paginate']);
    Route::post('product-classifications', [ProductClassificationController::class, 'save']);
    Route::get('product-classifications/{id}', [ProductClassificationController::class, 'get']);
    Route::patch('product-classifications/status', [ProductClassificationController::class, 'status']);
    Route::delete('product-classifications/{id}', [ProductClassificationController::class, 'delete']);

    Route::post('product-types/paginate', [ProductTypeController::class, 'paginate']);
    Route::post('product-types', [ProductTypeController::class, 'save']);
    Route::get('product-types/{id}', [ProductTypeController::class, 'get']);
    Route::patch('product-types/status', [ProductTypeController::class, 'status']);
    Route::delete('product-types/{id}', [ProductTypeController::class, 'delete']);

    Route::post('items/paginate', [ItemController::class, 'paginate']);
    Route::post('items/import', [ItemController::class, 'import']);
    Route::post('items', [ItemController::class, 'save']);
    Route::get('items/{id}', [ItemController::class, 'get']);
    Route::patch('items/status', [ItemController::class, 'status']);
    Route::delete('items/{id}', [ItemController::class, 'delete']);

    Route::post('about', [AboutController::class, 'save']);
    Route::get('about/{id}', [AboutController::class, 'get']);

    Route::post('blog', [BlogController::class, 'save']);
    Route::get('blog/{id}', [BlogController::class, 'get']);

    Route::put('account/profile', [AccountController::class, 'updateProfile']);
    Route::patch('account/password', [AccountController::class, 'updatePassword']);
    Route::post('account/avatar', [AccountController::class, 'updateAvatar']);
});
