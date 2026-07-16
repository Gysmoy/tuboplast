<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'title',
        'description',
        'image',
        'primary_button_text',
        'primary_button_link',
        'secondary_button_text',
        'secondary_button_link',
        'metric_one_value',
        'metric_one_label',
        'metric_two_value',
        'metric_two_label',
        'sort_order',
        'status',
    ];

    protected $casts = [
        'item_id' => 'integer',
        'sort_order' => 'integer',
        'status' => 'boolean',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
