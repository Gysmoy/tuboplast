<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $forceHttps = app()->environment('production')
            || env('APP_PROTOCOL') === 'https'
            || str_starts_with((string) config('app.url'), 'https://');

        if ($forceHttps) {
            URL::forceScheme('https');
            $this->app['request']->server->set('HTTPS', 'on');
        }

        // Dominio canónico: canonical, og:url, sitemap y robots salen siempre
        // de APP_URL (tuboplastperu.com) aunque entren por otro host.
        $appUrl = (string) config('app.url');
        if (str_starts_with($appUrl, 'https://')) {
            URL::forceRootUrl(rtrim($appUrl, '/'));
        }
    }
}
