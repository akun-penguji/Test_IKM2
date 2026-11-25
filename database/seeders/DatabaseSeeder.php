<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\UnsurSeeder;
use Database\Seeders\ServiceSeeder;
use Database\Seeders\QuestionSeeder;
use Database\Seeders\AnswerSeeder;
use Database\Seeders\LokusSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            QuestionSeeder::class,
            ServiceSeeder::class,
            UnsurSeeder::class,
            AnswerSeeder::class,
            LokusSeeder::class,
        ]);
    }
}
