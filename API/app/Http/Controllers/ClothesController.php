<?php

namespace App\Http\Controllers;

use App\Models\Clothes;
use Illuminate\Http\Request;

class ClothesController extends Controller
{
    public function index()
    {
        $clothes = Clothes::with(["product", "sizes"])->get();
        if ($clothes->isEmpty()) {
            return response()->json(['message' => 'No clothes found'], 404);
        }
        return response()->json($clothes, 200);
    }
    public function show ($id)
    {
        $clothes = Clothes::with(["product", "sizes"])->find($id);
        if (!$clothes) {
            return response()->json(['message' => 'Clothes not found'], 404);
        }
        return response()->json($clothes, 200);
    }
    public function store(Request $request)
    {
        $clothes = Clothes::create($request->all());
        return response()->json($clothes, 201);
    }
    public function update(Request $request, $id)
    {
        $clothes = Clothes::find($id);
        if (!$clothes) {
            return response()->json(['message' => 'Clothes not found'], 404);
        }
        $clothes->update($request->all());
        return response()->json($clothes, 200);
    }
    public function destroy($id)
    {
        $clothes = Clothes::find($id);
        if (!$clothes) {
            return response()->json(['message' => 'Clothes not found'], 404);
        }
        $clothes->delete();
        return response()->json(['message' => 'Clothes deleted successfully'], 200);
    }
}
