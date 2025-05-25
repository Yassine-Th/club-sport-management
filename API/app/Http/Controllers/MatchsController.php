<?php

namespace App\Http\Controllers;

use App\Models\Matches;
use App\Models\MyPlayerMatchStat;
use App\Models\PlayerMatchGoal;
use App\Models\Player; // Ensure Player model is imported
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
// use Illuminate\Support\Facades\Validator; // Not strictly needed as $request->validate() is used
use Illuminate\Validation\Rule;

class MatchsController extends Controller
{
    /**
     * Display a listing of the matches.
     */
    public function index()
    {
        $matches = Matches::with(['myClub', 'opponent'])
            ->orderBy('match_date', 'desc')
            ->orderBy('id', 'desc') // Secondary sort for consistent ordering
            ->get();

        return response()->json([
            'message' => 'Matches fetched successfully.',
            'matches' => $matches,
        ]);
    }

    /**
     * Display the specified match.
     */
    public function show($id)
    {
        $match = Matches::with([
            'myClub',
            'opponent',
            'playerStats.player', // Player who made the stat (scorer)
            'playerStats.goals.assister' // For each goal scored by that player, get the assister (Player model)
        ])->findOrFail($id);

        // Optionally, prepare a more structured goal list if needed for the view
        // $detailedGoalEvents = [];
        // if ($this->isMatchScoreable($match->match_date, $match->status)) {
        //     // This would require iterating through playerStats and their goals
        // }

        return response()->json([
            'match' => $match,
            'message' => 'Match fetched successfully.'
        ]);
    }

    /**
     * Fetch upcoming matches for a specific purpose (e.g., ticket sales).
     */
    public function UpCommingMatches()
    {
        $matches = Matches::where('status', 'venir') // More direct way to get upcoming
            // ->where('match_date', '>=', now()) // This is also fine
            ->select('id', 'my_club_id', 'opponent_club_id', 'match_date', 'status', 'is_home', 'journée')
            ->with(['myClub:id,name', 'opponent:id,name'])
            ->orderBy('match_date', 'asc')
            ->get();

        if ($matches->isEmpty()) {
            return response()->json(['message' => 'No upcoming matches found.'], 404);
        }

        // Using the Match model's 'summary' accessor if it exists and is suitable,
        // or manual mapping.
        $result = $matches->map(function ($m) {
            return [
                'id'                 => $m->id,
                'my_club_name'       => $m->myClub->name ?? 'N/A',
                'opponent_club_name' => $m->opponent->name ?? 'N/A',
                'match_date'         => $m->match_date,
                'status'             => $m->status,
                'is_home'            => $m->is_home,
                'journée'            => $m->journée,
                // Consider adding $m->summary attribute if defined on model and useful
            ];
        });

        return response()->json($result);
    }

    /**
     * Fetch data for editing a specific match.
     * Prepares match data including goal details AND card events for the frontend form.
     */
    public function edit($id)
    {
        $match = Matches::with([
            'myClub',
            'opponent',
            'playerStats.player',
            'playerStats.goals.assister'
        ])->findOrFail($id);

        $preparedMyClubGoalDetails = [];
        $preparedCardEvents = [];
        $isScoreable = $this->isMatchScoreable($match->match_date, $match->status);

        if ($isScoreable) {
            $playerAttributedGoals = 0;
            foreach ($match->playerStats as $stat) {
                if ($stat->player) {
                    foreach ($stat->goals as $goal) {
                        $preparedMyClubGoalDetails[] = [
                            'scorer_id' => $stat->player_id,
                            'assister_id' => $goal->assist_player_id,
                            'minute' => $goal->minute,
                        ];
                        $playerAttributedGoals++;
                    }
                    // Card events
                    if ($stat->yellow_cards > 0) {
                        for ($i = 0; $i < $stat->yellow_cards; $i++) {
                            $preparedCardEvents[] = ['player_id' => $stat->player_id, 'card_type' => 'yellow'];
                        }
                    }
                    if ($stat->red_cards > 0) {
                        $preparedCardEvents[] = ['player_id' => $stat->player_id, 'card_type' => 'red'];
                    }
                }
            }
            $totalMyClubGoals = (int)($match->my_club_goals ?? 0);
            if ($totalMyClubGoals > $playerAttributedGoals) {
                for ($i = 0; $i < ($totalMyClubGoals - $playerAttributedGoals); $i++) {
                    $preparedMyClubGoalDetails[] = ['scorer_id' => 'own_goal', 'assister_id' => null, 'minute' => ''];
                }
            }
            if ($totalMyClubGoals > count($preparedMyClubGoalDetails)) {
                for ($i = 0; $i < ($totalMyClubGoals - count($preparedMyClubGoalDetails)); $i++) {
                    $preparedMyClubGoalDetails[] = ['scorer_id' => '', 'assister_id' => '', 'minute' => ''];
                }
            }
        }

        $matchData = $match->toArray();
        $matchData['my_club_goal_details'] = $preparedMyClubGoalDetails;
        $matchData['card_events'] = $preparedCardEvents;

        return response()->json([
            'message' => 'Match data fetched successfully for editing.',
            'match' => $matchData,
        ]);
    }

