<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\WhatsappNumber;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use SoDe\Extend\Response;

class WhatsappNumberController extends BasicController
{
    public $reactView = 'Admin/WhatsappNumbers';
    public $model = WhatsappNumber::class;

    public function setPrimary(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $id = $request->input('id');
            if (!$id) {
                throw new \Exception('Falta el identificador del WhatsApp');
            }

            WhatsappNumber::query()->update(['is_primary' => false]);
            WhatsappNumber::query()->where('id', $id)->update(['is_primary' => true]);

            $response->status = 200;
            $response->message = 'WhatsApp principal actualizado';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    public function beforeSave(Request $request)
    {
        $validated = $request->validate([
            'tag' => 'nullable|string|max:60',
            'title' => 'required|string|max:120',
            'phone' => 'required|string|max:30',
            'is_primary' => 'nullable',
            'sort_order' => 'nullable|integer|min:0',
            'status' => 'nullable',
        ]);

        $validated['phone'] = preg_replace('/\D/', '', $validated['phone']);
        $validated['sort_order'] = (int) ($validated['sort_order'] ?? 0);
        $validated['is_primary'] = in_array($request->input('is_primary'), [true, 'true', 1, '1', 'on'], true) ? 1 : 0;
        $validated['status'] = array_key_exists('status', $validated)
            ? (in_array($validated['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0)
            : 1;

        if (!$validated['is_primary'] && !WhatsappNumber::query()->count()) {
            $validated['is_primary'] = 1;
        }

        if ($validated['is_primary']) {
            WhatsappNumber::query()
                ->when($request->input('id'), fn ($query, $id) => $query->where('id', '!=', $id))
                ->update(['is_primary' => false]);
        }

        return [
            'id' => $request->input('id'),
            ...$validated,
        ];
    }
}
