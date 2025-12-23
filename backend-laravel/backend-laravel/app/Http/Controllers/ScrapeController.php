<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;

class ScrapeController extends Controller
{
    public function scrape()
    {
        Artisan::call('beyondchats:scrape-blogs --limit=5');
        return response()->json([
            'status' => 'success',
            'message' => 'Scraping started & completed'
        ]);
    }
}
