<?php

namespace App\Http\Controllers;

use App\Models\Size;
use Illuminate\Http\Request;

class SizeController extends Controller
{
    public function index(){
        $sizes = Size::all();
        return response()->json(['success' => true, 'data' => $sizes]);
    }
    public function show($id){
        $size = Size::find($id);
        if (!$size) {
            return response()->json(['success' => false, 'message' => 'Size not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $size]);
    }
}
