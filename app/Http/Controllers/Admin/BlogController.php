<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\BlogPage;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends BasicController
{
    public $reactView = 'Admin/Blog';
    public $model = BlogPage::class;

    public function setReactViewProperties(Request $request)
    {
        return [
            'blog' => $this->normalizeBlogPage(BlogPage::current()),
        ];
    }

    public function beforeSave(Request $request)
    {
        $validated = $request->validate([
            'hero_image_file' => 'nullable|image|max:4096',
            'hero_image_existing' => 'nullable|string|max:255',
            'hero_display_mode' => 'nullable|in:image_only,image_with_text',
            'hero_badge' => 'nullable|string|max:120',
            'hero_title' => 'nullable|string|max:255',
            'hero_description' => 'nullable|string|max:2000',
            'section_title' => 'nullable|string|max:255',
            'newsletter_eyebrow' => 'nullable|string|max:120',
            'newsletter_title' => 'nullable|string|max:255',
            'newsletter_description' => 'nullable|string|max:2000',
            'newsletter_placeholder' => 'nullable|string|max:120',
            'newsletter_button_label' => 'nullable|string|max:120',
            'posts' => 'nullable|array',
            'posts.*.slug' => 'nullable|string|max:255',
            'posts.*.category' => 'nullable|string|max:120',
            'posts.*.title' => 'nullable|string|max:255',
            'posts.*.description' => 'nullable|string|max:2000',
            'posts.*.eyebrow' => 'nullable|string|max:120',
            'posts.*.author' => 'nullable|string|max:120',
            'posts.*.role' => 'nullable|string|max:120',
            'posts.*.published' => 'nullable|string|max:120',
            'posts.*.read_time' => 'nullable|string|max:120',
            'posts.*.lead' => 'nullable|string|max:2000',
            'posts.*.content_html' => 'nullable|string',
            'posts.*.highlight_label' => 'nullable|string|max:120',
            'posts.*.highlight' => 'nullable|string|max:2000',
            'posts.*.image_file' => 'nullable|image|max:4096',
            'posts.*.image_path' => 'nullable|string|max:255',
            'most_read' => 'nullable|array',
            'most_read.*.number' => 'nullable|string|max:12',
            'most_read.*.title' => 'nullable|string|max:255',
            'most_read.*.category' => 'nullable|string|max:120',
            'status' => 'nullable',
        ]);

        $current = BlogPage::current();

        $payload = [
            'id' => 1,
            'hero_display_mode' => $validated['hero_display_mode'] ?? 'image_only',
            'hero_badge' => $validated['hero_badge'] ?? null,
            'hero_title' => $validated['hero_title'] ?? null,
            'hero_description' => $validated['hero_description'] ?? null,
            'section_title' => $validated['section_title'] ?? null,
            'newsletter_eyebrow' => $validated['newsletter_eyebrow'] ?? null,
            'newsletter_title' => $validated['newsletter_title'] ?? null,
            'newsletter_description' => $validated['newsletter_description'] ?? null,
            'newsletter_placeholder' => $validated['newsletter_placeholder'] ?? null,
            'newsletter_button_label' => $validated['newsletter_button_label'] ?? null,
            'posts' => [],
            'most_read' => [],
            'status' => in_array($validated['status'] ?? true, [true, 'true', 1, '1', 'on'], true),
        ];

        $payload['hero_image'] = $current->hero_image ?? null;
        if ($request->hasFile('hero_image_file')) {
            $this->deletePublicFile($current->hero_image ?? null);
            $payload['hero_image'] = $this->storePublicFile($request->file('hero_image_file'), 'blog/hero');
        } else {
            $payload['hero_image'] = $validated['hero_image_existing'] ?? $current->hero_image ?? null;
        }

        $currentPosts = is_array($current->posts ?? null) ? $current->posts : [];
        $posts = $validated['posts'] ?? [];
        foreach ($posts as $index => $post) {
            $existing = $currentPosts[$index] ?? [];
            $imagePath = $post['image_path'] ?? ($existing['image_path'] ?? null);
            $slugBase = $post['slug'] ?? ($existing['slug'] ?? ($post['title'] ?? ($existing['title'] ?? 'post')));
            $slug = $this->blogPostSlug($slugBase, $index);

            if ($request->hasFile("posts.$index.image_file")) {
                $this->deletePublicFile($existing['image_path'] ?? null);
                $imagePath = $this->storePublicFile($request->file("posts.$index.image_file"), 'blog/posts');
            }

            $payload['posts'][] = [
                'slug' => $slug,
                'category' => $post['category'] ?? ($existing['category'] ?? ''),
                'title' => $post['title'] ?? ($existing['title'] ?? ''),
                'description' => $post['description'] ?? ($existing['description'] ?? ''),
                'eyebrow' => $post['eyebrow'] ?? ($existing['eyebrow'] ?? ''),
                'author' => $post['author'] ?? ($existing['author'] ?? ''),
                'role' => $post['role'] ?? ($existing['role'] ?? ''),
                'published' => $post['published'] ?? ($existing['published'] ?? ''),
                'read_time' => $post['read_time'] ?? ($existing['read_time'] ?? ''),
                'lead' => $post['lead'] ?? ($existing['lead'] ?? ''),
                'content_html' => $post['content_html'] ?? ($existing['content_html'] ?? ''),
                'highlight_label' => $post['highlight_label'] ?? ($existing['highlight_label'] ?? ''),
                'highlight' => $post['highlight'] ?? ($existing['highlight'] ?? ''),
                'image_path' => $imagePath,
            ];
        }

        $currentMostRead = is_array($current->most_read ?? null) ? $current->most_read : [];
        $mostRead = $validated['most_read'] ?? [];
        foreach ($mostRead as $index => $item) {
            $existing = $currentMostRead[$index] ?? [];
            $payload['most_read'][] = [
                'number' => $item['number'] ?? ($existing['number'] ?? ''),
                'title' => $item['title'] ?? ($existing['title'] ?? ''),
                'category' => $item['category'] ?? ($existing['category'] ?? ''),
            ];
        }

        return $payload;
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = new \SoDe\Extend\Response();

        try {
            $body = $this->beforeSave($request);
            $jpa = BlogPage::query()->updateOrCreate(['id' => $body['id']], $body);

            $response->status = 200;
            $response->message = 'Operación correcta';
            $response->data = $this->normalizeBlogPage($jpa);
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
    }

    private function normalizeBlogPage(BlogPage $blog): array
    {
        $data = $blog->toArray();
        $data['hero_image_url'] = $blog->hero_image ? route('blog.media', ['path' => $blog->hero_image]) : null;
        $data['posts'] = array_map(function ($item, $index) {
            $fallbacks = [
                '/assets/img/categories/category-1.png',
                '/assets/img/categories/category-2.png',
                '/assets/img/categories/category-3.png',
                '/assets/img/categories/category-1.png',
                '/assets/img/categories/category-2.png',
                '/assets/img/categories/category-3.png',
            ];

            $imagePath = $item['image_path'] ?? null;
            $slug = $this->blogPostSlug($item['slug'] ?? ($item['title'] ?? 'post'), $index);
            return [
                'slug' => $slug,
                'detail_url' => route('blog.post', ['slug' => $slug]),
                'category' => $item['category'] ?? '',
                'title' => $item['title'] ?? '',
                'description' => $item['description'] ?? '',
                'eyebrow' => $item['eyebrow'] ?? '',
                'author' => $item['author'] ?? '',
                'role' => $item['role'] ?? '',
                'published' => $item['published'] ?? '',
                'read_time' => $item['read_time'] ?? '',
                'lead' => $item['lead'] ?? '',
                'content_html' => $item['content_html'] ?? '',
                'highlight_label' => $item['highlight_label'] ?? '',
                'highlight' => $item['highlight'] ?? '',
                'image_path' => $imagePath,
                'image_url' => $imagePath ? route('blog.media', ['path' => $imagePath]) : null,
                'image_fallback' => $fallbacks[$index] ?? '/assets/img/categories/category-1.png',
            ];
        }, is_array($data['posts'] ?? null) ? $data['posts'] : [], array_keys(is_array($data['posts'] ?? null) ? $data['posts'] : []));

        $data['most_read'] = array_map(function ($item) {
            return [
                'number' => $item['number'] ?? '',
                'title' => $item['title'] ?? '',
                'category' => $item['category'] ?? '',
            ];
        }, is_array($data['most_read'] ?? null) ? $data['most_read'] : []);

        return $data;
    }

    private function blogPostSlug(string $value, int $index): string
    {
        $base = trim(Str::slug($value) ?: 'post', '-');

        if (preg_match('/-\d+$/', $base)) {
            return $base;
        }

        return $base . '-' . ($index + 1);
    }

    private function storePublicFile($file, string $directory): string
    {
        $ext = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'bin');
        $filename = sprintf('%s-%s.%s', Str::uuid()->toString(), time(), $ext);
        Storage::disk('public')->putFileAs($directory, $file, $filename);

        return "{$directory}/{$filename}";
    }

    private function deletePublicFile(?string $path): void
    {
        if (!$path) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
