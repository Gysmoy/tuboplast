<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\HomeExpertCategory;
use App\Models\ProductSegment;
use Illuminate\Http\Request;

class HomeExpertCategoryController extends BasicController
{
    public $reactView = 'Admin/HomeExpertCategories';
    public $model = HomeExpertCategory::class;
    public $with4get = ['productSegment'];

    public function setPaginationInstance(string $model)
    {
        return $model::with('productSegment');
    }

    public function setReactViewProperties(Request $request)
    {
        return [
            'segments' => ProductSegment::query()
                ->where('status', true)
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn ($segment) => [
                    'id' => $segment->id,
                    'name' => $segment->name,
                ])
                ->values(),
        ];
    }

    public function beforeSave(Request $request)
    {
        $validated = $request->validate([
            'product_segment_id' => 'required|integer|exists:product_segments,id',
            'title' => 'required|string|max:120',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'nullable',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['status'] = array_key_exists('status', $validated)
            ? (in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0)
            : 1;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('home-experts', 'public');
        } else {
            unset($validated['image']);
        }

        return [
            'id' => $request->input('id'),
            ...$validated,
        ];
    }
}
