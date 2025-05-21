<?php

namespace App\Http\Controllers;

use App\Models\Player;
use Illuminate\Http\Request;

class UserPlayersController extends Controller
{
    public function index(Request $request)
{
    $position = $request->query('position');

    $query = Player::query();

    if ($position) {
        $query->where('position', $position);
    }

    $players = $query->get();
    $allPosts = Player::select('position')->distinct()->pluck('position');

    return response()->json([
        'message' => 'Players retrieved successfully',
        'players' => $players,
        'allPosts' => $allPosts
    ]);
}

public function show($id)
{
    $player = Player::with([
        'matchStats.goals',
    ])->findOrFail($id);

    // حساب الإحصائيات الكلية
    $goals = 0;
    $assists = 0;
    $yellowCards = 0;
    $redCards = 0;

    foreach ($player->matchStats as $stat) {
        $goals += $stat->goals_count;
        $assists += $stat->assists_count;
        $yellowCards += $stat->yellow_cards;
        $redCards += $stat->red_cards;
    }

    // دمج الإحصائيات في كائن اللاعب
    $player->total_goals = $goals;
    $player->total_assists = $assists;
    $player->total_yellow_cards = $yellowCards;
    $player->total_red_cards = $redCards;

    return response()->json($player);
}

}
