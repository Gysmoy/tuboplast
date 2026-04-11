<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'short_description',
        'image',
        'link',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}
