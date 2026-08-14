<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DistributorRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'business',
        'name',
        'email',
        'celular',
        'ruc',
        'service',
        'department',
        'province',
        'district',
        'ubigeo',
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
        'seen' => 'boolean',
        'status' => 'boolean',
    ];
}
