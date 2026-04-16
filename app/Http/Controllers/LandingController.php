<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Project;
use Illuminate\Http\Request;

class LandingController extends BasicController
{
    public $reactView = 'Home';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        return [
            'projects' => Project::query()
                ->where('status', true)
                ->latest('id')
                ->get()
                ->map(fn (Project $project) => [
                    'id' => $project->id,
                    'name' => $project->name,
                    'short_description' => $project->short_description,
                    'image' => '/api/projects/media/' . $project->image,
                    'link' => $project->link,
                ])
                ->values(),
            'token' => csrf_token(),
        ];
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
