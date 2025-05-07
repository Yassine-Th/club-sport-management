<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::with('author')->get();
        return response()->json([
            'message' => 'News fetched successfully',
            'data' => $news,
        ])->setStatusCode(200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'journalist_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|in:match,transfer,club,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        News::create([
            'journalist_id' => $validatedData['journalist_id'],
            'title' => $validatedData['title'],
            'content' => $validatedData['content'],
            'category' => $validatedData['category'],
            'image' => $request->hasFile('image') ? $request->file('image')->store('images', 'public') : null,
        ]);

        return response()->json([
            'message' => 'News created successfully',
        ])->setStatusCode(201);
    }
}
