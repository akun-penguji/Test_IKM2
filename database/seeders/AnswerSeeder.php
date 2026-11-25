<?php

namespace Database\Seeders;

use App\Models\Answer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $answers = [
            [
                'name'=> "Tidak Sesuai",
                'value'=> 1,
                'questionId'=> 1,
            ],
            [
                'name'=> "Tidak Mudah",
                'value'=> 1,
                'questionId'=> 2,
            ],
            [
                'name'=> "Tidak Cepat",
                'value'=> 1,
                'questionId'=> 3,
            ],
            [
                'name'=> "Tidak Wajar",
                'value'=> 1,
                'questionId'=> 4,
            ],
            [
                'name'=> "Tidak Sesuai",
                'value'=> 1,
                'questionId'=> 5,
            ],
            [
                'name'=> "Tidak Kompeten",
                'value'=> 1,
                'questionId'=> 6,
            ],
            [
                'name'=> "Tidak Sopan dan Tidak Ramah",
                'value'=> 1,
                'questionId'=> 7,
            ],
            [
                'name'=> "Buruk",
                'value'=> 1,
                'questionId'=> 8,
            ],
            [
                'name'=> "Tidak Ada",
                'value'=> 1,
                'questionId'=> 9,
            ],
            [
                'name'=> "Kurang Sesuai",
                'value'=> 2,
                'questionId'=> 1,
            ],
            [
                'name'=> "Kurang Mudah",
                'value'=> 2,
                'questionId'=> 2,
            ],
            [
                'name'=> "Kurang Cepat",
                'value'=> 2,
                'questionId'=> 3,
            ],
            [
                'name'=> "Kurang Wajar",
                'value'=> 2,
                'questionId'=> 4,
            ],
            [
                'name'=> "Kurang Sesuai",
                'value'=> 2,
                'questionId'=> 5,
            ],
            [
                'name'=> "Kurang Kompeten",
                'value'=> 2,
                'questionId'=> 6,
            ],
            [
                'name'=> "Kurang Sopan dan Kurang Ramah",
                'value'=> 2,
                'questionId'=> 7,
            ],
            [
                'name'=> "Cukup",
                'value'=> 2,
                'questionId'=> 8,
            ],
            [
                'name'=> "Ada Tetapi Tidak Berfungsi",
                'value'=> 2,
                'questionId'=> 9,
            ],
            [
                'name'=> "Sesuai",
                'value'=> 3,
                'questionId'=> 1,
            ],
            [
                'name'=> "Mudah",
                'value'=> 3,
                'questionId'=> 2,
            ],
            [
                'name'=> "Cepat",
                'value'=> 3,
                'questionId'=> 3,
            ],
            [
                'name'=> "Wajar",
                'value'=> 3,
                'questionId'=> 4,
            ],
            [
                'name'=> "Sesuai",
                'value'=> 3,
                'questionId'=> 5,
            ],
            [
                'name'=> "Kompeten",
                'value'=> 3,
                'questionId'=> 6,
            ],
            [
                'name'=> "Sopan dan Ramah",
                'value'=> 3,
                'questionId'=> 7,
            ],
            [
                'name'=> "Baik",
                'value'=> 3,
                'questionId'=> 8,
            ],
            [
                'name'=> "Berfungsi Kurang Maksimal",
                'value'=> 3,
                'questionId'=> 9,
            ],
            [
                'name'=> "Sangat Sesuai",
                'value'=> 4,
                'questionId'=> 1,
            ],
            [
                'name'=> "Sangat Mudah",
                'value'=> 4,
                'questionId'=> 2,
            ],
            [
                'name'=> "Sangat Cepat",
                'value'=> 4,
                'questionId'=> 3,
            ],
            [
                'name'=> "Sangat Wajar",
                'value'=> 4,
                'questionId'=> 4,
            ],
            [
                'name'=> "Sangat Sesuai",
                'value'=> 4,
                'questionId'=> 5,
            ],
            [
                'name'=> "Sangat Kompeten",
                'value'=> 4,
                'questionId'=> 6,
            ],
            [
                'name'=> "Sangat Sopan dan Sangat Ramah",
                'value'=> 4,
                'questionId'=> 7,
            ],
            [
                'name'=> "Sangat Baik",
                'value'=> 4,
                'questionId'=> 8,
            ],
            [
                'name'=> "Dikelola Dengan Baik",
                'value'=> 4,
                'questionId'=> 9,
            ]
        ];

        foreach ($answers as $answer) {
            Answer::factory()->create($answer);
        }

    }
}
