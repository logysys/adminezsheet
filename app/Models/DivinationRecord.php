<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DivinationRecord extends Model
{
    use HasFactory;
    
    protected $table = 'divination_records';
    
    protected $fillable = [
        'character',
        'structure',
        'fortune',
        'luck_level',
        'ai_source',
        'cost_data',
        'response_time_ms',
        'is_favorite',
        'user_id'  // Add this if you have user authentication
    ];
    
    protected $casts = [
        'cost_data' => 'array',
        'is_favorite' => 'boolean',
        'response_time_ms' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Scopes
    public function scopeFavorites($query)
    {
        return $query->where('is_favorite', true);
    }
    
    public function scopeByCharacter($query, $char)
    {
        return $query->where('character', $char);
    }
    
    public function scopeByAiSource($query, $source)
    {
        return $query->where('ai_source', $source);
    }
    
    public function scopeLuckLevel($query, $level)
    {
        return $query->where('luck_level', 'like', "%{$level}%");
    }
    
    // Accessors
    public function getFormattedCostAttribute()
    {
        $cost = $this->cost_data['total_cost'] ?? 0;
        return '$' . number_format($cost, 6);
    }
    
    public function getShortFortuneAttribute()
    {
        return mb_substr($this->fortune, 0, 50) . (mb_strlen($this->fortune) > 50 ? '...' : '');
    }
}