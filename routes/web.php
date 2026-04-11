<?php

use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingController;
use Illuminate\Support\Facades\Route;

Route::get('/', [LandingController::class, 'reactView'])->name('landing');
Route::get('/privacy-policy', [LandingController::class, 'reactView']);
Route::post('/landing/contact', [LandingController::class, 'storeContact'])->name('landing.contact');

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
    Route::redirect('/projects', '/admin/projects');

    Route::get('/admin/home', [HomeController::class, 'reactView'])->name('admin.home');
    Route::get('/admin/contacts', [ContactController::class, 'reactView'])->name('admin.contacts');
    Route::get('/admin/projects', [ProjectController::class, 'reactView'])->name('admin.projects');
});
