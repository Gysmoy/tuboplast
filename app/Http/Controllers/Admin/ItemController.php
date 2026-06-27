<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class ItemController extends BasicController
{
    public $reactView = 'Admin/Items';
    public $model = Item::class;
    public $imageFields = [];
    public $with4get = ['category'];

    public function setPaginationInstance(string $model)
    {
        return $model::with('category');
    }

    public function setReactViewProperties(Request $request)
    {
        return [
            'categories' => Category::query()
                ->whereNotNull('status')
                ->orderBy('name')
                ->get(['id', 'name']),
        ];
    }

    public function beforeSave(Request $request)
    {
        $id = $request->input('id');

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'sku' => 'nullable|string|max:120',
            'category_id' => 'nullable|integer|exists:categories,id',
            'segment' => 'nullable|string|max:120',
            'classification' => 'nullable|string|max:160',
            'famcons' => 'nullable|string|max:160',
            'family' => 'nullable|string|max:160',
            'type' => 'nullable|string|max:60',
            'use_type' => 'nullable|string|max:120',
            'material' => 'nullable|string|max:120',
            'color' => 'nullable|string|max:60',
            'brand' => 'nullable|string|max:120',
            'unit' => 'nullable|string|max:20',
            'masterpack' => 'nullable|integer|min:0',
            'pieces' => 'nullable|string|max:20',
            'origin_country' => 'nullable|string|max:120',
            'description' => 'nullable|string|max:2000',
            'price' => 'nullable|numeric|min:0',
            'currency' => 'nullable|in:PEN,USD',
            'pressure' => 'nullable|string|max:255',
            'diameter' => 'nullable|string|max:60',
            'nominal_diameter' => 'nullable|string|max:60',
            'diameters' => 'nullable|string',
            'package_type' => 'nullable|string|max:60',
            'perishable' => 'nullable|string|max:60',
            'hazardous' => 'nullable|string|max:60',
            'product_height' => 'nullable|numeric|min:0',
            'product_width' => 'nullable|numeric|min:0',
            'product_depth' => 'nullable|numeric|min:0',
            'product_weight' => 'nullable|numeric|min:0',
            'logistic_height' => 'nullable|numeric|min:0',
            'logistic_width' => 'nullable|numeric|min:0',
            'logistic_depth' => 'nullable|numeric|min:0',
            'logistic_weight' => 'nullable|numeric|min:0',
            'warranty' => 'nullable|string|max:2000',
            'features' => 'nullable|string|max:2000',
            'usage_recommendations' => 'nullable|string|max:2000',
            'observations' => 'nullable|string|max:2000',
            'usage_warning' => 'nullable|string|max:2000',
            'status' => 'nullable',
        ]);

        $validated['currency'] = $validated['currency'] ?? 'PEN';

        if (array_key_exists('status', $validated)) {
            $validated['status'] = in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0;
        } else {
            $validated['status'] = 1;
        }

        $validated['slug'] = Str::slug($validated['title']) ?: Str::slug('item-' . uniqid());

        $validated['diameters'] = collect(preg_split('/[\n,]+/', (string) $request->input('diameters', '')))
            ->map(fn ($value) => trim($value))
            ->filter()
            ->values()
            ->all();

        // Las imágenes de items se guardan en el disco público (storage/app/public/items)
        // para servirlas a través de storage:link (/storage/items/...).
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('items', 'public');
        }

        return [
            'id' => $id,
            ...$validated,
        ];
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        Cache::forget('tuboplast.catalog.facets');

        return null;
    }
}
