<?php


namespace Database\Factories;

use App\Models\Clothes;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClothesFactory extends Factory
{
    protected $model = Clothes::class;

    public function definition()
    {
        // Ensure a base product exists
        $product = Product::factory()->create();

        return [
            'product_id' => $product->id,
            'gender'     => $this->faker->randomElement(['men','women','unisex']),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Clothes $clothes) {
            // attach between 2 and 5 random sizes
            $sizeIds = \App\Models\Size::inRandomOrder()
                        ->limit(rand(2, 5))
                        ->pluck('id');
            foreach ($sizeIds as $sizeId) {
                $clothes->sizes()->attach($sizeId, [
                    'stock' => rand(1, 50),
                ]);
            }
        });
    }
}
