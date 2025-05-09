<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index_news(){
        $latestNews = News::orderBy('id', 'desc')->take(3)->get();
        return response()->json([
            'message' => 'Latest news fetched successfully',
            'latestNews' => $latestNews,
        ])->setStatusCode(200);
    }
}
