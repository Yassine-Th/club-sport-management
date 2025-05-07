<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index () {
        $products = Product::with(["category", "clothes.sizes"])->get();
        return response()->json(['success' => true,'data' => $products
        ]);
    }
    public function show ($id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }
        return response()->json(['success' => true,'data' => $product
        ]);
    }
    public function store (Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create($request->all());
        return response()->json(['success' => true,'data' => $product
        ]);
    }
    public function update (Request $request, $id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:1000',
            'price' => 'sometimes|required|numeric|min:0',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'stock' => 'sometimes|required|integer|min:0',
        ]);

        $product->update($request->all());
        return response()->json(['success' => true,'data' => $product
        ]);
    }
    public function destroy ($id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $product->delete();
        return response()->json(['success' => true,'message' => 'Product deleted successfully'
        ]);
    }
    public function search(Request $request)
    {
        $query = $request->input('query');
        $products = Product::where('name', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->get();

        return response()->json(['success' => true, 'data' => $products]);
    }
}
