<?php

namespace Database\Seeders;

use App\Models\Lokus;
use Illuminate\Database\Seeder;

class LokusSeeder extends Seeder
{
    public function run(): void
    {
        Lokus::create([
            'name' => 'DPMPTSP Kabupaten Bekasi',
            'is_active' => 1,
        ]);
    }
}