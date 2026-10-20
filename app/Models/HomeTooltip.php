<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Cache;

class HomeTooltip extends Model
{
    use HasFactory;

    protected $table = 'hometooltips';

    protected $fillable = [
        'key',
        'group',
        'content',
        'fallback',
        'type',
        'metadata',
        'is_active',
        'sort_order'
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    // Cache duration in seconds (24 hours)
    const CACHE_DURATION = 86400;
    const CACHE_PREFIX = 'hometooltips_';

    /**
     * Get tooltip by key with caching
     */
    public static function getByKey(string $key, ?string $fallback = null): ?string
    {
        $cacheKey = self::CACHE_PREFIX . $key;
        
        $tooltip = Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($key) {
            return self::where('key', $key)
                ->where('is_active', true)
                ->first();
        });

        if ($tooltip) {
            return $tooltip->content;
        }

        return $fallback ?? $key;
    }

    /**
     * Get all tooltips by group
     */
    public static function getByGroup(string $group, ?string $type = null): array
    {
        $cacheKey = self::CACHE_PREFIX . "group_{$group}_" . ($type ?? 'all');
        
        return Cache::remember($cacheKey, self::CACHE_DURATION, function () use ($group, $type) {
            $query = self::where('group', $group)
                ->where('is_active', true)
                ->orderBy('sort_order');
            
            if ($type) {
                $query->where('type', $type);
            }
            
            return $query->get()->pluck('content', 'key')->toArray();
        });
    }

    /**
     * Get all placeholders
     */
    public static function getAllPlaceholders(): array
    {
        return self::getByGroup('placeholders', 'placeholder');
    }

    /**
     * Get all tooltips
     */
    public static function getAllTooltips(): array
    {
        return self::where('type', 'tooltip')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->pluck('content', 'key')
            ->toArray();
    }

    /**
     * Get all tooltips and placeholders for frontend
     */
    public static function getFrontendData(): array
    {
        return [
            'tooltips' => self::getAllTooltips(),
            'placeholders' => self::getAllPlaceholders()
        ];
    }

    /**
     * Clear cache for a specific key
     */
    public static function clearCache(string $key): void
    {
        Cache::forget(self::CACHE_PREFIX . $key);
        
        // Clear group caches
        $groups = self::distinct('group')->pluck('group');
        foreach ($groups as $group) {
            Cache::forget(self::CACHE_PREFIX . "group_{$group}_all");
            Cache::forget(self::CACHE_PREFIX . "group_{$group}_tooltip");
            Cache::forget(self::CACHE_PREFIX . "group_{$group}_placeholder");
        }
    }

    /**
     * Clear all tooltip cache
     */
    public static function clearAllCache(): void
    {
        $keys = Cache::get('hometooltips_keys', []);
        foreach ($keys as $key) {
            Cache::forget(self::CACHE_PREFIX . $key);
        }
        Cache::forget('hometooltips_keys');
        
        // Clear pattern-based cache keys
        $groups = self::distinct('group')->pluck('group');
        foreach ($groups as $group) {
            Cache::forget(self::CACHE_PREFIX . "group_{$group}_all");
            Cache::forget(self::CACHE_PREFIX . "group_{$group}_tooltip");
            Cache::forget(self::CACHE_PREFIX . "group_{$group}_placeholder");
        }
    }

    /**
     * Get available groups for filtering
     */
    public static function getAvailableGroups(): array
    {
        return self::distinct('group')
            ->orderBy('group')
            ->pluck('group')
            ->toArray();
    }

    /**
     * Get available types
     */
    public static function getAvailableTypes(): array
    {
        return ['tooltip', 'placeholder', 'label'];
    }

    /**
     * Boot the model
     */
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($tooltip) {
            $tooltip->clearCache($tooltip->key);
            
            // Store key in cache for bulk clearing
            $keys = Cache::get('hometooltips_keys', []);
            if (!in_array($tooltip->key, $keys)) {
                $keys[] = $tooltip->key;
                Cache::put('hometooltips_keys', $keys, self::CACHE_DURATION);
            }
        });

        static::deleted(function ($tooltip) {
            $tooltip->clearCache($tooltip->key);
        });
    }
}