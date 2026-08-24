<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Distribuidor extends Model
{
    use HasFactory;

    protected $table = 'distribuidores';

    protected $fillable = [
        'name',
        'ruc',
        'department',
        'province',
        'district',
        'ubigeo',
        'address',
        'reference',
        'phone',
        'phone_prefix',
        'business_hours',
        'featured',
        'distributor_type',
        'latitude',
        'longitude',
        'status',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'status' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];
}
