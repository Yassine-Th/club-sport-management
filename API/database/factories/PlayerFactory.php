<?php

namespace Database\Factories;

use App\Models\MyClub;
use App\Models\Player;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class PlayerFactory extends Factory
{
    protected $model = Player::class;

    public function definition()
    {
        return [
            'my_club_id' => MyClub::inRandomOrder()->first()->id,
            'name' => $this->faker->name(),
            'position' => $this->faker->randomElement(['Forward', 'Midfielder', 'Defender', 'Goalkeeper']),
            'number' => $this->faker->numberBetween(1, 99),
            "foot" => $this->faker->randomElement(['Left', 'Right']),
            'height' => $this->faker->numberBetween(150, 200), // Height in cm
            'weight' => $this->faker->numberBetween(50, 100), // Weight in kg
            'birth_date' => $this->faker->dateTimeBetween('-40 years', '-18 years'), 
            'nationality' => $this->faker->country(),
            'photo' => 'images/player.webp',
        ];
    }
}
