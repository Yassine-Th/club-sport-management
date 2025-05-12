<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
            'author_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string|in:match,transfer,club,other',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        News::create([
            'author_id' => $validatedData['author_id'],
            'title' => $validatedData['title'],
            'content' => $validatedData['content'],
            'category' => $validatedData['category'],
            'image' => $request->hasFile('image') ? $request->file('image')->store('images', 'public') : null,
        ]);

        return response()->json([
            'message' => 'News created successfully',
        ])->setStatusCode(201);
    }

    public function destroy($id)
    {
        $news = News::findOrFail($id);

        if ($news->image && Storage::disk('public')->exists($news->image)) {
            Storage::disk('public')->delete($news->image);
        }
        
        // Supprimer la news
        $news->delete();
        
        return response()->json([
            'message' => 'News deleted successfully',
        ], 200);
    }

    public function edit($id)
    {
        $news = News::findOrFail($id);
        return response()->json([
            'message' => 'News fetched successfully',
            'news' => $news,
        ])->setStatusCode(200);
    }


  public function update(Request $request, $id)
{
    $validatedData = $request->validate([
        'author_id' => 'required|exists:users,id',
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'category' => 'required|string|in:match,transfer,club,other',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $news = News::find($id);

    if (!$news) {
        return response()->json([
            'message' => 'news  not found.'
        ], 404);
    }

    // تحديث الحقول
    $news->title = $validatedData['title'];
    $news->content = $validatedData['content'];
    $news->category = $validatedData['category'];
    $news->author_id = $validatedData['author_id'];

    if ($request->hasFile('image')) {
       if ($news->image && Storage::disk('public')->exists($news->image)) {
            Storage::disk('public')->delete($news->image);
        }
        // رفع الصورة الجديدة
        $news->image =  $request->hasFile('image') ? $request->file('image')->store('images', 'public') : null;

    }

    $news->save();

    return response()->json([
        'message' => 'news modifier success',
        'news' => $news
    ], 200);
}

    
}

