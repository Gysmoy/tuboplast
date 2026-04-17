<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Distribuidor;
use Illuminate\Http\Request;

class DistribuidorController extends BasicController
{
    public $reactView = 'Admin/Distribuidores';
    public $model = Distribuidor::class;

    public function setReactViewProperties(Request $request)
    {
        return [
            'gmapsApiKey' => env('GMAPS_API_KEY'),
        ];
    }

    public function beforeSave(Request $request)
    {
        $validated = $request->validate([
            'department' => 'required|string|max:120',
            'province' => 'required|string|max:120',
            'district' => 'required|string|max:120',
            'ubigeo' => 'required|string|max:12',
            'address' => 'required|string|max:255',
            'reference' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'status' => 'nullable',
        ]);

        if (array_key_exists('status', $validated)) {
            $validated['status'] = in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0;
        } else {
            $validated['status'] = 1;
        }

        return [
            'id' => $request->input('id'),
            ...$validated,
        ];
    }
}
