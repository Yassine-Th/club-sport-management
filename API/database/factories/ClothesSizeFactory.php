<?php

namespace Database\Factories;

use App\Models\ClothesSize; // create this model if necessary
use App\Models\Clothes;
use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClothesSizeFactory extends Factory
{
    protected $model = ClothesSize::class;

    public function definition()
    {
        $clothes = Clothes::inRandomOrder()->first() ?? Clothes::factory()->create();
        $size    = Size::inRandomOrder()->first()    ?? Size::factory()->create();

        return [
            'clothes_id' => $clothes->id,
            'size_id'    => $size->id,
            'stock'      => $this->faker->numberBetween(0, 50),
        ];
    }
}
