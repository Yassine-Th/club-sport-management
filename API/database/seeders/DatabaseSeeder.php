<?php

namespace Database\Seeders;

use App\Models\Categories;
use App\Models\Clothes;
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
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed users
        $this->call([
            UserSeeder::class,
            NewsSeeder::class,
        ]);

        // Seed sizes and categories
        Size::factory()->count(6)->create();
        Categories::factory()->count(5)->create();

        // Seed products & clothes
        Product::factory(10)->create();
        Clothes::factory(5)->create();
        MyClub::factory(1)->create();
        Club::factory(5)->create();
        // Seed tabler
        Matches::factory(5)->create()->each(function ($match) {
            // Seed players for each match
            Player::factory(11)->create(['my_club_id' => $match->my_club_id])->each(function ($player) use ($match) {
                // Seed player match stats
                MyPlayerMatchStat::factory()->create([
                    'match_id' => $match->id,
                    'player_id' => $player->id,
                ]);
            });

            // Seed goals for the match
            MyPlayerMatchStat::all()->each(function ($stat) {
                PlayerMatchGoal::factory()->count(2)->create([
                    'player_match_stat_id' => $stat->id,
                ]);
            });
        });
    }
}
