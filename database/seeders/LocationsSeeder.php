<?php

namespace Database\Seeders;

use App\Models\Distribuidor;
use App\Models\Sucursal;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class LocationsSeeder extends Seeder
{
    /**
     * Distribuidores: importados del directorio de tuboplastperu.com (WP Store
     * Locator, 146 registros). La dirección y coordenadas se enriquecieron con
     * Google Places y se mapearon a ubigeo INEI por distrito.
     * Fuente: database/data/distribuidores.json
     * Sucursal: sede central de tuboplastperu.com/contactanos.
     */
    public function run(): void
    {
        $this->seedDistribuidores();
        $this->seedSucursales();
    }

    private function seedDistribuidores(): void
    {
        $path = database_path('data/distribuidores.json');
        if (!File::exists($path)) {
            $this->command?->warn('LocationsSeeder: distribuidores.json no encontrado, omitido.');
            return;
        }

        $rows = json_decode(File::get($path), true);
        if (!is_array($rows)) {
            return;
        }

        // El JSON es el espejo autoritativo del directorio del sitio.
        Distribuidor::query()->delete();

        $s = fn ($v) => $v === null ? '' : (string) $v;
        $payload = [];
        foreach ($rows as $r) {
            $payload[] = [
                'name' => $r['name'] ?? null,
                'department' => $s($r['department'] ?? null),
                'province' => $s($r['province'] ?? null),
                'district' => $s($r['district'] ?? null),
                'ubigeo' => $s($r['ubigeo'] ?? null),
                'address' => $s($r['address'] ?? null),
                'reference' => null,
                'phone' => $r['phone'] ?? null,
                'phone_prefix' => $r['phone_prefix'] ?? '+51',
                'business_hours' => $r['business_hours'] ?? null,
                'featured' => !empty($r['featured']),
                'distributor_type' => !empty($r['featured']) ? 'distributor' : 'point_of_sale',
                'latitude' => $r['latitude'] ?? null,
                'longitude' => $r['longitude'] ?? null,
                'status' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($payload, 100) as $chunk) {
            Distribuidor::insert($chunk);
        }

        $this->command?->info('LocationsSeeder: ' . count($payload) . ' distribuidores importados.');
    }

    private function seedSucursales(): void
    {
        // Sede central tomada de tuboplastperu.com/contactanos.
        $branch = [
            'department' => 'Lima',
            'province' => 'Lima',
            'district' => 'Ate',
            'ubigeo' => '150103',
            'address' => 'Calle Marie Curie 313, Urb. Santa Rosa - Ate Vitarte',
            'reference' => 'Sede central Tuboplast · (01) 326-1146',
            'latitude' => -12.0631222,
            'longitude' => -76.9746798,
        ];

        Sucursal::where('district', 'Ate')->where('reference', 'like', 'Sede central%')->delete();
        Sucursal::updateOrCreate(
            ['address' => $branch['address']],
            [...$branch, 'status' => true],
        );
    }
}
