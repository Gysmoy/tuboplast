<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductClassification extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'status'];

    protected $casts = ['status' => 'boolean'];
}
