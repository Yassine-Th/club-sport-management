<?php

namespace Database\Factories;

use App\Models\Trophy;
use App\Models\MyClub;
use Illuminate\Database\Eloquent\Factories\Factory;

class TrophyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Trophy::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'my_club_id' => MyClub::first()->id ?? 1,
            'title' => $this->faker->sentence(3),
            'year' => $this->faker->numberBetween(1950, 2023),
            'times_won' => $this->faker->numberBetween(1, 5),
            'competition' => $this->faker->randomElement(['Botola Pro', 'Coupe du Trône', 'Coupe de la CAF', 'Championnat Arabe']),
            'description' => $this->faker->paragraph(),
            'photo' => 'trophy_default.jpg',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Configure specific trophy data.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function configure()
    {
        return $this->afterMaking(function (Trophy $trophy) {
            // You can add specific logic here if needed
        })->afterCreating(function (Trophy $trophy) {
            // You can add specific logic here if needed
        });
    }

    /**
     * Predefined trophies for HUSA
     */
    public function husaTrophies()
    {
        $trophies = [
            [
                'title'       => 'Championnat du Maroc',
                'year'        => 2002,
                'times_won'   => 1,
                'competition' => 'Botola Pro',
                'description' => 'Premier titre de champion du Maroc pour le HUSA, remporté lors de la saison 2001-2002 sous la direction de l\'entraîneur Mohamed Fakhir.',
                'photo'       => 'images/cup.jpg',
            ],
            [
                'title'       => 'Coupe du Trône',
                'year'        => 1963,
                'times_won'   => 1,
                'competition' => 'Coupe du Trône',
                'description' => 'Première Coupe du Trône remportée par le HUSA en 1963, marquant le début de son palmarès national.',
                'photo'       => 'images/cup.jpg',
            ],
            [
                'title'       => 'Coupe du Trône',
                'year'        => 1987,
                'times_won'   => 1,
                'competition' => 'Coupe du Trône',
                'description' => 'Deuxième victoire en Coupe du Trône, 24 ans après le premier sacre, confirmant le retour du club au premier plan.',
                'photo'       => 'images/cup.jpg',
            ],
            [
                'title'       => 'Coupe du Trône',
                'year'        => 2018,
                'times_won'   => 1,
                'competition' => 'Coupe du Trône',
                'description' => 'Troisième sacre en Coupe du Trône, remporté face au Wydad Athletic Club aux tirs au but après un match intense.',
                'photo'       => 'images/cup.jpg',
            ],
            [
                'title'       => 'Championnat Arabe des Clubs',
                'year'        => 1996,
                'times_won'   => 1,
                'competition' => 'Championnat Arabe',
                'description' => 'Victoire historique au Championnat Arabe des Clubs, premier titre international majeur pour le HUSA.',
                'photo'       => 'images/cup.jpg',
            ],
            [
                'title'       => 'Finaliste Coupe de la CAF',
                'year'        => 2020,
                'times_won'   => 1,
                'competition' => 'Coupe de la CAF',
                'description' => 'Parcours exceptionnel en Coupe de la Confédération Africaine de Football, atteignant la finale pour la première fois de son histoire.',
                'photo'       => 'images/cup.jpg',
            ],
        ];

        return $this->state(function (array $attributes) use ($trophies) {
            $trophy = $this->faker->randomElement($trophies);
            return array_merge($attributes, $trophy);
        });
    }
}
