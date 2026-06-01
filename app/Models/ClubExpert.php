<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClubExpert extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'dni',
        'email',
        'specialty',
        'department',
        'province',
        'district',
        'ubigeo',
        'accepted_terms',
        'ip_address',
        'browser',
        'device_type',
        'operating_system',
        'user_agent',
        'seen',
        'status',
    ];

    protected $casts = [
        'accepted_terms' => 'boolean',
        'seen' => 'boolean',
        'status' => 'boolean',
    ];
}
