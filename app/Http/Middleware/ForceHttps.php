<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForceHttps
{
    public function handle(Request $request, Closure $next): Response
    {
        $forceHttps = app()->environment('production')
            || env('APP_PROTOCOL') === 'https'
            || str_starts_with((string) config('app.url'), 'https://');

        if ($forceHttps && !$request->secure()) {
            return redirect()->secure($request->getRequestUri(), 301);
        }

        return $next($request);
    }
}

