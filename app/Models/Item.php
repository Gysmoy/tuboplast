<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'segment',
        'classification',
        'type',
        'sku',
        'slug',
        'title',
        'description',
        'image',
        'price',
        'pressure',
        'diameter',
        'diameters',
        'source_url',
        'status',
        'views',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'diameters' => 'array',
        'status' => 'boolean',
        'views' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
