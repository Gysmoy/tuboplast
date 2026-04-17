<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Distribuidor extends Model
{
    use HasFactory;

    protected $table = 'distribuidores';

    protected $fillable = [
        'department',
        'province',
        'district',
        'ubigeo',
        'address',
        'reference',
        'latitude',
        'longitude',
        'status',
    ];
}

