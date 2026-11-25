<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Question::factory()->create([
            'seq' => 1,
            'name' => 'Bagaimana pendapat Saudara tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya.',
        ]);
        Question::factory()->create([
            'seq' => 2,
            'name' => 'Bagaimana pemahaman Saudara tentang kemudahan prosedur pelayanan di unit ini.',
        ]);
        Question::factory()->create([
            'seq' => 3,
            'name' => 'Bagaimana pendapat Saudara tentang kecepatan waktu dalam memberikan pelayanan.',
        ]);
        Question::factory()->create([
            'seq' => 4,
            'name' => 'Bagaimana pendapat Saudara tentang kewajaran biaya/tarif dalam pelayanan.',
        ]);
        Question::factory()->create([
            'seq' => 5,
            'name' => 'Bagaimana pendapat Saudara tentang kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan.',
        ]);
        Question::factory()->create([
            'seq' => 6,
            'name' => 'Bagaimana pendapat Saudara tentang kompetensi/kemampuan petugas dalam pelayanan.',
        ]);
        Question::factory()->create([
            'seq' => 7,
            'name' => 'Bagaimana pendapat Saudara terhadap perilaku petugas dalam pelayanan terkait kesopanan dan keramahan.',
        ]);
        Question::factory()->create([
            'seq' => 8,
            'name' => 'Bagaimana pendapat Saudara tentang kualitas sarana dan prasarana DPMPTSP Kabupaten Bekasi.',
        ]);
        Question::factory()->create([
            'seq' => 9,
            'name' => 'Bagaimana pendapat Saudara tentang penanganan pengaduan pengguna layanan.',
        ]);
    }
}
