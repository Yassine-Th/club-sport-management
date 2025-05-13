<?php

namespace Database\Factories;

use App\Models\Clothes;
use App\Models\Product;
use App\Models\Categories;
use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClothesFactory extends Factory
{
    protected $model = Clothes::class;

    public function definition()
    {
        // Ensure a base product exists
        $product = Product::factory()->create();

        // Get the Clothes category
        $clothesCategory = Categories::firstOrCreate(['name' => 'Clothes']);

        // Update the product's category_id to the Clothes category
        $product->update(['category_id' => $clothesCategory->id]);
        $product->update(['stock' => 0]);

        return [
            'product_id' => $product->id,
            'gender'     => $this->faker->randomElement(['homme', 'femme', 'enfant']),
            'type'       => $this->faker->randomElement(['Tenues de match', 'entraînement', 'vêtements de sport']),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Clothes $clothes) {
            // Get sizes that are not already associated with the clothes
            $availableSizes = Size::inRandomOrder()
                ->limit(rand(2, 5)) // Attach between 2 and 5 sizes
                ->pluck('id');

            // Attach the sizes with random stock
            foreach ($availableSizes as $sizeId) {
                $clothes->sizes()->attach($sizeId, [
                    'stock' => rand(1, 50),
                ]);
            }
        });
    }
}
