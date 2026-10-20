<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EzFunnelField extends Model
{
    use HasFactory;

    protected $fillable = [
        'ez_funnel_id',
        'emoji_marker',
        'font_size',
        'caption',
        'url',
		'orignal_url',
        'pinned',
        'position'
    ];
}