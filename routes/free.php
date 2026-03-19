<?php

use App\Http\Controllers\ExchangeRateController;
use App\Http\Controllers\RemainingHistoryController;
use App\Http\Controllers\RevenueController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UtilController;
use Illuminate\Support\Facades\Route;

Route::get('/exchange-rates', [ExchangeRateController::class, 'refresh']);
Route::get('/subscriptions', [SubscriptionController::class, 'verify']);
Route::get('/remainings-history', [RemainingHistoryController::class, 'set']);
Route::post('/revenues', [RevenueController::class, 'save']);

Route::post('/deployments', [UtilController::class, 'notify']);
