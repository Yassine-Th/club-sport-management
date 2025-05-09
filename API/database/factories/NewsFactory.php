<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\News>
 */
class NewsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'author_id' => \App\Models\User::factory()->create()->id,
            'title' => $this->faker->sentence(),
            'content' => $this->faker->paragraph(),
            'image' => 'images/husa.png',
            'category' => $this->faker->randomElement(['match', 'transfer', 'club', 'other']),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
