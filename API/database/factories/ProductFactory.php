<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Define available image files
        $files = ['2.jpg', 'shert.jpg' ];

        // Randomly select an image
        $filename = $files[array_rand($files)];

        // Copy the image to the storage directory if it doesn't already exist
        $destinationPath = 'products/' . $filename;
        if (!Storage::disk('public')->exists($destinationPath)) {
            Storage::disk('public')->put($destinationPath, file_get_contents(public_path('images/' . $filename)));
        }

        return [
            "name" => $this->faker->word(),
            "category_id" => \App\Models\Categories::inRandomOrder()->first()->id,
            "description" => $this->faker->sentence(),
            "price" => $this->faker->randomFloat(2, 1, 100),
            "image" => $destinationPath, // Save the relative path
            "stock" => $this->faker->numberBetween(1, 100),
        ];
    }
}
