<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSegment extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'description', 'image', 'featured', 'featured_order', 'status'];

    protected $casts = [
        'featured' => 'boolean',
        'featured_order' => 'integer',
        'status' => 'boolean',
    ];

    public function items()
    {
        return $this->belongsToMany(Item::class, 'item_product_segment')->withTimestamps();
    }
}
