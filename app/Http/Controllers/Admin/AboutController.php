<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\AboutPage;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AboutController extends BasicController
{
    public $reactView = 'Admin/About';
    public $model = AboutPage::class;

    public function setReactViewProperties(Request $request)
    {
        $about = AboutPage::current();
        $data = $about->toArray();
        $data['family_image_url'] = $about->family_image ? route('about.media', ['path' => $about->family_image]) : null;
        $data['policy_image_url'] = $about->policy_image ? route('about.media', ['path' => $about->policy_image]) : null;
        $data['milestones'] = array_map(function ($item) {
            return [
                'year' => $item['year'] ?? '',
                'title' => $item['title'] ?? '',
                'text' => $item['text'] ?? '',
                'image' => $item['image'] ?? null,
                'image_path' => $item['image_path'] ?? null,
                'image_url' => !empty($item['image_path']) ? route('about.media', ['path' => $item['image_path']]) : null,
            ];
        }, is_array($data['milestones'] ?? null) ? $data['milestones'] : []);

        $data['certifications'] = array_map(function ($item) {
            return [
                'title' => $item['title'] ?? '',
                'description' => $item['description'] ?? '',
                'image_path' => $item['image_path'] ?? null,
                'image_url' => !empty($item['image_path']) ? route('about.media', ['path' => $item['image_path']]) : null,
                'file_path' => $item['file_path'] ?? null,
                'file_url' => !empty($item['file_path']) ? route('about.media', ['path' => $item['file_path']]) : null,
            ];
        }, is_array($data['certifications'] ?? null) ? $data['certifications'] : []);

        return [
            'about' => $data,
        ];
    }

    public function beforeSave(Request $request)
    {
        $validated = $request->validate([
            'family_image_file' => 'nullable|image|max:4096',
            'family_image_existing' => 'nullable|string|max:255',
            'policy_image_file' => 'nullable|image|max:4096',
            'policy_image_existing' => 'nullable|string|max:255',
            'family_hero_display_mode' => 'nullable|in:image_only,image_with_text',
            'family_eyebrow' => 'nullable|string|max:120',
            'family_title' => 'nullable|string|max:255',
            'family_lead' => 'nullable|string|max:2000',
            'family_paragraph_1' => 'nullable|string|max:2000',
            'family_paragraph_2' => 'nullable|string|max:2000',
            'family_metric_value' => 'nullable|string|max:120',
            'family_metric_label' => 'nullable|string|max:120',
            'family_aside_1_title' => 'nullable|string|max:120',
            'family_aside_1_text' => 'nullable|string|max:500',
            'family_aside_2_title' => 'nullable|string|max:120',
            'family_aside_2_text' => 'nullable|string|max:500',
            'mission_eyebrow' => 'nullable|string|max:120',
            'mission_title' => 'nullable|string|max:255',
            'mission_text' => 'nullable|string|max:2000',
            'vision_eyebrow' => 'nullable|string|max:120',
            'vision_title' => 'nullable|string|max:255',
            'vision_text' => 'nullable|string|max:2000',
            'family_values' => 'nullable|array',
            'family_values.*' => 'nullable|string|max:120',
            'milestones' => 'nullable|array',
            'milestones.*.year' => 'nullable|string|max:40',
            'milestones.*.title' => 'nullable|string|max:180',
            'milestones.*.text' => 'nullable|string|max:2000',
            'milestones.*.image' => 'nullable|string|max:255',
            'milestones.*.image_path' => 'nullable|string|max:255',
            'milestones.*.image_file' => 'nullable|image|max:4096',
            'timeline_sort_direction' => 'nullable|in:asc,desc',
            'policy_hero_display_mode' => 'nullable|in:image_only,image_with_text',
            'policy_eyebrow' => 'nullable|string|max:120',
            'policy_title' => 'nullable|string|max:255',
            'policy_scope_eyebrow' => 'nullable|string|max:120',
            'policy_scope_title' => 'nullable|string|max:255',
            'policy_scope_paragraph_1' => 'nullable|string|max:4000',
            'policy_scope_paragraph_2' => 'nullable|string|max:4000',
            'policy_commitment_text' => 'nullable|string|max:1000',
            'policy_certifications_title' => 'nullable|string|max:255',
            'policy_description' => 'nullable|string|max:4000',
            'policy_bullets' => 'nullable|array',
            'policy_bullets.*' => 'nullable|string|max:1000',
            'certifications' => 'nullable|array',
            'certifications.*.title' => 'nullable|string|max:120',
            'certifications.*.description' => 'nullable|string|max:500',
            'certifications.*.image_file' => 'nullable|image|max:4096',
            'certifications.*.file_file' => 'nullable|file|mimes:pdf|max:51200',
            'certifications.*.image_path' => 'nullable|string|max:255',
            'certifications.*.file_path' => 'nullable|string|max:255',
            'certifications.*.file_delete' => 'nullable|boolean',
            'status' => 'nullable',
        ]);

        $current = AboutPage::current();
        $payload = [
            'id' => 1,
            'family_hero_display_mode' => $validated['family_hero_display_mode'] ?? 'image_with_text',
            'family_eyebrow' => $validated['family_eyebrow'] ?? null,
            'family_title' => $validated['family_title'] ?? null,
            'family_lead' => $validated['family_lead'] ?? null,
            'family_paragraph_1' => $validated['family_paragraph_1'] ?? null,
            'family_paragraph_2' => $validated['family_paragraph_2'] ?? null,
            'family_metric_value' => $validated['family_metric_value'] ?? null,
            'family_metric_label' => $validated['family_metric_label'] ?? null,
            'family_aside_1_title' => $validated['family_aside_1_title'] ?? null,
            'family_aside_1_text' => $validated['family_aside_1_text'] ?? null,
            'family_aside_2_title' => $validated['family_aside_2_title'] ?? null,
            'family_aside_2_text' => $validated['family_aside_2_text'] ?? null,
            'mission_eyebrow' => $validated['mission_eyebrow'] ?? null,
            'mission_title' => $validated['mission_title'] ?? null,
            'mission_text' => $validated['mission_text'] ?? null,
            'vision_eyebrow' => $validated['vision_eyebrow'] ?? null,
            'vision_title' => $validated['vision_title'] ?? null,
            'vision_text' => $validated['vision_text'] ?? null,
            'family_values' => array_values(array_filter($validated['family_values'] ?? [], fn ($item) => filled($item))),
            'milestones' => [],
            'timeline_sort_direction' => $validated['timeline_sort_direction'] ?? 'asc',
            'policy_hero_display_mode' => $validated['policy_hero_display_mode'] ?? 'image_with_text',
            'policy_eyebrow' => $validated['policy_eyebrow'] ?? null,
            'policy_title' => $validated['policy_title'] ?? null,
            'policy_scope_eyebrow' => $validated['policy_scope_eyebrow'] ?? null,
            'policy_scope_title' => $validated['policy_scope_title'] ?? null,
            'policy_scope_paragraph_1' => $validated['policy_scope_paragraph_1'] ?? null,
            'policy_scope_paragraph_2' => $validated['policy_scope_paragraph_2'] ?? null,
            'policy_commitment_text' => $validated['policy_commitment_text'] ?? null,
            'policy_certifications_title' => $validated['policy_certifications_title'] ?? null,
            'policy_description' => $validated['policy_description'] ?? null,
            'policy_bullets' => array_values(array_filter($validated['policy_bullets'] ?? [], fn ($item) => filled($item))),
            'certifications' => [],
            'status' => in_array($validated['status'] ?? true, [true, 'true', 1, '1', 'on'], true),
        ];

        $payload['family_image'] = $current->family_image ?? null;
        if ($request->hasFile('family_image_file')) {
            $payload['family_image'] = $this->storePublicFile($request->file('family_image_file'), 'about/family');
        } else {
            $payload['family_image'] = $validated['family_image_existing'] ?? $current->family_image ?? null;
        }

        $payload['policy_image'] = $current->policy_image ?? null;
        if ($request->hasFile('policy_image_file')) {
            $payload['policy_image'] = $this->storePublicFile($request->file('policy_image_file'), 'about/policy');
        } else {
            $payload['policy_image'] = $validated['policy_image_existing'] ?? $current->policy_image ?? null;
        }

        $milestones = $validated['milestones'] ?? [];
        $currentMilestones = is_array($current->milestones ?? null) ? $current->milestones : [];
        $normalizedMilestones = [];

        foreach ($milestones as $index => $milestone) {
            $existing = $currentMilestones[$index] ?? [];
            $imagePath = $milestone['image_path'] ?? ($existing['image_path'] ?? null);
            $assetImage = $milestone['image'] ?? ($existing['image'] ?? null);

            if ($request->hasFile("milestones.$index.image_file")) {
                $this->deletePublicFile($milestone['image_path'] ?? ($existing['image_path'] ?? null));
                $imagePath = $this->storePublicFile($request->file("milestones.$index.image_file"), 'about/timeline');
                $assetImage = null;
            }

            if (!filled($milestone['year'] ?? null) && !filled($milestone['title'] ?? null) && !filled($milestone['text'] ?? null)) {
                continue;
            }

            $normalizedMilestones[] = [
                'year' => $milestone['year'] ?? '',
                'title' => $milestone['title'] ?? '',
                'text' => $milestone['text'] ?? '',
                'image' => $assetImage,
                'image_path' => $imagePath,
            ];
        }

        usort($normalizedMilestones, fn ($a, $b) => (int) $a['year'] <=> (int) $b['year']);
        if (($payload['timeline_sort_direction'] ?? 'asc') === 'desc') {
            $normalizedMilestones = array_reverse($normalizedMilestones);
        }
        $payload['milestones'] = $normalizedMilestones;

        $certifications = $validated['certifications'] ?? [];
        $currentCertifications = is_array($current->certifications ?? null) ? $current->certifications : [];
        $normalizedCertifications = [];

        foreach ($certifications as $index => $certification) {
            $existing = $currentCertifications[$index] ?? [];
            $imagePath = $certification['image_path'] ?? ($existing['image_path'] ?? null);
            $filePath = $certification['file_path'] ?? ($existing['file_path'] ?? null);
            $deletePdf = filter_var($certification['file_delete'] ?? false, FILTER_VALIDATE_BOOLEAN);

            if ($request->hasFile("certifications.$index.image_file")) {
                $this->deletePublicFile($existing['image_path'] ?? null);
                $imagePath = $this->storePublicFile($request->file("certifications.$index.image_file"), 'about/certifications/images');
            }

            if ($request->hasFile("certifications.$index.file_file")) {
                $this->deletePublicFile($existing['file_path'] ?? null);
                $filePath = $this->storePublicFile($request->file("certifications.$index.file_file"), 'about/certifications/files');
            } elseif ($deletePdf) {
                $this->deletePublicFile($existing['file_path'] ?? null);
                $filePath = null;
            }

            $normalizedCertifications[] = [
                'title' => $certification['title'] ?? ($existing['title'] ?? ''),
                'description' => $certification['description'] ?? ($existing['description'] ?? ''),
                'image_path' => $imagePath,
                'file_path' => $filePath,
            ];
        }

        $payload['certifications'] = $normalizedCertifications;

        return $payload;
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = new \SoDe\Extend\Response();

        try {
            $body = $this->beforeSave($request);
            $jpa = AboutPage::query()->updateOrCreate(['id' => $body['id']], $body);

            $data = $jpa->toArray();
            $data['family_image_url'] = $jpa->family_image ? route('about.media', ['path' => $jpa->family_image]) : null;
            $data['policy_image_url'] = $jpa->policy_image ? route('about.media', ['path' => $jpa->policy_image]) : null;
            $data['milestones'] = array_map(function ($item) {
                return [
                    'year' => $item['year'] ?? '',
                    'title' => $item['title'] ?? '',
                    'text' => $item['text'] ?? '',
                    'image' => $item['image'] ?? null,
                    'image_path' => $item['image_path'] ?? null,
                    'image_url' => !empty($item['image_path']) ? route('about.media', ['path' => $item['image_path']]) : null,
                ];
            }, is_array($data['milestones'] ?? null) ? $data['milestones'] : []);
            $data['certifications'] = array_map(function ($item) {
                return [
                    'title' => $item['title'] ?? '',
                    'description' => $item['description'] ?? '',
                    'image_path' => $item['image_path'] ?? null,
                    'image_url' => !empty($item['image_path']) ? route('about.media', ['path' => $item['image_path']]) : null,
                    'file_path' => $item['file_path'] ?? null,
                    'file_url' => !empty($item['file_path']) ? route('about.media', ['path' => $item['file_path']]) : null,
                ];
            }, is_array($data['certifications'] ?? null) ? $data['certifications'] : []);

            $response->status = 200;
            $response->message = 'Operacion correcta';
            $response->data = $data;
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response($response->toArray(), $response->status);
        }
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
        if (!$path) return;
        Storage::disk('public')->delete($path);
    }
}
