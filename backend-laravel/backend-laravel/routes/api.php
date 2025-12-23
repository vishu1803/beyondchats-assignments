<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ArticleController;

Route::apiResource('articles', ArticleController::class);
Route::get('articles-latest', [ArticleController::class, 'latest']);
Route::post('/scrape', [\App\Http\Controllers\ScrapeController::class, 'scrape']);
