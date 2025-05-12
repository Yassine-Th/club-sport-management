<?php

namespace Database\Factories;

use App\Models\Size;
use Illuminate\Database\Eloquent\Factories\Factory;

class SizeFactory extends Factory
{
    protected $model = Size::class;

    private static $labels = ['Small', 'Medium', 'Large', 'Extra-Large'];

    public function definition(): array
    {
        if (empty(self::$labels)) {
            throw new \Exception('No more unique labels available.');
        }

        $label = array_shift(self::$labels);

        return [
            'label' => $label,
        ];
    }
}
