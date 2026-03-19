<?php

namespace Database\Seeders;

use App\Models\Tithe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TitheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tithes = [
            [
                'amount' => 200.00,
                'real_amount' => 197.20,
                'created_at' => '2025-01-01 12:00:00'
            ],
            [
                'revenue_id' => '908ed7ea-f51a-11ef-b7fe-00ff55cbef07',
                'amount' => 10.00,
                'real_amount' => 7.50,
                'created_at' => '2025-01-02 12:00:00'
            ],
            [
                'revenue_id' => '38b4a19c-f512-11ef-b7fe-00ff55cbef07',
                'amount' => 20.00,
                'real_amount' => 16.00,
                'created_at' => '2025-01-03 12:00:00'
            ],
            [
                'revenue_id' => '38b5174d-f512-11ef-b7fe-00ff55cbef07',
                'amount' => 100.00,
                'real_amount' => 100.00,
                'created_at' => '2025-01-04 12:00:00'
            ],
        ];

        foreach ($tithes as $tithe) {
            Tithe::create($tithe);
        }
    }
}
