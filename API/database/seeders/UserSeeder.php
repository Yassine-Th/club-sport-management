<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory(10)->create();
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin@example.com'), // password
            'role' => 'admin',
            'phone' => '1234567890',
            'address' => '123 Main St, Anytown, USA',
        ]);

        User::create([
            'name' => 'Journalist',
            'email' => 'journalist@example.com',
            'password' => bcrypt('journalist@example.com'), // password
            'role' => 'journalist',
            'phone' => '1234567890',
            'address' => '123 Main St, Anytown, USA',
        ]);
        User::create([
            'name' => 'Store Manager',
            'email' => 'store_manager@example.com',
            'password' => bcrypt('store_manager@example.com'), // password    
            'role' => 'store_manager',
            'phone' => '1234567890',
            'address' => '123 Main St, Anytown, USA',
        ]);
        User::create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => bcrypt('user@example.com'), // password
            'role' => 'user',
            'phone' => '1234567890',
            'address' => '123 Main St, Anytown, USA',
        ]);
    }
}
