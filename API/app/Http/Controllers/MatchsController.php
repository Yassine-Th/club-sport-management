<?php

namespace App\Http\Controllers;

use App\Models\Matches;
use Illuminate\Http\Request;

class MatchsController extends Controller
{
    public function index()
    {
        // Fetch all matches
        $matches = Matches::with(['tickets'])->get();
        if ($matches->isEmpty()) {
            return response()->json(['message' => 'No matches found'], 404);
        }
        return response()->json($matches);
    }

    public function show($id)
    {
        // Fetch a specific match by ID
        $match = Matches::with(['tickets'])->find($id);
        if (!$match) {
            return response()->json(['message' => 'Match not found'], 404);
        }
        return response()->json($match);
    }
    public function UpCommingMatches()
    {
        // 1) Pull only the matches you care about, and only the columns you need
        $matches = Matches::where('match_date', '>=', now())
            ->where('is_home', 1)
            ->whereDoesntHave('tickets')
            ->select('id', 'my_club_id', 'opponent_club_id', 'match_date')
            ->with([
                'myClub:id,name',      // only id & name on MyClub
                'opponent:id,name',    // only id & name on Club (opponent)
            ])
            ->get();

        if ($matches->isEmpty()) {
            return response()->json(['message' => 'No matches found'], 404);
        }

        // 2) Map each Match into exactly the three fields
        $result = $matches->map(function ($m) {
            return [
                'id'                 => $m->id,
                'my_club_name'       => $m->myClub->name,
                'opponent_club_name' => $m->opponent->name,
                'match_date'         => $m->match_date,
            ];
        });

        return response()->json($result);
    }
    public function showEditMatches()
    {
        $matches = Matches::where('match_date', '>=', now())
            ->where('is_home', 1)
            ->select('id', 'my_club_id', 'opponent_club_id', 'match_date')
            ->with([
                'myClub:id,name',      // only id & name on MyClub
                'opponent:id,name',    // only id & name on Club (opponent)
            ])
            ->get();

        if ($matches->isEmpty()) {
            return response()->json(['message' => 'No matches found'], 404);
        }

        // 2) Map each Match into exactly the three fields
        $result = $matches->map(function ($m) {
            return [
                'id'                 => $m->id,
                'my_club_name'       => $m->myClub->name,
                'opponent_club_name' => $m->opponent->name,
                'match_date'         => $m->match_date,
            ];
        });

        return response()->json($result);
    }
}
