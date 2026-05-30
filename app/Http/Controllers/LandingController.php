<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class LandingController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        return [
            'token' => csrf_token(),
        ];
    }

    public function catalogView(Request $request)
    {
        $this->reactView = 'Catalog';

        return parent::reactView($request);
    }

    public function storeContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:180',
            'message' => 'required|string|max:2000',
        ]);

        Contact::create([
            'business' => null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone_prefix' => null,
            'phone' => null,
            'service' => null,
            'source' => 'landing',
            'message' => $validated['message'],
            'status' => true,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Gracias. Tu mensaje fue enviado correctamente.',
        ]);
    }
}
