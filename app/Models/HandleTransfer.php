<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HandleTransfer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'recipient_id',
        'token',
        'handle_type', // 'custom' or 'domain'
        'handle_id',
        'handle_name',
        'used',
        'expires_at',
        'transferred_at'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'transferred_at' => 'datetime',
        'used' => 'boolean'
    ];

    public function sender()
    {
        return $this->belongsTo(Userlist::class, 'user_id');
    }

    public function recipient()
    {
        return $this->belongsTo(Userlist::class, 'recipient_id');
    }

    public function handle()
{
    if ($this->handle_type === 'custom') {
        return $this->belongsTo(Customdomain::class, 'handle_id');
    }
    return $this->belongsTo(Domain::class, 'handle_id');
}

    public function getStatusAttribute()
    {
        if ($this->used) {
            return 'completed';
        }

        if ($this->expires_at && $this->expires_at->isPast()) {
            return 'expired';
        }

        return 'pending';
    }
}