<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Club>
 */
class MyClubFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    
    public function definition(): array
    {

        return [
            'name' => 'Hassania Union Sport Agadir', 
            'city' => 'agadir',
            'founded' => '1946', 
            'stadium_name' => 'adrar agdir',
            'stadium_capacity' => 45000,
            'president' => 'ali drawi',
            'coach_name' => 'Marcos César Diaz de Castro',
            'description' => 'Le club a été fondé dans le contexte de la résistance au colonialisme français, car il était considéré comme un symbole de la lutte nationale dans la région du Souss. Ses fans sont parmi les plus fidèles du Maroc, et sont connus sous le nom de « Ultras Imazighen ».',
            'logo' => 'images/husa.png'
        ];
    }
}
