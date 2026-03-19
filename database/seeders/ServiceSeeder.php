<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Service::updateOrCreate([
            'correlative' => 'crm'
        ], [
            'name' => 'SoDe CRM',
            'description' => 'Servicio de gestion de clientes y proyectos por clientes.'
        ]);

        Service::updateOrCreate([
            'correlative' => 'facturacion'
        ], [
            'name' => 'Facturacion',
            'description' => 'Servicio de control de inventario, facturacion y ecommerce.'
        ]);
    }
}
