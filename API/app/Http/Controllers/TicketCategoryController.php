<?php

namespace App\Http\Controllers;

use App\Models\ticketCategories;
use Illuminate\Http\Request;

class TicketCategoryController extends Controller
{
    public function index()
    {
        $categories = ticketCategories::all();
        return response()->json($categories);
    }

    public function show($id)
    {
        $category = ticketCategories::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        return response()->json($category);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
            'gate' => 'required|string|max:50',
        ]);

        // Create the category with the validated data
        $category = ticketCategories::create($validated);

        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = ticketCategories::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $validated = $request->validate([
            'category' => 'sometimes|required|string|max:255',
            'gate' => 'sometimes|required|string|max:50',
        ]);

        $category->update($validated);

        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = ticketCategories::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        // Check if category is in use
        if ($category->tickets()->count() > 0) {
            return response()->json(['message' => 'Cannot delete category that is in use'], 400);
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
