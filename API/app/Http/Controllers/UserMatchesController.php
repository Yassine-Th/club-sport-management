<?php

namespace App\Http\Controllers;

use App\Models\Matches;
use Illuminate\Http\Request;

class UserMatchesController extends Controller
{
    public function index(Request $request)
{
    $month = $request->query('month'); 

    $query = Matches::query();

    if ($month) {
        $query->whereMonth('match_date', $month);
    }

    $query->with(['myclub', 'opponent']);
    $matches = $query->orderBy('journée')->get();

    return response()->json([
        'matches' => $matches,
    ]);
}


public function months()
{
    $months = Matches::selectRaw('MONTH(match_date) as month ')
        ->distinct()
        ->orderBy('month')
        ->get()
        ->pluck('month');

    return response()->json($months);
}
}
