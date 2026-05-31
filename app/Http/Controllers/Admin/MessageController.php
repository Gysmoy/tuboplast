<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Message;
use Illuminate\Http\Request;
use SoDe\Extend\Response;

class MessageController extends BasicController
{
    public $reactView = 'Admin/Messages';
    public $model = Message::class;

    public function seen(Request $request)
    {
        $response = new Response();

        try {
            $validated = $request->validate([
                'id' => 'required|integer|exists:messages,id',
            ]);

            Message::query()
                ->whereKey($validated['id'])
                ->update(['seen' => true]);

            $response->status = 200;
            $response->message = 'Mensaje marcado como leído';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }
}
