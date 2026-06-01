<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\ClubExpert;
use Illuminate\Http\Request;
use SoDe\Extend\Response;

class ClubController extends BasicController
{
    public $reactView = 'Admin/Club';
    public $model = ClubExpert::class;

    public function seen(Request $request)
    {
        $response = new Response();

        try {
            $validated = $request->validate([
                'id' => 'required|integer|exists:club_experts,id',
            ]);

            ClubExpert::query()
                ->whereKey($validated['id'])
                ->update(['seen' => true]);

            $response->status = 200;
            $response->message = 'Solicitud marcada como leída';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }
}
