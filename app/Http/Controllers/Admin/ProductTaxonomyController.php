<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductTaxonomyController extends BasicController
{
    public function beforeSave(Request $request)
    {
        $id = $request->input('id');

        $validated = $request->validate([
            'name' => 'required|string|max:160',
            'description' => 'nullable|string|max:1000',
            'status' => 'nullable',
        ]);

        $validated['name'] = trim($validated['name']);
        $this->assertUniqueName($validated['name'], $id);
        $validated['slug'] = Str::slug($validated['name']);

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

    private function assertUniqueName(string $name, $ignoreId): void
    {
        $target = $this->lookupKey($name);
        $exists = $this->model::query()
            ->whereNotNull('status')
            ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
            ->get()
            ->contains(fn ($row) => $this->lookupKey($row->name) === $target);

        if ($exists) {
            throw ValidationException::withMessages([
                'name' => 'Ya existe un registro con ese nombre.',
            ]);
        }
    }

    private function lookupKey(string $name): string
    {
        $name = str_replace("\xC2\xA0", ' ', $name);
        $name = preg_replace('/\s+/u', ' ', $name) ?: $name;

        return mb_strtoupper(trim($name));
    }

    public function afterSave(Request $request, object $jpa, bool $isNew)
    {
        Cache::forget('tuboplast.catalog.facets');

        return null;
    }

    public function status(Request $request)
    {
        Cache::forget('tuboplast.catalog.facets');

        return parent::status($request);
    }

    public function delete(Request $request, string $id)
    {
        Cache::forget('tuboplast.catalog.facets');

        return parent::delete($request, $id);
    }
}
