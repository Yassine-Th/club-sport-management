<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MyPlayerMatchStat>
 */
class MyPlayerMatchStatFactory extends Factory
{
    public function definition()
    {
        return [
            'match_id' => \App\Models\tabler::inRandomOrder()->value('id'),
            'player_id' => \App\Models\Player::inRandomOrder()->value('id'),
            'goals_count' => $this->faker->numberBetween(0, 5),
            'assists_count' => $this->faker->numberBetween(0, 5),
            'yellow_cards' => $this->faker->numberBetween(0, 2),
            'red_cards' => $this->faker->numberBetween(0, 1),
        ];
    }
}
