<?php

namespace App\Http\Controllers;

use App\Models\MyPlayerMatchStat;
use App\Models\PlayerMatchGoal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class MyPlayerMatchStatController extends Controller
{
  
public function store(Request $request)
{
    $data = $request->all();
    $allErrors = [];

    foreach ($data as $index => $item) {
        $validator = Validator::make($item, [
            'match_id' => 'required|exists:matches,id',
            'player_id' => 'required|exists:players,id',
            'goals_count' => 'nullable|integer|min:0',
            'assists_count' => 'nullable|integer|min:0',
            'yellow_cards' => 'nullable|integer|min:0',
            'red_cards' => 'nullable|integer|min:0',
            'goals' => 'nullable|array',
            'goals.*.minute' => 'required|integer|min:1|max:130',
            'goals.*.assist_player' => 'nullable|exists:players,id',
        ]);

        $validator->after(function ($validator) use ($item) {
            // تحقق من ترتيب الدقائق
            if (!empty($item['goals'])) {
                $minutes = array_map(fn($goal) => (int) $goal['minute'], $item['goals']);
                $sorted = $minutes;
                sort($sorted);
                if ($minutes !== $sorted) {
                    $validator->errors()->add('goals', 'Erreur dans les minutes saisies');
                }

                // تحقق من عدد الأهداف المتطابق
                if (isset($item['goals_count']) && count($item['goals']) > $item['goals_count']) {
                    $validator->errors()->add('goals_count_mismatch', '[E003] Le nombre total de buts est inférieur au nombre de buts détaillés.');
                }
            }

            // تحقق من عدم تكرار اللاعب في نفس المباراة
            $exists = MyPlayerMatchStat::where('matches_id', $item['match_id'])
                ->where('player_id', $item['player_id'])
                ->exists();

            if ($exists) {
                $validator->errors()->add('player_id', 'Des statistiques pour ce joueur dans ce match existent déjà.');
            }
        });

        if ($validator->fails()) {
            $allErrors[$index] = $validator->errors()->toArray();
        }
    }

    // إذا وُجدت أخطاء، أعدها كلها
    if (!empty($allErrors)) {
        return response()->json([
            'error' => 'Erreur dans les statistiques',
            'details' => $allErrors
        ], 422);
    }

    // لا توجد أخطاء: نحفظ البيانات
    DB::beginTransaction();
    try {
        foreach ($data as $item) {
            $stat = MyPlayerMatchStat::create([
                'matches_id' => $item['match_id'],
                'player_id' => $item['player_id'],
                'goals_count' => $item['goals_count'] ?? 0,
                'assists_count' => $item['assists_count'] ?? 0,
                'yellow_cards' => $item['yellow_cards'] ?? 0,
                'red_cards' => $item['red_cards'] ?? 0,
            ]);

            if (!empty($item['goals']) && is_array($item['goals'])) {
                foreach ($item['goals'] as $goal) {
                    PlayerMatchGoal::create([
                        'player_match_stat_id' => $stat->id,
                        'minute' => $goal['minute'],
                        'assist_player_id' => $goal['assist_player'] ?? null,
                    ]);
                }
            }
        }

        DB::commit();
        return response()->json(['message' => 'Statistiques enregistrées avec succès.']);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error' => 'Erreur serveur.',
            'message' => $e->getMessage()
        ], 500);
    }
}


public function showStatsForMatch($id)
{
    $stats = MyPlayerMatchStat::with([
    'player',                // لجلب معلومات اللاعب مثل الاسم والصورة
    'goals.assister'        // لجلب تفاصيل الأهداف والممررين (minute واسم اللاعب المساعد)
    ])->where('matches_id', $id)->get();

    return response()->json([
        'message' => 'stats get sucsess',
        'stats' => $stats
    ]);
}



 public function destroy($id)
    {
        $statistique = MyPlayerMatchStat::findOrFail($id);

       
        // Supprimer la news
        $statistique->delete();
        
        return response()->json([
            'message' => 'statistique deleted successfully',
        ], 200);
    }


}
