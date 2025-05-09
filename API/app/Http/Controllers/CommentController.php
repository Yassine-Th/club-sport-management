<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index($id)
{
    $comments = Comment::with('user')
        ->where('news_id', $id)
        ->get();

    return response()->json([
        'message' => "comment camee succses",
        'comments' => $comments
    ]);
}

    public function store(Request $request){
      $validatedData = $request->validate([
            "user_id" => "required|exists:users,id",
            "news_id" => "required|exists:news,id",
            "comment" => "required"
        ]);

       $comment =  Comment::create([
            "user_id" => $validatedData['user_id'],
            "news_id" => $validatedData['news_id'],
            "content" => $validatedData['comment']
        ]);

        $comment->load('user');

        return response()->json([
            'message' => 'comment created successfully',
            'comment' => $comment
        ])->setStatusCode(201);
    }

    public function destroy($id){
        $comment = Comment::findOrFail($id);
        $comment->delete();
        return response()->json([
            "message" => "comment deleted succses"
        ]);
    }

    public function update(Request $request,$id){
        $request->validate([
            'content' => 'required'
        ]);

        $comment = Comment::findOrFail($id);

        $comment->content = $request->content;
        $comment->save();

        return
        response()->json([
            'message' => 'update succses comment'
        ]);
    
    }
}
