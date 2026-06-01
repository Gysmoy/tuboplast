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

    protected function messages()
    {
        // Preserve legacy club rows without mixing them into the contact inbox.
        return Message::query()->where(function ($query) {
            $query
                ->whereNull('source')
                ->orWhere('source', '!=', 'club');
        });
    }

    public function setPaginationInstance(string $model)
    {
        return $this->messages();
    }

    public function seen(Request $request)
    {
        $response = new Response();

        try {
            $validated = $request->validate([
                'id' => 'required|integer',
            ]);

            $this->messages()
                ->whereKey($validated['id'])
                ->firstOrFail()
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

    public function delete(Request $request, string $id)
    {
        $response = new Response();

        try {
            $this->messages()
                ->whereKey($id)
                ->firstOrFail()
                ->update(['status' => null]);

            $response->status = 200;
            $response->message = 'Operacion correcta';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

}
