<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplyAdjustment extends Model
{
    use HasFactory;

    protected $fillable = [
        'previous_supply',
        'new_supply',
        'adjustment_type',
        'percentage_change',
        'executed_by',
        'notes'
    ];

    public function executor()
    {
        return $this->belongsTo(User::class, 'executed_by');
    }
}