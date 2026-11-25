<?php

namespace Database\Seeders;

use App\Models\QuizResponse;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class QuizResponseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        QuizResponse::factory()
            ->count(100)
            ->create();
    }
}
