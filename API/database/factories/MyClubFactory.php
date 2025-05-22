<?php

namespace Database\Factories;


use App\Models\MyClub;
use Illuminate\Database\Eloquent\Factories\Factory;

class MyClubFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MyClub::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => "Hassania Union Sport d'Agadir",
            'logo' => 'images/husa.jpg', // Adjust path as needed
            'city' => 'Agadir',
            'founded' => 1946,
            'stadium_name' => 'Stade Adrar',
            'stadium_capacity' => 45480,
            'president' => 'Habib Sidinou',
            'coach_name' => 'Abdelhadi Sektioui',
            'description' => "Le Hassania Union Sport d'Agadir, communément appelé HUSA, est un club de football marocain fondé en 1946 à Agadir. Le club évolue en Botola Pro (première division marocaine) et joue ses matchs à domicile au Stade Adrar. Le HUSA est connu pour son style de jeu offensif et sa base de supporters passionnés. Au fil des années, le club a remporté plusieurs titres nationaux et a représenté le Maroc dans diverses compétitions continentales. Les couleurs traditionnelles du club sont le rouge et le blanc, symbolisant la passion et la pureté.",
            'created_at' => $this->faker->dateTime(),
            'updated_at' => $this->faker->dateTime(),
        ];
    }
}
