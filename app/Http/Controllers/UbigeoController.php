<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\File;

class UbigeoController extends Controller
{
    public function inei()
    {
        $path = storage_path('app/utils/ubigeo-inei.json');
        if (!File::exists($path)) {
            return response([
                'status' => 404,
                'message' => 'Archivo de ubigeo no encontrado',
                'data' => [],
            ], 404);
        }

        $decoded = json_decode(File::get($path), true);
        $rows = is_array($decoded) ? $decoded : [];

        $data = collect($rows)->map(function ($row) {
            return [
                'ubigeo' => $row['code'] ?? null,
                'department' => $row['department'] ?? null,
                'province' => $row['province'] ?? null,
                'district' => $row['district'] ?? null,
                'latitude' => isset($row['coordinates']['latitude']) ? (float) $row['coordinates']['latitude'] : null,
                'longitude' => isset($row['coordinates']['longitude']) ? (float) $row['coordinates']['longitude'] : null,
            ];
        })->filter(fn($x) => $x['ubigeo'] && $x['department'] && $x['province'] && $x['district'])
          ->values();

        return response([
            'status' => 200,
            'message' => 'Operacion correcta',
            'data' => $data,
        ], 200);
    }
}

