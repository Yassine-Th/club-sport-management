<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class UserNewsController extends Controller
{
    public function index(){
        $news = News::orderBy('id', 'desc')->get();


        return response()->json([
            'message' => 'News fetched successfully',
            'news' => $news,
        ])->setStatusCode(200);
    }

    public function show($id){
        $news = News::find($id);

        if (!$news) {
            return response()->json([
                'message' => 'News not found',
            ])->setStatusCode(404);
        }

        $relationNews = News::where('category', $news->category)->get();



        return response()->json([
            'message' => 'News fetched successfully',
            'news' => $news,
            'relationNews' => $relationNews

        ])->setStatusCode(200);
    }
}
