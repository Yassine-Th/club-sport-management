<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Club>
 */
class ClubFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(), // Generate a random club name
            'logo' => 'images/club.jpg', // Generate a random logo URL
            'founded' => $this->faker->year(), // Generate a random founding year
            'coach_name' => $this->faker->name(), // Generate a random coach name
        ];
    }
}
