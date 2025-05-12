<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PlayerController extends Controller
{
   public function index(){
    $players = Player::all();

    return response()->json([
        'message' => 'get players Succses',
        'data' => $players
    ]);
   }

   public function destroy($id)
    {
        $player = Player::findOrFail($id);

        if ($player->photo && Storage::disk('public')->exists($player->photo)) {
            Storage::disk('public')->delete($player->photo);
        }
        
        // Supprimer la news
        $player->delete();
        
        return response()->json([
            'message' => 'player deleted successfully',
        ], 200);
    } 

     public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|in:goalkeeper,defender,midfielder,forward',
            'birth_date' => 'required|date|before:today',
            'number' => 'required|integer|min:1|max:99|unique:players,number',
            'height' => 'required|numeric|min:100|max:250',
            'weight' => 'required|numeric|min:40|max:150',
            'foot' => 'required|string|in:right,left,both',
            'nationality' => 'required|string|max:100',
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        Player::create([
            'name' => $validatedData['name'],
            'position' => $validatedData['position'],
            'birth_date' => $validatedData['birth_date'],
            'number' => $validatedData['number'],
            'height' => $validatedData['height'],
            'weight' => $validatedData['weight'],
            'foot' => $validatedData['foot'],
            'nationality' => $validatedData['nationality'],
            'photo' => $request->hasFile('photo') ? $request->file('photo')->store('images', 'public') : null,
        ]);

        return response()->json([
            'message' => 'player created successfully',
        ])->setStatusCode(201);
    }

    public function edit($id)
{
    $player = Player::findOrFail($id);
    return response()->json([
        'player' => $player,
        'message' => 'Player fetched successfully'
    ]);
}


public function update(Request $request, $id)
{
    $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'position' => 'required|string|in:goalkeeper,defender,midfielder,forward',
            'birth_date' => 'required|date|before:today',
            'number' => 'required|integer|min:1|max:99|unique:players,number,' . $id,
            'height' => 'required|numeric|min:100|max:250',
            'weight' => 'required|numeric|min:40|max:150',
            'foot' => 'required|string|in:right,left,both',
            'nationality' => 'required|string|max:100',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $player = Player::find($id);

    if (!$player) {
        return response()->json([
            'message' => 'news  not found.'
        ], 404);
    }

    // تحديث الحقول
    $player->name = $validatedData['name'];
    $player->position = $validatedData['position'];
    $player->birth_date = $validatedData['birth_date']; 
    $player->number = $validatedData['number'];
    $player->height = $validatedData['height'];
    $player->weight = $validatedData['weight'];
    $player->foot = $validatedData['foot'];
    $player->nationality = $validatedData['nationality'];


    if ($request->hasFile('photo')) {
       if ($player->photo && Storage::disk('public')->exists($player->photo)) {
            Storage::disk('public')->delete($player->photo);
        }
        // رفع الصورة الجديدة
        $player->photo =  $request->hasFile('photo') ? $request->file('photo')->store('images', 'public') : null;

    }

    $player->save();

    return response()->json([
        'message' => 'player modifier success',
        'player' => $player
    ], 200);
}

    
    

}
