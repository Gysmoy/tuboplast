<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends BasicController
{
    public $reactView = 'Admin/Categories';
    public $model = Category::class;
    public $imageFields = ['image'];
    public $useIntervention = false;

    public function beforeSave(Request $request)
    {
        $id = $request->input('id');

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string|max:1000',
            'status' => 'nullable',
        ]);

        if (array_key_exists('status', $validated)) {
            $validated['status'] = in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0;
        } else {
            $validated['status'] = 1;
        }

        return [
            'id' => $id,
            ...$validated,
        ];
    }
}

