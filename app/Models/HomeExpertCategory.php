<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomeExpertCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_segment_id',
        'title',
        'image',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'status' => 'boolean',
    ];

    public function productSegment()
    {
        return $this->belongsTo(ProductSegment::class);
    }
}

