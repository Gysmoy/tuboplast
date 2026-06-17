<?php

namespace App\Http\Controllers;

use App\Models\BlogPage;
use App\Models\Item;
use Illuminate\Support\Str;

class SitemapController extends Controller
{
    public function index()
    {
        $urls = [];

        $static = [
            ['/', '1.0', 'weekly'],
            [route('catalog'), '0.9', 'daily'],
            [route('blog'), '0.7', 'weekly'],
            [route('about'), '0.6', 'monthly'],
            [route('about.politica'), '0.5', 'monthly'],
            [route('distributors'), '0.6', 'monthly'],
            [route('contact'), '0.5', 'monthly'],
            [route('club'), '0.5', 'monthly'],
        ];

        foreach ($static as [$loc, $priority, $freq]) {
            $urls[] = [
                'loc' => Str::startsWith($loc, 'http') ? $loc : url($loc),
                'priority' => $priority,
                'changefreq' => $freq,
                'lastmod' => null,
            ];
        }

        Item::query()
            ->where('status', true)
            ->whereNotNull('slug')
            ->get(['slug', 'updated_at'])
            ->each(function ($item) use (&$urls) {
                $urls[] = [
                    'loc' => route('products.show', ['slug' => $item->slug]),
                    'priority' => '0.8',
                    'changefreq' => 'weekly',
                    'lastmod' => optional($item->updated_at)->toAtomString(),
                ];
            });

        $blog = BlogPage::current();
        $posts = is_array($blog->posts ?? null) ? $blog->posts : [];
        foreach ($posts as $index => $post) {
            $slug = $this->blogPostSlug($post['slug'] ?? ($post['title'] ?? 'post'), $index);
            $urls[] = [
                'loc' => route('blog.post', ['slug' => $slug]),
                'priority' => '0.6',
                'changefreq' => 'monthly',
                'lastmod' => optional($blog->updated_at)->toAtomString(),
            ];
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
        foreach ($urls as $url) {
            $xml .= "  <url>\n";
            $xml .= '    <loc>' . e($url['loc']) . "</loc>\n";
            if (!empty($url['lastmod'])) {
                $xml .= '    <lastmod>' . $url['lastmod'] . "</lastmod>\n";
            }
            $xml .= '    <changefreq>' . $url['changefreq'] . "</changefreq>\n";
            $xml .= '    <priority>' . $url['priority'] . "</priority>\n";
            $xml .= "  </url>\n";
        }
        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=UTF-8']);
    }

    public function robots()
    {
        $lines = [
            'User-agent: *',
            'Allow: /',
            'Disallow: /admin',
            'Disallow: /login',
            'Disallow: /api',
            '',
            'Sitemap: ' . url('/sitemap.xml'),
        ];

        return response(implode("\n", $lines) . "\n", 200, ['Content-Type' => 'text/plain; charset=UTF-8']);
    }

    private function blogPostSlug(string $value, int $index): string
    {
        $base = trim(Str::slug($value) ?: 'post', '-');

        if (preg_match('/-\d+$/', $base)) {
            return $base;
        }

        return $base . '-' . ($index + 1);
    }
}
