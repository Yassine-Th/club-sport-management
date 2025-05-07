<?php

namespace Database\Factories;

use App\Models\MyPlayerMatchStat;
use App\Models\Player;
use App\Models\PlayerMatchGoal;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlayerMatchGoal>
 */
class PlayerMatchGoalFactory extends Factory
{
    protected $model = PlayerMatchGoal::class;

    public function definition()
    {
        return [
            'player_match_stat_id' => MyPlayerMatchStat::inRandomOrder()->first()->id,
            'minute' => $this->faker->numberBetween(1, 90),
            'assist_player_id' => $this->faker->boolean(70) ? Player::inRandomOrder()->first()->id : null,
        ];
    }
}
