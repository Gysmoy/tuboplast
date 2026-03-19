<?php

use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

Route::post('/email', [WebhookController::class, 'email']);
Route::post('/evoapi', [WebhookController::class, 'evoapi']);
