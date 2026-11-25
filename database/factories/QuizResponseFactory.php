<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuizResponse>
 */
class QuizResponseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'gender' => fake()->randomElement(['P', 'L']),
            'education' => fake()->randomElement(['SD', 'SMP', 'SMA', 'S1', 'S2', 'S3']),
            'job' => fake()->randomElement(['PNS', 'TNI', 'POLRI', 'SWASTA', 'WIRAUSAHA']),
            'q1' => fake()->numberBetween(1, 4),
            'q2' => fake()->numberBetween(1, 4),
            'q3' => fake()->numberBetween(1, 4),
            'q4' => fake()->numberBetween(1, 4),
            'q5' => fake()->numberBetween(1, 4),
            'q6' => fake()->numberBetween(1, 4),
            'q7' => fake()->numberBetween(1, 4),
            'q8' => fake()->numberBetween(1, 4),
            'q9' => fake()->numberBetween(1, 4),
            'suggestion' => fake()->name(),
            'serviceId' => fake()->numberBetween(1, 21),
        ];
    }
}
