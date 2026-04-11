<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'business',
        'name',
        'email',
        'phone_prefix',
        'phone',
        'service',
        'source',
        'message',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];
}
