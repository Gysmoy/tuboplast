<?php

namespace App\Http\Controllers;

use App\Models\Distribuidor;
use App\Models\Message;
use Illuminate\Http\Request;

class LandingController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $properties = [
            'token' => csrf_token(),
        ];

        if ($this->reactView === 'Distributors') {
            $properties['distributors'] = Distribuidor::query()
                ->where('status', true)
                ->orderBy('department')
                ->orderBy('province')
                ->orderBy('district')
                ->get([
                    'id',
                    'department',
                    'province',
                    'district',
                    'address',
                    'reference',
                    'latitude',
                    'longitude',
                ]);
        }

        return $properties;
    }

    public function catalogView(Request $request)
    {
        $this->reactView = 'Catalog';

        return parent::reactView($request);
    }

    public function distributorsView(Request $request)
    {
        $this->reactView = 'Distributors';

        return parent::reactView($request);
    }

    public function contactView(Request $request)
    {
        $this->reactView = 'Contact';

        return parent::reactView($request);
    }

    public function storeContact(Request $request)
    {
        $validated = $request->validate([
            'business' => 'nullable|string|max:160',
            'name' => 'required|string|max:120',
            'email' => 'required|email|max:180',
            'service' => 'nullable|string|max:160',
            'source' => 'nullable|string|max:60',
            'message' => 'required|string|max:2000',
        ]);

        $tracking = $this->detectClientTracking($request);

        Message::create([
            'business' => $validated['business'] ?? null,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'service' => $validated['service'] ?? null,
            'source' => $validated['source'] ?? 'landing',
            'message' => $validated['message'],
            ...$tracking,
            'seen' => false,
            'status' => true,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Gracias. Tu mensaje fue enviado correctamente.',
        ]);
    }

    private function detectClientTracking(Request $request): array
    {
        $userAgent = $request->userAgent() ?? '';

        return [
            'ip_address' => $request->ip(),
            'browser' => $this->detectBrowser($userAgent),
            'device_type' => preg_match('/Mobile|Android|iPhone|iPod|iPad|Tablet|IEMobile|Opera Mini/i', $userAgent)
                ? 'mobile'
                : 'desktop',
            'operating_system' => $this->detectOperatingSystem($userAgent),
            'user_agent' => $userAgent ?: null,
        ];
    }

    private function detectBrowser(string $userAgent): string
    {
        $browsers = [
            'Edge' => '/Edg(?:A|iOS)?\/([\d.]+)/i',
            'Opera' => '/(?:OPR|Opera)\/([\d.]+)/i',
            'Chrome' => '/(?:Chrome|CriOS)\/([\d.]+)/i',
            'Firefox' => '/(?:Firefox|FxiOS)\/([\d.]+)/i',
            'Safari' => '/Version\/([\d.]+).*Safari/i',
            'Internet Explorer' => '/(?:MSIE\s|Trident\/.*rv:)([\d.]+)/i',
        ];

        foreach ($browsers as $name => $pattern) {
            if (preg_match($pattern, $userAgent, $matches)) {
                return "{$name} {$matches[1]}";
            }
        }

        return 'Desconocido';
    }

    private function detectOperatingSystem(string $userAgent): string
    {
        $operatingSystems = [
            'Windows' => '/Windows NT/i',
            'Android' => '/Android/i',
            'iOS' => '/iPhone|iPad|iPod/i',
            'macOS' => '/Mac OS X|Macintosh/i',
            'Chrome OS' => '/CrOS/i',
            'Linux' => '/Linux/i',
        ];

        foreach ($operatingSystems as $name => $pattern) {
            if (preg_match($pattern, $userAgent)) {
                return $name;
            }
        }

        return 'Desconocido';
    }
}
