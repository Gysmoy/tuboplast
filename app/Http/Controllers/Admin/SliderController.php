<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Item;
use App\Models\Slider;
use Illuminate\Http\Request;

class SliderController extends BasicController
{
    public $reactView = 'Admin/Sliders';
    public $model = Slider::class;
    public $with4get = ['item.category'];

    public function setPaginationInstance(string $model)
    {
        return $model::with('item.category');
    }

    public function setReactViewProperties(Request $request)
    {
        return [
            'items' => Item::query()
                ->whereNotNull('status')
                ->with('category')
                ->orderBy('title')
                ->get()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'sku' => $item->sku,
                    'category' => $item->category?->name,
                    'image' => $item->image,
                ])
                ->values(),
        ];
    }

    public function beforeSave(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'nullable|integer|exists:items,id',
            'title' => 'required|string|max:180',
            'description' => 'nullable|string|max:2000',
            'primary_button_text' => 'nullable|string|max:120',
            'primary_button_link' => 'nullable|string|max:500',
            'secondary_button_text' => 'nullable|string|max:120',
            'secondary_button_link' => 'nullable|string|max:500',
            'metric_one_value' => 'nullable|string|max:40',
            'metric_one_label' => 'nullable|string|max:120',
            'metric_two_value' => 'nullable|string|max:40',
            'metric_two_label' => 'nullable|string|max:120',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'nullable',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['status'] = array_key_exists('status', $validated)
            ? (in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0)
            : 1;

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('sliders', 'public');
        } else {
            unset($validated['image']);
        }

        return [
            'id' => $request->input('id'),
            ...$validated,
        ];
    }
}
