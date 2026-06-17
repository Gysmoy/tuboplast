<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Quote;
use Illuminate\Http\Request;
use SoDe\Extend\Response;

class QuoteController extends BasicController
{
    public $reactView = 'Admin/Quotes';
    public $model = Quote::class;

    public function seen(Request $request)
    {
        $response = new Response();

        try {
            $validated = $request->validate([
                'id' => 'required|integer|exists:quotes,id',
            ]);

            Quote::query()
                ->whereKey($validated['id'])
                ->update(['seen' => true]);

            $response->status = 200;
            $response->message = 'Cotización marcada como leída';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    public function changeState(Request $request)
    {
        $response = new Response();

        try {
            $validated = $request->validate([
                'id' => 'required|integer|exists:quotes,id',
                'state' => 'required|in:pendiente,contactado,convertido,archivado',
                'reason' => 'nullable|string|max:1000',
            ]);

            $isArchived = $validated['state'] === 'archivado';
            if ($isArchived && empty(trim($validated['reason'] ?? ''))) {
                throw new \Exception('Debes indicar el motivo de archivado');
            }

            Quote::query()
                ->whereKey($validated['id'])
                ->update([
                    'quote_status' => $validated['state'],
                    'archived_reason' => $isArchived ? trim($validated['reason']) : null,
                ]);

            $response->status = 200;
            $response->message = 'Estado actualizado';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }
}
