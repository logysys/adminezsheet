<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Setting extends Model
{
    use HasFactory;

    protected $table = 'settings';

    public $timestamps = true;

    protected $fillable = [
        'scraping',
        'mode',
        'social',
        'widget',
        'slidget',
        'webring',
        'flysign',
        'hours',
        'minutes',
        'scrapingurl',
        'scrapingtip_en',
        'scrapingtip_cn',
        'scrapingtip_hindi',
        'set',
        'flycustom',
        'flydefault',
        'color',
        'customcolor',
        'domaincolor',
        'lockday',
        'sitemapupdate',
        'sitemapcustom',
        'sitemapdomain',
        'mailuid',
        'mailuidjunk',
        'up',
        'down',
        'handlelimit',
        'signupbonus',
        'default_coupon_code',
    ];

    protected $casts = [
        'scraping' => 'string',
        'mode' => 'string',
        'social' => 'string',
        'widget' => 'string',
        'slidget' => 'string',
        'webring' => 'string',
        'flysign' => 'string',
        'hours' => 'integer',
        'minutes' => 'integer',
        'lockday' => 'integer',
        'sitemapupdate' => 'integer',
        'sitemapcustom' => 'integer',
        'sitemapdomain' => 'integer',
        'handlelimit' => 'integer',
        'signupbonus' => 'integer',
        'default_coupon_code' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get scrapingurl as array (JSON decode)
     */
    protected function scrapingurl(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? json_decode($value, true) : [],
            set: fn ($value) => is_array($value) ? json_encode(array_values($value)) : $value,
        );
    }

    /**
     * Get scrapingtip_en as array
     */
    protected function scrapingtipEn(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? json_decode($value, true) : [],
            set: fn ($value) => is_array($value) ? json_encode(array_values($value)) : $value,
        );
    }

    /**
     * Get scrapingtip_cn as array
     */
    protected function scrapingtipCn(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? json_decode($value, true) : [],
            set: fn ($value) => is_array($value) ? json_encode(array_values($value)) : $value,
        );
    }

    /**
     * Get scrapingtip_hindi as array
     */
    protected function scrapingtipHindi(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value ? json_decode($value, true) : [],
            set: fn ($value) => is_array($value) ? json_encode(array_values($value)) : $value,
        );
    }

    /**
     * Helper method to check if scraping is enabled
     */
    public function isScrapingEnabled(): bool
    {
        return $this->scraping === 'ON';
    }

    /**
     * Helper method to check if social features are enabled
     */
    public function isSocialEnabled(): bool
    {
        return $this->social === 'YES';
    }

    /**
     * Helper method to check if widget is enabled
     */
    public function isWidgetEnabled(): bool
    {
        return $this->widget === 'YES';
    }

    /**
     * Helper method to check if slidget is enabled
     */
    public function isSlidgetEnabled(): bool
    {
        return $this->slidget === 'YES';
    }

    /**
     * Helper method to check if webring is enabled
     */
    public function isWebringEnabled(): bool
    {
        return $this->webring === 'YES';
    }

    /**
     * Helper method to check if flysign is enabled
     */
    public function isFlysignEnabled(): bool
    {
        return $this->flysign === 'YES';
    }

    /**
     * Get the default color or custom color
     */
    public function getEffectiveColor(): string
    {
        return $this->customcolor ?? $this->color ?? '#000000';
    }

    /**
     * Get the domain color
     */
    public function getDomainColor(): string
    {
        return $this->domaincolor ?? '#3eb80a';
    }

    /**
     * Get the up vote symbol
     */
    public function getUpSymbol(): string
    {
        return $this->up ?? '⬆️';
    }

    /**
     * Get the down vote symbol
     */
    public function getDownSymbol(): string
    {
        return $this->down ?? '⬇️';
    }

    /**
     * Get scraping URLs array
     */
    public function getScrapingUrls(): array
    {
        return $this->scrapingurl;
    }

    /**
     * Get scraping tip in specified language
     */
    public function getScrapingTip(string $lang = 'en'): array
    {
        return match ($lang) {
            'cn' => $this->scrapingtip_cn,
            'hindi' => $this->scrapingtip_hindi,
            default => $this->scrapingtip_en,
        } ?? [];
    }

    /**
     * Get schedule interval in minutes
     */
    public function getScheduleIntervalMinutes(): int
    {
        return ($this->hours * 60) + $this->minutes;
    }

    /**
     * Get lock day setting
     */
    public function getLockDay(): int
    {
        return $this->lockday ?? 7;
    }

    /**
     * Get handle limit
     */
    public function getHandleLimit(): int
    {
        return $this->handlelimit ?? 0;
    }

    /**
     * Get signup bonus
     */
    public function getSignupBonus(): int
    {
        return $this->signupbonus ?? 0;
    }

    /**
     * Get default coupon code
     */
    public function getDefaultCouponCode(): string
    {
        return $this->default_coupon_code ?? '#1010';
    }
}