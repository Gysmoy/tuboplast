<?php

namespace App\Http\Controllers\Admin;

use App\Models\ProductSegment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductSegmentController extends ProductTaxonomyController
{
    public $reactView = 'Admin/ProductSegments';
    public $model = ProductSegment::class;

    public function beforeSave(Request $request)
    {
        $this->ensureBaseRows();
        $id = $request->input('id');

        $validated = $request->validate([
            'name' => 'required|string|max:160',
            'description' => 'nullable|string|max:1000',
            'featured_order' => 'nullable|integer|min:0',
            'featured' => 'nullable',
            'status' => 'nullable',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $validated['name'] = trim($validated['name']);
        $this->assertUniqueName($validated['name'], $id);
        $validated['slug'] = Str::slug($validated['name']);
        $validated['featured_order'] = (int) ($validated['featured_order'] ?? 0);
        $validated['featured'] = array_key_exists('featured', $validated)
            ? (in_array($validated['featured'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0)
            : 0;
        $validated['status'] = array_key_exists('status', $validated)
            ? (in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0)
            : 1;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('segments', 'public');
        } else {
            unset($validated['image']);
        }

        return [
            'id' => $id,
            ...$validated,
        ];
    }
}
