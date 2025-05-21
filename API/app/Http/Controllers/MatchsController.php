<?php

namespace App\Http\Controllers;

use App\Models\Matches;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MatchsController extends Controller
{
    public function index()
    {
        $matches = Matches::with(['myclub', 'opponent'])->get();
        return response()->json([
            'message' => 'matchs fetched successfully',
            'matches' => $matches,
        ])->setStatusCode(200);
    }


    public function show($id){
        $match = Matches::with('myclub', 'opponent')->findOrFail($id);

        return response()->json([
            'match' => $match,
            'message' => 'matche fetched successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'my_club_id' => 'required|exists:my_club,id',
            'opponent_club_id' => 'required|exists:clubs,id',
            'match_date' => 'nullable|date',
            'match_location' => 'nullable|string|max:255',
            'is_home' => 'required|boolean',
            'my_club_goals' => 'nullable|integer|min:0',
            'opponent_club_goals' => 'nullable|integer|min:0',
            'journée' => 'required|integer|min:1|unique:matches,journée',
            'aller_retour' => 'nullable|in:aller,retour',
            'status' => 'nullable|in:venir,terminée,reportée', 
        ]);

        Matches::create([
            'my_club_id' => $validatedData['my_club_id'],
            'opponent_club_id' => $validatedData['opponent_club_id'],
            'match_date' => $validatedData['match_date'],
            'match_location' => $validatedData['match_location'],
            'is_home' => $validatedData['is_home'],
            'my_club_goals' => $validatedData['my_club_goals'],
            'opponent_club_goals' => $validatedData['opponent_club_goals'],
            'journée' => $validatedData['journée'],
            'aller_retour' => $validatedData['aller_retour'],
            'status' => $validatedData['status'],

        ]);

        return response()->json([
            'message' => 'match created successfully',
        ])->setStatusCode(201);
    }

    public function destroy($id)
    {
        $match = Matches::findOrFail($id);

       
        // Supprimer la news
        $match->delete();
        
        return response()->json([
            'message' => 'match deleted successfully',
        ], 200);
    }

    public function edit($id)
    {
        $match = Matches::findOrFail($id);
        return response()->json([
            'message' => 'match fetched successfully',
            'match' => $match,
        ])->setStatusCode(200);
    }


  public function update(Request $request, $id)
{
    $validatedData = $request->validate([
            'my_club_id' => 'required|exists:my_club,id',
            'opponent_club_id' => 'required|exists:clubs,id',
            'match_date' => 'nullable|date',
            'match_location' => 'nullable|string|max:255',
            'is_home' => 'required|boolean',
            'my_club_goals' => 'nullable|integer|min:0',
            'opponent_club_goals' => 'nullable|integer|min:0',
            'journée' => 'required|integer|min:1',
            'aller_retour' => 'nullable|in:aller,retour',
            'status' => 'nullable|in:venir,terminée,reportée', 
    ]);

    $match = Matches::find($id);

    if (!$match) {
        return response()->json([
            'message' => 'match  not found.'
        ], 404);
    }

    // تحديث الحقول
    $match->my_club_id = $validatedData['my_club_id'];
    $match->opponent_club_id = $validatedData['opponent_club_id'];
    $match->match_date = $validatedData['match_date'];
    $match->match_location = $validatedData['match_location'];
    $match->is_home = $validatedData['is_home'];
    $match->my_club_goals = $validatedData['my_club_goals'];
    $match->opponent_club_goals = $validatedData['opponent_club_goals'];
    $match->journée = $validatedData['journée'];
    $match->aller_retour = $validatedData['aller_retour'];
    $match->status = $validatedData['status'];

    $match->save();

    return response()->json([
        'message' => 'match modifier success',
        'match' => $match
    ], 200);
}
}
