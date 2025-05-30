<?php

namespace App\Http\Controllers;

use App\Models\Club;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ClubController extends Controller
{
     public function index(){
        $clubs = Club::all();

        return response()->json([
            'message' => 'clubs get success',
            'clubs' => $clubs
        ]);
    }

     public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'founded' => 'required|digits:4|integer|min:1800|max:' . date('Y'), 
            'coach_name' => 'required|string|max:255',
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        Club::create([
            'name' => $validatedData['name'],
            'founded' => $validatedData['founded'],
            'coach_name' => $validatedData['coach_name'],
            'logo' => $request->hasFile('logo') ? $request->file('logo')->store('images', 'public') : null,
        ]);

        return response()->json([
            'message' => 'club created successfully',
        ])->setStatusCode(201);
    }


     public function edit($id)
{
    $club = Club::findOrFail($id);
    return response()->json([
        'club' => $club,
        'message' => 'club fetched successfully'
    ]);
}

public function update(Request $request, $id)
{
    $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'founded' => 'required|digits:4|integer|min:1800|max:' . date('Y'), 
            'coach_name' => 'required|string|max:255',
            'logo' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $club = Club::find($id);

    if (!$club) {
        return response()->json([
            'message' => 'club  not found.'
        ], 404);
    }

    // تحديث الحقول
    $club->name = $validatedData['name'];
    $club->founded = $validatedData['founded'];
    $club->coach_name = $validatedData['coach_name']; 
   


    if ($request->hasFile('logo')) {
    //    if ($club->logo && Storage::disk('public')->exists($club->logo)) {
    //         Storage::disk('public')->delete($club->logo);
    //     }
        // رفع الصورة الجديدة
        $club->logo =  $request->hasFile('logo') ? $request->file('logo')->store('images', 'public') : null;

    }

    $club->save();

    return response()->json([
        'message' => 'club modifier success',
        'club' => $club
    ], 200);
}



public function destroy($id)
{
    try {
        $club = Club::findOrFail($id);

        if ($club->logo && Storage::disk('public')->exists($club->logo)) {
            Storage::disk('public')->delete($club->logo);
        }

        $club->delete();

        return response()->json([
            'message' => 'club deleted successfully',
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Erreur lors de la suppression',
            'message' => $e->getMessage(),
        ], 500);
    }
}
}
