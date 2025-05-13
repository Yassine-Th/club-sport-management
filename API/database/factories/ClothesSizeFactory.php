<?php

namespace Database\Factories;

use App\Models\ClothesSize;
use App\Models\Clothes;
use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClothesSizeFactory extends Factory
{
    protected $model = ClothesSize::class;

    public function definition()
    {
        // Get a random clothes record or create one
        $clothes = Clothes::inRandomOrder()->first() ?? Clothes::factory()->create();

        // Get a size that is not already associated with the selected clothes
        $size = Size::whereDoesntHave('clothes', function ($query) use ($clothes) {
            $query->where('clothes_id', $clothes->id);
        })->inRandomOrder()->first();

        // If no available size is found, create a new size
        if (!$size) {
            $size = Size::factory()->create();
        }

        return [
            'clothes_id' => $clothes->id,
            'size_id'    => $size->id,
            'stock'      => $this->faker->numberBetween(0, 50),
        ];
    }
}
