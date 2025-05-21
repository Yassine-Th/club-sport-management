<?php

namespace App\Http\Controllers;

use App\Models\Matches;
use App\Models\News;
use App\Models\Player;
use Illuminate\Http\Request;

class HomeController extends Controller
{
  public function index() {
    $latestNews = News::orderBy('id', 'desc')->take(3)->get();
    $latestPlayers = Player::orderBy('id', 'desc')->take(4)->get();

    $match = Matches::with(['myclub', 'opponent']) 
                    ->where('status', 'venir')
                    ->orderBy('match_date')
                    ->first();

    if (!$match) {
        $lastFinished = Matches::orderByDesc('id')
                               ->where('status', 'terminée')
                               ->first();

        if ($lastFinished) {
            $match = Matches::with(['myclub', 'opponent'])
                            ->where('id', '>', $lastFinished->id)
                            ->orderBy('id')
                            ->first();
        }
    }

    return response()->json([
        'message' => 'Latest news, players, and upcoming match fetched successfully',
        'latestNews' => $latestNews,
        'latestPlayers' => $latestPlayers,
        'nextMatch' => $match, 
    ], 200);
}

}
