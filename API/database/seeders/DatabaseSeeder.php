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
use App\Models\Ticket;
use App\Models\ticketCategories;
use Carbon\Carbon;
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
        ticketCategories::insert([
            [
                'category' => 'VIP',
                'gate' => '1',

            ],
            [
                'category' => 'Standard',
                'gate' => '3',
            ],
            [
                'category' => 'Economy',
                'gate' => '2',
            ],
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
        $matches = Matches::factory(25)->create();


        $tickets = Ticket::factory(5)->create();


        // Attach all categories to each ticket with different price/stock
        $allCategories = ticketCategories::all();

        foreach ($tickets as $ticket) {
            $pivotData = [];
            foreach ($allCategories as $category) {
                $pivotData[$category->id] = [
                    'price' => match ($category->category) {
                        'VIP' => 120.00,
                        'Standard' => 60.00,
                        'Economy' => 25.00,
                        default => 50.00,
                    },
                    'stock' => match ($category->category) {
                        'VIP' => 30,
                        'Standard' => 80,
                        'Economy' => 150,
                        default => 50,
                    },
                ];
            }
            $ticket->categories()->attach($pivotData);
        }

        // 8) Create an event ticket and attach all categories
        $eventTicket = Ticket::create([
            'type' => 'event',
            'matches_id' => null,
            'date' => now()->addDays(10),
            'description' => 'Billet pour un événement spécial',
            'status' => 'available',
        ]);

        $pivotData = [];
        foreach ($allCategories as $category) {
            $pivotData[$category->id] = [
                'price' => match ($category->category) {
                    'VIP' => 150.00,
                    'Standard' => 70.00,
                    'Economy' => 30.00,
                    default => 50.00,
                },
                'stock' => match ($category->category) {
                    'VIP' => 20,
                    'Standard' => 60,
                    'Economy' => 120,
                    default => 50,
                },
            ];
        }
        $eventTicket->categories()->attach($pivotData);

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

            // Only generate goals if match_date is in the past
            if (Carbon::parse($match->match_date)->isPast()) {
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
