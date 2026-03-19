<?php

namespace Database\Seeders;

use App\Models\Revenue;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RevenueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $revenues = [
            [
                'name' => 'Saldo inicial',
                'amount' => 132.60,
                'total_amount' => 132.60,
                'created_at' => '2025-02-20 12:00:00',
            ],
            [
                'id' => '908ed7ea-f51a-11ef-b7fe-00ff55cbef07',
                'name' => 'Pago Streaming',
                'description' => 'Pago de ultima cuota del sistema de streaming',
                'amount' => 75.00,
                'total_amount' => 207.60,
                'created_at' => '2025-02-21 12:00:00'
            ],
            [
                'id' => '38b4a19c-f512-11ef-b7fe-00ff55cbef07',
                'name' => 'Traspaso Vua',
                'description' => 'Se realizo el traspaso de servidor de vua',
                'amount' => 160.00,
                'total_amount' => 367.60,
                'created_at' => '2025-02-22 12:00:00'
            ],
            [
                'id' => '38b5174d-f512-11ef-b7fe-00ff55cbef07',
                'name' => 'Adelanto acopio',
                'amount' => 1000.00,
                'total_amount' => 1367.60,
                'created_at' => '2025-02-23 12:00:00'
            ],
            [
                'name' => 'Retiro 900 50/50',
                'amount' => -900.00,
                'total_amount' => 467.60,
                'created_at' => '2025-02-24 12:00:00'
            ],
            [
                'name' => 'Pago Bitel - Eduardo 30.90',
                'amount' => -30.90,
                'total_amount' => 436.70,
                'created_at' => '2025-02-25 12:00:00'
            ]
        ];

        foreach ($revenues as $revenue) {
            Revenue::create($revenue);
        }
    }
}
