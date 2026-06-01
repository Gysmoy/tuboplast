<?php

use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\ClubController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DistribuidorController;
use App\Http\Controllers\Admin\SucursalController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'reactView'])->name('landing');
Route::get('/catalog', [LandingController::class, 'catalogView'])->name('catalog');
Route::get('/distributors', [LandingController::class, 'distributorsView'])->name('distributors');
Route::get('/contact', [LandingController::class, 'contactView'])->name('contact');
Route::get('/club', [LandingController::class, 'clubView'])->name('club');
Route::get('/item/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/privacy-policy', [LandingController::class, 'reactView']);
Route::post('/landing/contact', [LandingController::class, 'storeContact'])->name('landing.contact');
Route::post('/landing/club', [LandingController::class, 'storeClub'])->name('landing.club');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'loginView'])->name('Login.jsx');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('auth.logout');

    Route::redirect('/admin', '/admin/home');
    Route::redirect('/admin/', '/admin/home');

    Route::redirect('/home', '/admin/home');
    Route::redirect('/contacts', '/admin/contacts');
    Route::redirect('/messages', '/admin/messages');
    Route::redirect('/roles', '/admin/roles');
    Route::redirect('/users', '/admin/users');
    Route::redirect('/branches', '/admin/branches');
    Route::redirect('/categories', '/admin/categories');
    Route::get('/account', [AccountController::class, 'reactView'])->name('account');

    Route::get('/admin/home', [HomeController::class, 'reactView'])->name('admin.home');
    Route::get('/admin/contacts', [ContactController::class, 'reactView'])->name('admin.contacts');
    Route::get('/admin/club', [ClubController::class, 'reactView'])->name('admin.club');
    Route::get('/admin/messages', [MessageController::class, 'reactView'])->name('admin.messages');
    Route::get('/admin/account', [AccountController::class, 'reactView'])->name('admin.account');
    Route::get('/admin/roles', [RoleController::class, 'reactView'])->name('admin.roles');
    Route::get('/admin/users', [UserController::class, 'reactView'])->name('admin.users');
    Route::redirect('/admin/distribuidores', '/admin/distributors');
    Route::redirect('/admin/sucursales', '/admin/branches');
    Route::redirect('/admin/categorias', '/admin/categories');
    Route::get('/admin/distributors', [DistribuidorController::class, 'reactView'])->name('admin.distributors');
    Route::get('/admin/branches', [SucursalController::class, 'reactView'])->name('admin.branches');
    Route::get('/admin/categories', [CategoryController::class, 'reactView'])->name('admin.categories');
});
