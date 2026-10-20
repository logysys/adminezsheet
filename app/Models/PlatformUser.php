<?php
// app/Models/PlatformUser.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformUser extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'platform', 'username', 'profile_url', 'display_name', 
        'bio', 'avatar_url', 'follower_count', 'last_crawled_at'
    ];
    
    protected $casts = [
        'last_crawled_at' => 'datetime',
        'follower_count' => 'integer',
    ];
    
    public function bioLinks()
    {
        return $this->hasMany(UserBioLink::class, 'platform_user_id');
    }
}