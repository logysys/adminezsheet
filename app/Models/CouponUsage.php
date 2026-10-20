<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Exception;

class CouponUsage extends Model
{
    use HasFactory;

    protected $table = 'coupon_usages';

    protected $fillable = [
        'coupon_id',
        'user_id',
        'coupon_code',
        'used_at',
    ];

    protected $casts = [
        'used_at' => 'datetime',
    ];

    /**
     * Get the coupon that was used
     */
    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class, 'coupon_id');
    }

    /**
     * Get the user who used the coupon
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(Userlist::class, 'user_id');
    }

    /**
     * Check if a user has already used a specific coupon
     */
    public static function isCouponUsedByUser(int $couponId, int $userId): bool
    {
        return self::where('coupon_id', $couponId)
            ->where('user_id', $userId)
            ->exists();
    }

    /**
     * Get usage count for a coupon
     */
    public static function getUsageCount(int $couponId): int
    {
        return self::where('coupon_id', $couponId)->count();
    }

    /**
     * Check if coupon is still available (respects use_limit)
     */
    public static function isCouponAvailable($coupon): bool
    {
        if (!$coupon || $coupon->status !== 'Active') {
            return false;
        }

        // If coupon has unlimited usage
        if ($coupon->limit_type === 'unlimited') {
            return true;
        }

        // Check if usage limit is reached
        $usageCount = self::getUsageCount($coupon->id);
        return $usageCount < $coupon->use_limit;
    }

    /**
     * Check if user can use a specific coupon
     */
    public static function canUserUseCoupon($coupon, int $userId): bool
    {
        if (!$coupon || $coupon->status !== 'Active') {
            return false;
        }

        // Check if user already used this coupon
        if (self::isCouponUsedByUser($coupon->id, $userId)) {
            return false;
        }

        // Check overall availability
        return self::isCouponAvailable($coupon);
    }

    /**
     * Record a coupon usage
     */
    public static function recordUsage($coupon, int $userId): self
    {
        if (!self::canUserUseCoupon($coupon, $userId)) {
            throw new Exception('Coupon cannot be used');
        }

        return self::create([
            'coupon_id' => $coupon->id,
            'user_id' => $userId,
            'coupon_code' => $coupon->coupon,
            'used_at' => now(),
        ]);
    }

    /**
     * Scope a query to only include usages within date range
     */
    public function scopeDateBetween($query, $from, $to)
    {
        if ($from) {
            $query->whereDate('used_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('used_at', '<=', $to);
        }
        return $query;
    }

    /**
     * Scope a query to only include usages for specific coupon
     */
    public function scopeForCoupon($query, $couponId)
    {
        if ($couponId) {
            $query->where('coupon_id', $couponId);
        }
        return $query;
    }

    /**
     * Scope a query to only include usages for specific user
     */
    public function scopeForUser($query, $userId)
    {
        if ($userId) {
            $query->where('user_id', $userId);
        }
        return $query;
    }
}