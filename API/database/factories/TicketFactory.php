<?php

namespace Database\Factories;

use App\Models\Matches;
use App\Models\ticketCategories;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => 'match',
            'matches_id' => $match = Matches::inRandomOrder()->first()?->id,
            'date' => $match ? Matches::find($match)->date : null,
            'description' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['available', 'sold out']),
        ];
    }
}
