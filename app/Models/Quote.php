<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'business',
        'ruc',
        'email',
        'phone',
        'phone_prefix',
        'region',
        'department',
        'province',
        'district',
        'ubigeo',
        'accepted_terms',
        'items',
        'total_items',
        'quote_status',
        'archived_reason',
        'ip_address',
        'browser',
        'device_type',
        'operating_system',
        'user_agent',
        'seen',
        'status',
    ];

    protected $casts = [
        'items' => 'array',
        'accepted_terms' => 'boolean',
        'seen' => 'boolean',
        'status' => 'boolean',
    ];
}
