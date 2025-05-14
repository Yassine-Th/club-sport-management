<?php

namespace Database\Seeders;

use App\Models\Categories;
use App\Models\Clothes;
use App\Models\ClothesSize;
use App\Models\Club;
use App\Models\tabler;
use App\Models\Product;
use App\Models\Size;
use App\Models\User;
use App\Models\Matches;
use App\Models\MyClub;
use App\Models\Player;
use App\Models\MyPlayerMatchStat;
use App\Models\PlayerMatchGoal;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1) Create my club and opponent clubs
        $myClub    = MyClub::factory()->create();
        $opponents = Club::factory(5)->create();

        // 2) Seed users and news
        $this->call([
            UserSeeder::class,
            NewsSeeder::class,
        ]);

        // 3) Seed sizes and categories
        Size::insert([
            ['label' => 'Small'],
            ['label' => 'Medium'],
            ['label' => 'Large'],
            ['label' => 'Extra-Large'],
        ]);
        Categories::factory()->count(1)->create();

        // 4) Seed products & clothes
        Product::factory(5)->create();
        Clothes::factory(10)->create()->each(function ($clothes) {
            if ($clothes->sizes()->count() === 0) {
                $availableSizes = Size::inRandomOrder()
                    ->limit(rand(2, 5))
                    ->pluck('id');

                foreach ($availableSizes as $sizeId) {
                    $clothes->sizes()->attach($sizeId, [
                        'stock' => rand(1, 50),
                    ]);
                }
            }
        });

        // 5) Seed a squad of 20 players for my club
        $squad = Player::factory(20)
            ->create(['my_club_id' => $myClub->id]);

        // 6) Create matches and logical stats/goals
        $matches = Matches::factory(10)
            ->state(function () use ($myClub, $opponents) {
                return [
                    'my_club_id'       => $myClub->id,
                    'opponent_club_id' => $opponents->random()->id,
                    'match_date'       => now()->subDays(rand(0, 365)),
                    'is_home'          => (bool) rand(0, 1),
                ];
            })
            ->create();

        foreach ($matches as $match) {
            // a) select 11 random starters
            $starters = $squad->random(11);

            // b) create a stat record for each starter
            $stats = $starters->map(function ($player) use ($match) {
                return MyPlayerMatchStat::factory()->create([
                    'matches_id'  => $match->id,
                    'player_id' => $player->id,
                ]);
            });

            // c) decide total goals (0-5)
            $totalGoals = rand(0, 5);
            if ($totalGoals > 0) {
                $distinctCount = min($totalGoals, $stats->count());
                $scorerStats   = $stats->random($distinctCount);
                $remaining     = $totalGoals;

                foreach ($scorerStats as $stat) {
                    $goals = 1;
                    $remaining--;
                    if ($remaining > 0 && rand(0, 1)) {
                        $goals++;
                        $remaining--;
                    }
                    PlayerMatchGoal::factory($goals)
                        ->create(['player_match_stat_id' => $stat->id]);
                    if ($remaining <= 0) {
                        break;
                    }
                }
            }

            // d) update match goal totals
            $matchGoals = $match->playerStats()
                ->withCount('goals')
                ->get()
                ->sum('goals_count');

            $match->my_club_goals       = $matchGoals;
            $match->opponent_club_goals = rand(0, 5);
            $match->save();
        }
    }
}
