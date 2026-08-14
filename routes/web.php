<?php

use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\ClubController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\HomeController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DistribuidorController;
use App\Http\Controllers\Admin\DistributorRequestController;
use App\Http\Controllers\Admin\SucursalController;
use App\Http\Controllers\Admin\SliderController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ItemController;
use App\Http\Controllers\Admin\ProductClassificationController;
use App\Http\Controllers\Admin\ProductFamilyController;
use App\Http\Controllers\Admin\ProductLineController;
use App\Http\Controllers\Admin\ProductSegmentController;
use App\Http\Controllers\Admin\ProductTypeController;
use App\Http\Controllers\Admin\AboutController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\QuoteController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');
Route::get('/robots.txt', [SitemapController::class, 'robots'])->name('robots');

Route::get('/', [LandingController::class, 'reactView'])->name('landing');
Route::get('/catalog', [LandingController::class, 'catalogView'])->name('catalog');
Route::get('/distributors', [LandingController::class, 'distributorsView'])->name('distributors');
Route::get('/about', [LandingController::class, 'aboutView'])->name('about');
Route::get('/sgi-policy', [LandingController::class, 'aboutPoliticaView'])->name('about.politica');
Route::get('/about/media/{path}', [LandingController::class, 'aboutMedia'])->where('path', '.*')->name('about.media');
Route::get('/blog/media/{path}', [LandingController::class, 'blogMedia'])->where('path', '.*')->name('blog.media');
Route::redirect('/family', '/about', 301);
Route::redirect('/about/familia', '/about', 301);
Route::redirect('/nosotros-familia', '/about', 301);
Route::redirect('/politica-sgi', '/sgi-policy', 301);
Route::redirect('/about/politica', '/sgi-policy', 301);
Route::redirect('/nosotros-politica', '/sgi-policy', 301);
Route::get('/blog', [LandingController::class, 'blogView'])->name('blog');
Route::get('/blog/{slug}', [LandingController::class, 'blogPostView'])->where('slug', '[A-Za-z0-9\-]+')->name('blog.post');
Route::get('/contact', [LandingController::class, 'contactView'])->name('contact');
Route::get('/club', [LandingController::class, 'clubView'])->name('club');
Route::get('/item/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('/privacy-policy', [LandingController::class, 'reactView']);
Route::post('/landing/contact', [LandingController::class, 'storeContact'])->name('landing.contact');
Route::post('/landing/club', [LandingController::class, 'storeClub'])->name('landing.club');
Route::post('/landing/distributor-request', [LandingController::class, 'storeDistributorRequest'])->name('landing.distributor-request');
Route::post('/landing/quote', [LandingController::class, 'storeQuote'])->name('landing.quote');

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
    Route::redirect('/sliders', '/admin/sliders');
    Route::redirect('/categories', '/admin/categories');
    Route::redirect('/product-segments', '/admin/product-segments');
    Route::redirect('/product-lines', '/admin/product-lines');
    Route::redirect('/product-classifications', '/admin/product-classifications');
    Route::redirect('/product-families', '/admin/product-families');
    Route::redirect('/product-types', '/admin/product-types');
    Route::redirect('/about-page', '/admin/about');
    Route::redirect('/nosotros', '/admin/about');
    Route::get('/account', [AccountController::class, 'reactView'])->name('account');

    Route::get('/admin/home', [HomeController::class, 'reactView'])->name('admin.home');
    Route::get('/admin/contacts', [ContactController::class, 'reactView'])->name('admin.contacts');
    Route::get('/admin/quotes', [QuoteController::class, 'reactView'])->name('admin.quotes');
    Route::get('/admin/club', [ClubController::class, 'reactView'])->name('admin.club');
    Route::get('/admin/distributor-requests', [DistributorRequestController::class, 'reactView'])->name('admin.distributor-requests');
    Route::get('/admin/messages', [MessageController::class, 'reactView'])->name('admin.messages');
    Route::get('/admin/account', [AccountController::class, 'reactView'])->name('admin.account');
    Route::get('/admin/roles', [RoleController::class, 'reactView'])->name('admin.roles');
    Route::get('/admin/users', [UserController::class, 'reactView'])->name('admin.users');
    Route::redirect('/admin/distribuidores', '/admin/distributors');
    Route::redirect('/admin/sucursales', '/admin/branches');
    Route::redirect('/admin/slider', '/admin/sliders');
    Route::redirect('/admin/banners', '/admin/sliders');
    Route::redirect('/admin/expertos-en', '/admin/product-segments');
    Route::redirect('/admin/categorias', '/admin/categories');
    Route::redirect('/admin/segmentos', '/admin/product-segments');
    Route::redirect('/admin/lineas-producto', '/admin/product-lines');
    Route::redirect('/admin/clasificaciones', '/admin/product-classifications');
    Route::redirect('/admin/familias', '/admin/product-families');
    Route::redirect('/admin/tipos-producto', '/admin/product-types');
    Route::redirect('/admin/nosotros', '/admin/about');
    Route::redirect('/admin/blogs', '/admin/blog');
    Route::get('/admin/distributors', [DistribuidorController::class, 'reactView'])->name('admin.distributors');
    Route::get('/admin/branches', [SucursalController::class, 'reactView'])->name('admin.branches');
    Route::get('/admin/sliders', [SliderController::class, 'reactView'])->name('admin.sliders');
    Route::get('/admin/categories', [CategoryController::class, 'reactView'])->name('admin.categories');
    Route::get('/admin/product-segments', [ProductSegmentController::class, 'reactView'])->name('admin.product-segments');
    Route::get('/admin/product-lines', [ProductLineController::class, 'reactView'])->name('admin.product-lines');
    Route::get('/admin/product-classifications', [ProductClassificationController::class, 'reactView'])->name('admin.product-classifications');
    Route::get('/admin/product-families', [ProductFamilyController::class, 'reactView'])->name('admin.product-families');
    Route::get('/admin/product-types', [ProductTypeController::class, 'reactView'])->name('admin.product-types');
    Route::get('/admin/items', [ItemController::class, 'reactView'])->name('admin.items');
    Route::get('/admin/about', [AboutController::class, 'reactView'])->name('admin.about');
    Route::get('/admin/blog', [BlogController::class, 'reactView'])->name('admin.blog');
});
