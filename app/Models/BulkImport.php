<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulkImport extends Model
{
    protected $fillable = [
        'type',
        'mode',
        'status',
        'file_path',
        'images_zip_path',
        'sheets_zip_path',
        'message',
        'result',
    ];

    protected $casts = [
        'result' => 'array',
    ];
}
