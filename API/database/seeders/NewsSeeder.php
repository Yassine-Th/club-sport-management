<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\News::factory(10)->create();
        // You can adjust the number of news items created as needed
        // For example, you can create 50 news items by changing 10 to 50
    }
}
