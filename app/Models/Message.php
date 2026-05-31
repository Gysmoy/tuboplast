<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'business',
        'name',
        'email',
        'service',
        'source',
        'message',
        'ip_address',
        'browser',
        'device_type',
        'operating_system',
        'user_agent',
        'seen',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
        'seen' => 'boolean',
    ];
}