    /**
     * Store a newly created match in storage.
     */
    public function store(Request $request)
    {
        $isScoreable = $this->isMatchScoreable($request->input('match_date'), $request->input('status'));
        $this->prepareMatchEventArraysForValidation($request, $isScoreable);

        $rules = $this->getValidationRules(null, $request->input('my_club_id'), $isScoreable, $request);
        $validatedData = $request->validate($rules);

        $goalDetailsInput = $validatedData['my_club_goal_details_array'] ?? [];
        $cardEventsInput = $validatedData['card_events_array'] ?? [];

        $match = null;
        DB::transaction(function () use ($validatedData, $goalDetailsInput, $cardEventsInput, $isScoreable, &$match) {
            $matchDataToCreate = [
                'my_club_id' => $validatedData['my_club_id'],
                'opponent_club_id' => $validatedData['opponent_club_id'],
                'match_date' => $validatedData['match_date'] ?? null,
                'match_location' => $validatedData['match_location'] ?? null,
                'is_home' => $validatedData['is_home'],
                'journée' => $validatedData['journée'],
                'aller_retour' => $validatedData['aller_retour'] ?? null,
                'status' => $validatedData['status'] ?? 'venir',
            ];

            if ($isScoreable) {
                $matchDataToCreate['my_club_goals'] = $validatedData['my_club_goals'] ?? 0;
                $matchDataToCreate['opponent_club_goals'] = $validatedData['opponent_club_goals'] ?? 0;
            } else {
                $matchDataToCreate['my_club_goals'] = null;
                $matchDataToCreate['opponent_club_goals'] = null;
            }

            $match = Matches::create($matchDataToCreate);

            if ($isScoreable) {
                $this->processMatchEvents($match, $goalDetailsInput, $cardEventsInput);
            }
        });

        return response()->json([
            'message' => 'Match created successfully.',
            'match' => $match
        ], 201);
    }

    /**
     * Update the specified match in storage.
     */
    public function update(Request $request, $id)
    {
        $matchToUpdate = Matches::findOrFail($id);
        $isScoreable = $this->isMatchScoreable($request->input('match_date'), $request->input('status'));
        $this->prepareMatchEventArraysForValidation($request, $isScoreable);

        $rules = $this->getValidationRules($id, $request->input('my_club_id'), $isScoreable, $request);
        $validatedData = $request->validate($rules);

        $goalDetailsInput = $validatedData['my_club_goal_details_array'] ?? [];
        $cardEventsInput = $validatedData['card_events_array'] ?? [];

        DB::transaction(function () use ($matchToUpdate, $validatedData, $goalDetailsInput, $cardEventsInput, $isScoreable) {
            $dataToUpdate = [
                'my_club_id' => $validatedData['my_club_id'],
                'opponent_club_id' => $validatedData['opponent_club_id'],
                'match_date' => $validatedData['match_date'] ?? null,
                'match_location' => $validatedData['match_location'] ?? null,
                'is_home' => $validatedData['is_home'],
                'journée' => $validatedData['journée'],
                'aller_retour' => $validatedData['aller_retour'] ?? null,
                'status' => $validatedData['status'] ?? 'venir',
            ];

            if ($isScoreable) {
                $dataToUpdate['my_club_goals'] = $validatedData['my_club_goals'] ?? 0;
                $dataToUpdate['opponent_club_goals'] = $validatedData['opponent_club_goals'] ?? 0;
            } else {
                $dataToUpdate['my_club_goals'] = null;
                $dataToUpdate['opponent_club_goals'] = null;
            }
            $matchToUpdate->update($dataToUpdate);

            MyPlayerMatchStat::where('matches_id', $matchToUpdate->id)->each(function ($stat) {
                $stat->goals()->delete();
                $stat->delete();
            });

            if ($isScoreable) {
                $this->processMatchEvents($matchToUpdate, $goalDetailsInput, $cardEventsInput);
            }
        });

        return response()->json([
            'message' => 'Match updated successfully.',
            'match' => $matchToUpdate->fresh()
        ], 200);
    }

