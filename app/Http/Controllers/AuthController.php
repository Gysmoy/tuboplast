<?php

namespace App\Http\Controllers;

use App\Providers\RouteServiceProvider;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use SoDe\Extend\Response;

class AuthController extends BasicController
{
    public function loginView(Request $request)
    {
        if (Auth::check()) {
            return redirect(RouteServiceProvider::HOME);
        }

        return Inertia::render('Login', [
            'APP_PROTOCOL' => env('APP_PROTOCOL', 'https'),
            'APP_DOMAIN' => env('APP_DOMAIN'),
            'PUBLIC_RSA_KEY' => Controller::$PUBLIC_RSA_KEY,
            'token' => csrf_token(),
            'message' => $request->query('message'),
        ])->rootView('auth')->withViewData([
            'component' => 'Login',
        ]);
    }

    public function login(Request $request): HttpResponse|ResponseFactory|RedirectResponse
    {
        $response = new Response();

        try {
            $request->validate([
                'email' => 'required|string',
                'password' => 'required|string',
            ]);

            $email = $this->decodeIfNeeded($request->email);
            $password = $this->decodeIfNeeded($request->password);

            if (!Auth::attempt([
                'email' => $email,
                'password' => $password,
            ])) {
                throw new Exception('Credenciales invalidas');
            }

            $request->session()->regenerate();

            $response->status = 200;
            $response->message = 'Autenticacion correcta';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    public function destroy(Request $request)
    {
        $response = new Response();

        try {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $response->status = 200;
            $response->message = 'Cierre de sesion exitoso';
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    private function decodeIfNeeded(string $value): string
    {
        try {
            return BasicController::decode($value);
        } catch (\Throwable $th) {
            return $value;
        }
    }
}
