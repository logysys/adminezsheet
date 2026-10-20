<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PriceHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'price_per_point',
        'effective_from',
        'set_by_admin',
        'notes'
    ];

    public function admin()
    {
        return $this->belongsTo(User::class, 'set_by_admin');
    }
}