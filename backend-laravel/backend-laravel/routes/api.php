<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\ArticleController;

Route::apiResource('articles', ArticleController::class);
Route::get('articles-latest', [ArticleController::class, 'latest']);
Route::post('/scrape', [\App\Http\Controllers\ScrapeController::class, 'scrape']);
Route::get('/debug-db', function () {
    return DB::select('select now()');
});
