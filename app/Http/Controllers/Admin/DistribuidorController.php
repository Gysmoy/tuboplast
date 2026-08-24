<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Distribuidor;
use Illuminate\Http\Request;

class DistribuidorController extends BasicController
{
    public $reactView = 'Admin/Distributors';
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
            'name' => 'nullable|string|max:160',
            'ruc' => 'nullable|digits:11',
            'department' => 'required|string|max:120',
            'province' => 'required|string|max:120',
            'district' => 'required|string|max:120',
            'ubigeo' => 'required|string|max:12',
            'address' => 'required|string|max:255',
            'reference' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:60',
            'phone_prefix' => 'nullable|string|max:8',
            'business_hours' => 'nullable|string|max:120',
            'featured' => 'nullable',
            'distributor_type' => 'nullable|string|max:40',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'status' => 'nullable',
        ]);

        $validated['distributor_type'] = $validated['distributor_type'] ?? 'point_of_sale';
        $validated['featured'] = $validated['distributor_type'] === 'distributor' ? 1 : 0;

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
