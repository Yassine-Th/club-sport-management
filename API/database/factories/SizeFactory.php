<?php

namespace Database\Factories;

use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

class SizeFactory extends Factory
{
    protected $model = Size::class;

    public function definition(): array
    {
        $labels = ['Small', 'Medium', 'Large', 'Extra Large'];

        return [
            'label' => $this->faker->randomElement($labels),
        ];
    }
}
