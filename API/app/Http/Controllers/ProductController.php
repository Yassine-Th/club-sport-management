<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(["category", "clothes.sizes"])->get();

        // Prepend storage URL to image paths only if the path is relative
        $products->each(function ($product) {
            if ($product->image && !str_starts_with($product->image, 'http')) {
                $product->image = asset('storage/' . $product->image);
            }
        });

        return response()->json(['success' => true, 'data' => $products]);
    }

    public function show($id)
    {
        $product = Product::with(["category", "clothes.sizes"])->find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        // Prepend storage URL to image path only if the path is relative
        if ($product->image && !str_starts_with($product->image, 'http')) {
            $product->image = asset('storage/' . $product->image);
        }

        return response()->json(['success' => true, 'data' => $product]);
    }

 
    public function store(Request $request)
    {
    $validated = $request->validate([
        'name' => 'required|string',
        'description' => 'required|string',
        'price' => 'required|numeric',
        'category_id' => 'required|exists:categories,id',
        'stock' => 'nullable|integer',
        'image' => 'nullable|image|max:2048',
        'is_clothing' => 'boolean',
        'gender' => 'nullable|string',
        'type' => 'nullable|string',
        'sizes' => 'nullable|json', // [{ size_id, label, stock }]
    ]);

    // Handle image upload
    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('products', 'public');
        $validated['image'] = $path;
    }

    // Save base product
    $product = Product::create($validated);

    // If it's clothing, create related Clothes and Sizes
    if ($request->boolean('is_clothing')) {
        $clothes = $product->clothes()->create([
            'gender' => $validated['gender'],
            'type' => $validated['type'],
        ]);

        $sizes = json_decode($request->sizes, true);
        foreach ($sizes as $size) {
            $clothes->sizes()->attach($size['size_id'], ['stock' => $size['stock']]);
        }
    }

    // Prepend storage URL to the image path
    if ($product->image && !str_starts_with($product->image, 'http')) {
        $product->image = asset('storage/' . $product->image);
    }

    return response()->json(['success' => true, 'data' => $product->fresh('clothes.sizes')]);
}

    public function update(Request $request, $id)
            {
                $product = Product::with('clothes.sizes')->find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|max:1000',
            'price' => 'sometimes|required|numeric|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'is_clothing' => 'sometimes|boolean',
            'gender' => 'required_if:is_clothing,1|string',
            'type' => 'required_if:is_clothing,1|string',
            'sizes' => 'required_if:is_clothing,1|json', // [{"size_id":1,"stock":10},...]
            'stock' => 'required_if:is_clothing,0|integer|min:0',
            'image' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        DB::beginTransaction();

        try {
            $data = $request->only(['name', 'description', 'price', 'category_id']);

            // Handle image upload
            if ($request->hasFile('image')) {
                // if ($product->image && Storage::disk('public')->exists($product->image)) {
                //     Storage::disk('public')->delete($product->image);
                // }
                $data['image'] = $request->file('image')->store('products', 'public');
            }

            // Common flags
            $isClothing = $request->boolean('is_clothing', false);
            $data['stock'] = $isClothing ? 0 : $request->input('stock', $product->stock);
            $data['is_clothing'] = $isClothing;

            // Update base product
            $product->update($data);

            if ($isClothing) {
                // Update or create the Clothes record
                $clothesData = [
                    'gender' => $request->input('gender'),
                    'type' => $request->input('type'),
                ];
                $clothes = $product->clothes()->updateOrCreate(['product_id' => $product->id], $clothesData);

                // Sync sizes pivot
                $sizes = json_decode($request->input('sizes'), true);
                $syncData = [];
                foreach ($sizes as $s) {
                    $syncData[$s['size_id']] = ['stock' => $s['stock']];
                }
                $clothes->sizes()->sync($syncData);
            } else {
                // If switching from clothing back to regular, delete clothes & detach sizes
                if ($product->clothes) {
                    $product->clothes->sizes()->detach();
                    $product->clothes()->delete();
                }
            }

            DB::commit();

            return response()->json(['success' => true, 'data' => $product->fresh('clothes.sizes')]);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Product update failed: " . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Erreur lors de la mise à jour du produit'], 500);
        }
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        // // Delete the image if it exists
        // if ($product->image && Storage::disk('public')->exists($product->image)) {
        //     Storage::disk('public')->delete($product->image);
        // }

        $product->delete();

        return response()->json(['success' => true, 'message' => 'Product deleted successfully']);
    }

}
