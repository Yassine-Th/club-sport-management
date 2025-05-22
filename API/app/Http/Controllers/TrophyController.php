<?php

namespace App\Http\Controllers;

use App\Models\MyClub;
use App\Models\Trophy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TrophyController extends Controller
{

    public function index(){
        $trophy = Trophy::all();

        return response()->json([
            'message' => 'trophy get success',
            'trophy' => $trophy
        ]);
    }

     public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|min:3|max:100',
            'year' => 'required|digits:4|integer|min:1800|max:' . date('Y'),
            'times_won' => 'required|integer|min:1|max:1000',
            'competition' => 'required|string|min:3|max:100',
            'description' => 'required|string|min:10|max:500',
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        Trophy::create([
            "my_club_id" => MyClub::first()->id, // Assuming you have a default club ID
            'title' => $validatedData['title'],
            'year' => $validatedData['year'],
            'times_won' => $validatedData['times_won'],
            'competition' => $validatedData['competition'],
            'description' => $validatedData['description'],
            'photo' => $request->hasFile('photo') ? $request->file('photo')->store('images', 'public') : null,
        ]);

        return response()->json([
            'message' => 'Trophy created successfully',
        ])->setStatusCode(201);
    }


     public function edit($id)
{
    $trophy = Trophy::findOrFail($id);
    return response()->json([
        'trophy' => $trophy,
        'message' => 'trophy fetched successfully'
    ]);
}

public function update(Request $request, $id)
{
    $validatedData = $request->validate([
            'title' => 'required|string|min:3|max:100',
            'year' => 'required|digits:4|integer|min:1800|max:' . date('Y'),
            'times_won' => 'required|integer|min:1|max:1000',
            'competition' => 'required|string|min:3|max:100',
            'description' => 'required|string|min:10|max:500',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    $trophy = Trophy::find($id);

    if (!$trophy) {
        return response()->json([
            'message' => 'trophy  not found.'
        ], 404);
    }

    // تحديث الحقول
    $trophy->title = $validatedData['title'];
    $trophy->year = $validatedData['year'];
    $trophy->times_won = $validatedData['times_won']; 
    $trophy->competition = $validatedData['competition'];
    $trophy->description = $validatedData['description'];
   


    if ($request->hasFile('photo')) {
       if ($trophy->photo && Storage::disk('public')->exists($trophy->photo)) {
            Storage::disk('public')->delete($trophy->photo);
        }
        // رفع الصورة الجديدة
        $trophy->photo =  $request->hasFile('photo') ? $request->file('photo')->store('images', 'public') : null;

    }

    $trophy->save();

    return response()->json([
        'message' => 'trophy modifier success',
        'trophy' => $trophy
    ], 200);
}



 public function destroy($id)
    {
        $trophy = Trophy::findOrFail($id);

        if ($trophy->photo && Storage::disk('public')->exists($trophy->photo)) {
            Storage::disk('public')->delete($trophy->photo);
        }
        
        // Supprimer la news
        $trophy->delete();
        
        return response()->json([
            'message' => 'trophy deleted successfully',
        ], 200);
    } 
}
