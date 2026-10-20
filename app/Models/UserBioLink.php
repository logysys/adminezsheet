<?php
// app/Models/UserBioLink.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBioLink extends Model
{
    use HasFactory;
    
    protected $fillable = ['platform_user_id', 'title', 'url', 'type', 'position'];
    
    public function user()
    {
        return $this->belongsTo(PlatformUser::class, 'platform_user_id');
    }
}