    /**
     * Prepares 'my_club_goal_details_array' and 'card_events_array' in the request for validation.
     */
    private function prepareMatchEventArraysForValidation(Request $request, bool $isScoreable): void
    {
        if (!$isScoreable) {
            if ($request->has('my_club_goal_details')) {
                $request->merge(['my_club_goal_details_array' => []]);
            }
            if ($request->has('card_events')) {
                $request->merge(['card_events_array' => []]);
            }
            return;
        }

        $goalDetailsArray = [];
        if ($request->has('my_club_goal_details') && $request->filled('my_club_goal_details')) {
            $decodedGoals = json_decode($request->input('my_club_goal_details'), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decodedGoals)) {
                $goalDetailsArray = $decodedGoals;
            }
        }
        $request->merge(['my_club_goal_details_array' => $goalDetailsArray]);

        $cardEventsArray = [];
        if ($request->has('card_events') && $request->filled('card_events')) {
            $decodedCards = json_decode($request->input('card_events'), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decodedCards)) {
                $cardEventsArray = $decodedCards;
            }
        }
        $request->merge(['card_events_array' => $cardEventsArray]);
    }

    /**
     * Get the validation rules for storing/updating a match.
     */
    private function getValidationRules($matchId = null, $myClubId, bool $isScoreable, Request $request): array
    {
        $rules = [
            'my_club_id' => 'required|exists:my_club,id',
            'opponent_club_id' => 'required|exists:clubs,id',
            'match_date' => 'nullable|date_format:Y-m-d\TH:i',
            'match_location' => 'nullable|string|max:255',
            'is_home' => 'required|boolean',
            'journée' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('matches', 'journée')
                    ->where('my_club_id', $myClubId)
                    ->when($matchId, function ($query) use ($matchId) {
                        return $query->ignore($matchId);
                    })
            ],
            'aller_retour' => 'nullable|in:aller,retour',
            'status' => 'required|in:venir,terminée,reportée',
        ];

        if ($isScoreable) {
            $rules['my_club_goals'] = 'required|integer|min:0';
            $rules['opponent_club_goals'] = 'required|integer|min:0';

            // Goal Details Validation
            $rules['my_club_goal_details'] = 'nullable|json';
            if ($request->has('my_club_goal_details_array')) {
                $numGoalsFromInput = (int)($request->input('my_club_goals') ?? 0);
                $goalDetailsArrayActual = $request->input('my_club_goal_details_array');

                if ($numGoalsFromInput > 0) {
                    $rules['my_club_goal_details_array'] = 'required|array|size:' . $numGoalsFromInput;
                    if (!empty($goalDetailsArrayActual)) {
                        $rules['my_club_goal_details_array.*.scorer_id'] = ['required', function ($attribute, $value, $fail) use ($myClubId, $request) {
                            if ($value !== 'own_goal' && !Player::where('id', $value)->where('my_club_id', $myClubId)->exists()) {
                                $fail(str_replace('my_club_goal_details_array.', 'my_club_goal_details.', $attribute) . ' est invalide ou n\'appartient pas à votre club.');
                            }
                        }];
                        $rules['my_club_goal_details_array.*.assister_id'] = ['nullable', function ($attribute, $value, $fail) use ($myClubId, $request) {
                            if ($value && !Player::where('id', $value)->where('my_club_id', $myClubId)->exists()) {
                                $fail(str_replace('my_club_goal_details_array.', 'my_club_goal_details.', $attribute) . ' est invalide ou n\'appartient pas à votre club.');
                            }
                            $parts = explode('.', $attribute);
                            $index = $parts[1];
                            $scorerValue = $request->input("my_club_goal_details_array.{$index}.scorer_id");
                            if ($value && $scorerValue !== 'own_goal' && $value === $scorerValue) {
                                $fail(str_replace('my_club_goal_details_array.', 'my_club_goal_details.', $attribute) . ' ne peut pas être le même que le buteur.');
                            }
                        }];
                        $rules['my_club_goal_details_array.*.minute'] = 'required|integer|min:1|max:150';
                    }
                } elseif ($numGoalsFromInput === 0) {
                    $rules['my_club_goal_details_array'] = 'array|size:0';
                }
            }

            // Card Events Validation
            $rules['card_events'] = 'nullable|json';
            if ($request->has('card_events_array')) {
                $cardEventsArrayActual = $request->input('card_events_array');
                $rules['card_events_array'] = 'array';
                if (!empty($cardEventsArrayActual)) {
                    $rules['card_events_array.*.player_id'] = [
                        'required',
                        Rule::exists('players', 'id')->where(fn($query) => $query->where('my_club_id', $myClubId)),
                    ];
                    $rules['card_events_array.*.card_type'] = 'required|in:yellow,red';
                }
            }
        }
        return $rules;
    }

    /**
     * Helper to process goals and card events.
     */
    private function processMatchEvents(Matches $match, array $goalDetailsInput, array $cardEventsInput): void
    {
        $playerStatsCache = [];

        $getPlayerStat = function ($playerId) use ($match, &$playerStatsCache) {
            if (!isset($playerStatsCache[$playerId])) {
                $playerStatsCache[$playerId] = MyPlayerMatchStat::firstOrCreate(
                    ['matches_id' => $match->id, 'player_id' => $playerId],
                    ['goals_count' => 0, 'assists_count' => 0, 'yellow_cards' => 0, 'red_cards' => 0]
                );
            }
            return $playerStatsCache[$playerId];
        };

        // Process Goals
        $actualMyClubGoalsCount = 0;
        foreach ($goalDetailsInput as $detail) {
            if (empty($detail['scorer_id']) || !isset($detail['minute']) || $detail['minute'] === '') continue;

            $scorerPlayerId = ($detail['scorer_id'] !== 'own_goal') ? $detail['scorer_id'] : null;
            $assisterPlayerId = ($scorerPlayerId && !empty($detail['assister_id'])) ? $detail['assister_id'] : null;
            if ($scorerPlayerId && $assisterPlayerId && $scorerPlayerId === $assisterPlayerId) $assisterPlayerId = null;

            PlayerMatchGoal::create([
                'player_match_stat_id' => $scorerPlayerId ? $getPlayerStat($scorerPlayerId)->id : null,
                'minute' => $detail['minute'],
                'assist_player_id' => $assisterPlayerId,
            ]);
            $actualMyClubGoalsCount++;

            if ($scorerPlayerId) $getPlayerStat($scorerPlayerId)->increment('goals_count');
            if ($assisterPlayerId) $getPlayerStat($assisterPlayerId)->increment('assists_count');
        }
        if ($match->my_club_goals != $actualMyClubGoalsCount) {
            $match->my_club_goals = $actualMyClubGoalsCount;
        }

        // Process Cards
        $playerCardAggregates = [];
        foreach ($cardEventsInput as $event) {
            if (empty($event['player_id']) || empty($event['card_type'])) continue;
            $playerId = $event['player_id'];
            $cardType = $event['card_type'];

            if (!isset($playerCardAggregates[$playerId])) {
                $playerCardAggregates[$playerId] = ['yellow' => 0, 'red' => 0];
            }
            if ($cardType === 'yellow') $playerCardAggregates[$playerId]['yellow']++;
            if ($cardType === 'red') $playerCardAggregates[$playerId]['red'] = 1;
        }

        foreach ($playerCardAggregates as $playerId => $cards) {
            $stat = $getPlayerStat($playerId);
            $stat->yellow_cards = 0;
            $stat->red_cards = 0;

            if ($cards['red'] === 1) {
                $stat->red_cards = 1;
                $stat->yellow_cards = ($cards['yellow'] >= 2) ? 2 : $cards['yellow'];
            } else if ($cards['yellow'] >= 2) {
                $stat->red_cards = 1;
                $stat->yellow_cards = 2;
            } else {
                $stat->yellow_cards = $cards['yellow'];
            }
        }

        foreach ($playerStatsCache as $stat) {
            if ($stat->isDirty()) $stat->save();
        }
        if ($match->isDirty()) $match->save();
    }

    /**
     * Remove the specified match from storage.
     */
    public function destroy($id)
    {
        $match = Matches::findOrFail($id);

        DB::transaction(function () use ($match) {
            MyPlayerMatchStat::where('matches_id', $match->id)->each(function ($stat) {
                $stat->goals()->delete();
                $stat->delete();
            });
            // If PlayerMatchGoal has 'matches_id' for own goals:
            // PlayerMatchGoal::where('matches_id', $match->id)->whereNull('player_match_stat_id')->delete();
            $match->delete();
        });

        return response()->json([
            'message' => 'Match deleted successfully.'
        ], 200);
    }

    /**
     * Helper function to determine if a match is scoreable (past date or 'terminée' status).
     */
    private function isMatchScoreable($matchDateInput, $statusInput): bool
    {
        if ($statusInput === 'terminée') {
            return true;
        }
        if ($matchDateInput) {
            try {
                // Ensure the date is parsed correctly, especially if it's already a Carbon instance or DateTime
                $matchDate = ($matchDateInput instanceof \DateTimeInterface)
                    ? $matchDateInput
                    : new \DateTime($matchDateInput);
                $now = new \DateTime();
                return $matchDate < $now;
            } catch (\Exception $e) {
                // Invalid date format passed
                return false;
            }
        }
        return false; // If no date and status isn't 'terminée'
    }

    /**
     * Prepares the 'my_club_goal_details_array' in the request for validation.
     */
    private function prepareGoalDetailsArrayForValidation(Request $request, bool $isScoreable): void
    {
        if (!$isScoreable) {
            // If not scoreable, we don't expect goal details, so no merge needed for array validation
            // Or ensure it's not present if strict validation will check for its absence.
            // For now, we only merge if scoreable and details might be present.
            return;
        }

        $goalDetailsArray = [];
        if ($request->has('my_club_goal_details') && $request->filled('my_club_goal_details')) {
            $decoded = json_decode($request->input('my_club_goal_details'), true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $goalDetailsArray = $decoded;
            } else {
                // If JSON is malformed, this will be caught by the 'json' rule on 'my_club_goal_details'
                // or we can throw an error here if preferred. For now, let main validation handle it.
                // This function's job is to prepare the array if JSON is valid.
            }
        }
        // Always merge my_club_goal_details_array if scoreable.
        // If original JSON was empty or not sent, $goalDetailsArray will be empty.
        $request->merge(['my_club_goal_details_array' => $goalDetailsArray]);
    }


    /**
     * Get the validation rules for storing/updating a match.
     */
 

    /**
     * Helper function to process and save goal details associated with a match.
     */
    private function processGoalDetails(Matches $match, array $goalDetailsInput): void
    {
        $actualMyClubGoalsCount = 0;

        foreach ($goalDetailsInput as $detail) {
            // Basic check for required fields in a detail entry
            if (empty($detail['scorer_id']) || !isset($detail['minute']) || $detail['minute'] === '') {
                continue; // Skip incomplete detail entries
            }

            $scorerPlayerId = ($detail['scorer_id'] !== 'own_goal') ? $detail['scorer_id'] : null;
            $assisterPlayerId = ($scorerPlayerId && !empty($detail['assister_id'])) ? $detail['assister_id'] : null;

            // Prevent self-assist (already validated, but good to have defense here)
            if ($scorerPlayerId && $assisterPlayerId && $scorerPlayerId === $assisterPlayerId) {
                $assisterPlayerId = null;
            }

            $playerStatScorer = null;
            if ($scorerPlayerId) {
                $playerStatScorer = MyPlayerMatchStat::firstOrCreate(
                    ['matches_id' => $match->id, 'player_id' => $scorerPlayerId],
                    ['goals_count' => 0, 'assists_count' => 0, 'yellow_cards' => 0, 'red_cards' => 0] // Defaults
                );
                $playerStatScorer->increment('goals_count');
            }

            PlayerMatchGoal::create([
                'player_match_stat_id' => $playerStatScorer ? $playerStatScorer->id : null, // Null for opponent own goal
                'minute' => $detail['minute'],
                'assist_player_id' => $assisterPlayerId, // This is players.id
                // 'matches_id' => $match->id, // Add this if you modify PlayerMatchGoal table
            ]);
            $actualMyClubGoalsCount++;

            if ($assisterPlayerId) {
                $playerStatAssister = MyPlayerMatchStat::firstOrCreate(
                    ['matches_id' => $match->id, 'player_id' => $assisterPlayerId],
                    ['goals_count' => 0, 'assists_count' => 0, 'yellow_cards' => 0, 'red_cards' => 0]
                );
                $playerStatAssister->increment('assists_count');
            }
        }

        // Ensure the main match's goal count reflects the actually processed valid details
        if ($match->my_club_goals != $actualMyClubGoalsCount) {
            $match->my_club_goals = $actualMyClubGoalsCount;
            $match->save();
        }
    }
}
