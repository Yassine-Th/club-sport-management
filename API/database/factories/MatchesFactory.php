<?php

namespace Database\Factories;

use App\Models\Club;
use App\Models\Matches;
use App\Models\tabler;
use App\Models\Matchs;
use App\Models\MyClub;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Matchs>
 */
class MatchesFactory extends Factory
{
    protected $model = Matches::class;

    public function definition()
    {
        return [
            'my_club_id' => MyClub::inRandomOrder()->first()->id,
            'opponent_club_id' => Club::inRandomOrder()->first()->id,
            'match_date' => $this->faker->dateTimeBetween('-1 year', '+1 year'),
            'my_club_goals' => $this->faker->numberBetween(0, 5),
            'opponent_club_goals' => $this->faker->numberBetween(0, 5),
            'is_home' => $this->faker->boolean(),
        ];
    }
}
