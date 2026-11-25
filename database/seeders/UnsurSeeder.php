<?php

namespace Database\Seeders;

use App\Models\Unsur;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UnsurSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $unsur_list = [
            ['name' => 'Kesesuaian Persyaratan'],
            ['name' => 'Prosedur Pelayanan'],
            ['name' => 'Kecepatan Pelayanan'],
            ['name' => 'Kesesuaian / Kewajaran Biaya'],
            ['name' => 'Kesesuaian Pelayanan'],
            ['name' => 'Kompetensi Petugas'],
            ['name' => 'Perilaku Petugas Pelayanan'],
            ['name' => 'Kualitas Sarana dan Prasarana'],
            ['name' => 'Penanganan Pengaduan'],
        ];
        foreach ($unsur_list as $unsur) {
            Unsur::factory()->create($unsur);
        }
    }
}
