<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'product_segment_id',
        'product_line_id',
        'product_classification_id',
        'product_type_id',
        'segment',
        'classification',
        'famcons',
        'family',
        'type',
        'use_type',
        'material',
        'color',
        'brand',
        'unit',
        'masterpack',
        'pieces',
        'origin_country',
        'sku',
        'slug',
        'title',
        'description',
        'image',
        'price',
        'currency',
        'pressure',
        'diameter',
        'nominal_diameter',
        'diameters',
        'package_type',
        'perishable',
        'hazardous',
        'product_height',
        'product_width',
        'product_depth',
        'product_weight',
        'logistic_height',
        'logistic_width',
        'logistic_depth',
        'logistic_weight',
        'warranty',
        'features',
        'usage_recommendations',
        'observations',
        'usage_warning',
        'source_url',
        'status',
        'views',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'diameters' => 'array',
        'masterpack' => 'integer',
        'status' => 'boolean',
        'views' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function productSegment()
    {
        return $this->belongsTo(ProductSegment::class);
    }

    public function productSegments()
    {
        return $this->belongsToMany(ProductSegment::class, 'item_product_segment')->withTimestamps();
    }

    public function productLine()
    {
        return $this->belongsTo(ProductLine::class);
    }

    public function productClassification()
    {
        return $this->belongsTo(ProductClassification::class);
    }

    public function productType()
    {
        return $this->belongsTo(ProductType::class);
    }
}
