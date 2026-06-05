<?php

namespace App\Http\Controllers;

use App\Models\Distribuidor;
use App\Models\ClubExpert;
use App\Models\AboutPage;
use App\Models\BlogPage;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;
use Illuminate\Validation\ValidationException;

class LandingController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $aboutData = $this->normalizeAboutPage(AboutPage::current());
        $blogData = $this->normalizeBlogPage(BlogPage::current());

        $properties = [
            'token' => csrf_token(),
            'about' => $aboutData,
            'blog' => $blogData,
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

    public function aboutView(Request $request)
    {
        $this->reactView = 'AboutFamilia';

        return parent::reactView($request);
    }

    public function aboutMedia(Request $request, string $path)
    {
        $path = ltrim($path, '/');
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $absolute = storage_path('app/public/' . $path);
        $mime = File::mimeType($absolute) ?: 'application/octet-stream';
        $content = Storage::disk('public')->get($path);

        return response($content, 200, [
            'Content-Type' => $mime,
            'Content-Disposition' => str_starts_with($mime, 'image/')
                ? 'inline'
                : 'inline; filename="' . basename($path) . '"',
        ]);
    }

    public function blogMedia(Request $request, string $path)
    {
        $path = ltrim($path, '/');
        if (!Storage::disk('public')->exists($path)) {
            abort(404);
        }

        $absolute = storage_path('app/public/' . $path);
        $mime = File::mimeType($absolute) ?: 'application/octet-stream';
        $content = Storage::disk('public')->get($path);

        return response($content, 200, [
            'Content-Type' => $mime,
            'Content-Disposition' => str_starts_with($mime, 'image/')
                ? 'inline'
                : 'inline; filename="' . basename($path) . '"',
        ]);
    }

    public function aboutFamiliaView(Request $request)
    {
        $this->reactView = 'AboutFamilia';

        return parent::reactView($request);
    }

    public function aboutPoliticaView(Request $request)
    {
        $this->reactView = 'AboutPolitica';

        return parent::reactView($request);
    }

    public function contactView(Request $request)
    {
        $this->reactView = 'Contact';

        return parent::reactView($request);
    }

    public function clubView(Request $request)
    {
        $this->reactView = 'Club';

        return parent::reactView($request);
    }

    public function blogView(Request $request)
    {
        $this->reactView = 'Blog';

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

    public function storeClub(Request $request)
    {
        $validated = $request->validate([
            'accepted' => 'accepted',
            'department' => 'required|string|max:120',
            'district' => 'required|string|max:120',
            'dni' => 'required|string|min:8|max:12',
            'email' => 'required|email|max:180',
            'name' => 'required|string|max:120',
            'province' => 'required|string|max:120',
            'specialty' => 'required|string|max:120',
            'ubigeo' => 'required|string|max:12',
        ]);

        if (!$this->hasValidUbigeo($validated)) {
            throw ValidationException::withMessages([
                'district' => 'Selecciona una ubicación válida.',
            ]);
        }

        ClubExpert::create([
            'name' => $validated['name'],
            'dni' => $validated['dni'],
            'email' => $validated['email'],
            'specialty' => $validated['specialty'],
            'department' => $validated['department'],
            'province' => $validated['province'],
            'district' => $validated['district'],
            'ubigeo' => $validated['ubigeo'],
            'accepted_terms' => true,
            ...$this->detectClientTracking($request),
            'seen' => false,
            'status' => true,
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Gracias. Tu solicitud fue registrada correctamente.',
        ]);
    }

    private function hasValidUbigeo(array $data): bool
    {
        $path = storage_path('app/utils/ubigeo-inei.json');
        if (!File::exists($path)) return false;

        $rows = json_decode(File::get($path), true);
        if (!is_array($rows)) return false;

        foreach ($rows as $row) {
            if (
                ($row['code'] ?? null) === $data['ubigeo']
                && ($row['department'] ?? null) === $data['department']
                && ($row['province'] ?? null) === $data['province']
                && ($row['district'] ?? null) === $data['district']
            ) {
                return true;
            }
        }

        return false;
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

    private function normalizeAboutPage(AboutPage $about): array
    {
        $aboutData = $about->toArray();
        $aboutData['family_image_url'] = $about->family_image ? route('about.media', ['path' => $about->family_image]) : null;
        $aboutData['policy_image_url'] = $about->policy_image ? route('about.media', ['path' => $about->policy_image]) : null;
        $aboutData['certifications'] = array_map(function ($item) {
            return [
                'title' => $item['title'] ?? '',
                'description' => $item['description'] ?? '',
                'image_path' => $item['image_path'] ?? null,
                'image_url' => !empty($item['image_path']) ? route('about.media', ['path' => $item['image_path']]) : null,
                'file_path' => $item['file_path'] ?? null,
                'file_url' => !empty($item['file_path']) ? route('about.media', ['path' => $item['file_path']]) : null,
            ];
        }, is_array($aboutData['certifications'] ?? null) ? $aboutData['certifications'] : []);

        return $aboutData;
    }

    private function normalizeBlogPage(BlogPage $blog): array
    {
        $blogData = $blog->toArray();
        $blogData['hero_image_url'] = $blog->hero_image ? route('blog.media', ['path' => $blog->hero_image]) : null;
        $fallbacks = [
            '/assets/img/categories/category-1.png',
            '/assets/img/categories/category-2.png',
            '/assets/img/categories/category-3.png',
            '/assets/img/categories/category-1.png',
            '/assets/img/categories/category-2.png',
            '/assets/img/categories/category-3.png',
        ];

        $posts = is_array($blogData['posts'] ?? null) ? $blogData['posts'] : [];
        $blogData['posts'] = array_map(function ($item, $index) use ($fallbacks) {
            $imagePath = $item['image_path'] ?? null;

            return [
                'category' => $item['category'] ?? '',
                'title' => $item['title'] ?? '',
                'description' => $item['description'] ?? '',
                'image_path' => $imagePath,
                'image_url' => $imagePath ? route('blog.media', ['path' => $imagePath]) : null,
                'image_fallback' => $fallbacks[$index] ?? '/assets/img/categories/category-1.png',
            ];
        }, $posts, array_keys($posts));

        $blogData['most_read'] = array_map(function ($item) {
            return [
                'number' => $item['number'] ?? '',
                'title' => $item['title'] ?? '',
                'category' => $item['category'] ?? '',
            ];
        }, is_array($blogData['most_read'] ?? null) ? $blogData['most_read'] : []);

        return $blogData;
    }
}
