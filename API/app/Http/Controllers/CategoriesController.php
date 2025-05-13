<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    public function index()
    {
        $categories = Categories::with('products')
            ->withCount('products')
            ->get();
        if ($categories->isEmpty()) {
            return response()->json(['success' => false, 'message' => 'No categories found'], 404);
        }
        return response()->json(['success' => true, 'data' => $categories]);
    }

    public function show($id)
    {
        $category = Categories::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }
        return response()->json(['success' => true, 'data' => $category]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $category = Categories::create($request->all());
        return response()->json(['success' => true, 'data' => $category]);
    }
    public function update(Request $request, $id)
    {
        $category = Categories::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string|max:1000',
        ]);

        $category->update($request->all());
        return response()->json(['success' => true, 'data' => $category]);
    }
    public function destroy($id)
    {
        $category = Categories::find($id);
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        $category->delete();
        return response()->json(['success' => true, 'message' => 'Category deleted successfully']);
    }
}
