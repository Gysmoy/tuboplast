<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends BasicController
{
    public $reactView = 'Admin/Projects';
    public $model = Project::class;
    public $imageFields = ['image'];
    public $useIntervention = false;

    public function beforeSave(Request $request)
    {
        $body = $request->all();

        if (array_key_exists('status', $body)) {
            $body['status'] = in_array($body['status'], [true, 'true', 1, '1', 'on'], true) ? 1 : 0;
        } else {
            $body['status'] = 1;
        }

        return $body;
    }
}
