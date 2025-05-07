<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class PlayerController extends Controller
{
    public function index(){
        $players = Player::with(['matchStats.goals.assister',"goals"])->get();
        return response()->json($players);
    }
    public function show($id){
        $player = Player::with(['matchStats.goals.assister',"goals"])->find($id);
        if (!$player) {
            return response()->json(['message' => 'Player not found'], 404);
        }
        $totalGoals = $player->matchStats->sum('goals_count');
        $totalAssists = $player->matchStats->sum('assists_count');
        $totalYellowCards = $player->matchStats->sum('yellow_cards');
        $totalRedCards = $player->matchStats->sum('red_cards');
        $player->totalGoals = $totalGoals;
        $player->totalAssists = $totalAssists;
        $player->totalYellowCards = $totalYellowCards;
        $player->totalRedCards = $totalRedCards;
        return response()->json($player);
    }
    public function store(Request $request){
        $player = Player::create($request->all());
        return response()->json($player, 201);
    }
    public function update(Request $request, $id){
        $player = Player::find($id);
        if (!$player) {
            return response()->json(['message' => 'Player not found'], 404);
        }
        $player->update($request->all());
        return response()->json($player);
    }
    public function destroy($id){
        $player = Player::find($id);
        if (!$player) {
            return response()->json(['message' => 'Player not found'], 404);
        }
        $player->delete();
        return response()->json(['message' => 'Player deleted successfully']);
    }
}
