<?php

namespace Database\Factories;

use App\Models\Matches;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ticketCategories>
 */
class TicketCategoriesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_name' => $category = $this->faker->randomElement(['VIP', 'Standard', 'Economy']),
            'gate' => $category === 'VIP' ? '1' : ($category === 'Economy' ? '2' : $this->faker->randomElement(['3', '4'])),
            

        ];
    }
}
