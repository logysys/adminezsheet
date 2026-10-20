<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    use HasFactory;
    
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'faqs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'question',
        'answer',
        'keywords',
        'category',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'keywords' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array<int, string>
     */
    protected $hidden = [];

    /**
     * Get the connection name for the model.
     *
     * @return string|null
     */
    public function getConnectionName()
    {
        // If using a specific connection, uncomment below
        // return 'mysql';
        return parent::getConnectionName();
    }

    /**
     * Get the primary key for the model.
     *
     * @return string
     */
    public function getKeyName()
    {
        return 'id';
    }

    /**
     * Get the auto-incrementing key type.
     *
     * @return string
     */
    public function getKeyType()
    {
        return 'int';
    }

    /**
     * Get the value indicating whether the IDs are incrementing.
     *
     * @return bool
     */
    public function getIncrementing()
    {
        return true;
    }

    /**
     * Scope a query to only include active FAQs.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include inactive FAQs.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    /**
     * Scope a query to filter by category.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string|null  $category
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeByCategory($query, $category = null)
    {
        if ($category) {
            return $query->where('category', $category);
        }
        return $query;
    }

    /**
     * Scope a query to search in question, answer, and keywords.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $search
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('question', 'LIKE', "%{$search}%")
              ->orWhere('answer', 'LIKE', "%{$search}%")
              ->orWhere('category', 'LIKE', "%{$search}%")
              ->orWhereJsonContains('keywords', $search);
        });
    }

    /**
     * Get all unique categories from FAQs.
     *
     * @return \Illuminate\Support\Collection
     */
    public static function getCategories()
    {
        return self::distinct()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->orderBy('category', 'asc')
            ->pluck('category');
    }

    /**
     * Check if FAQ is active.
     *
     * @return bool
     */
    public function isActive()
    {
        return $this->is_active === true;
    }

    /**
     * Check if FAQ is inactive.
     *
     * @return bool
     */
    public function isInactive()
    {
        return $this->is_active === false;
    }

    /**
     * Activate the FAQ.
     *
     * @return bool
     */
    public function activate()
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * Deactivate the FAQ.
     *
     * @return bool
     */
    public function deactivate()
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Get the keywords as an array.
     * Alias for accessing the casted attribute.
     *
     * @return array
     */
    public function getKeywordsArray()
    {
        return $this->keywords ?? [];
    }

    /**
     * Add a keyword to the FAQ.
     *
     * @param  string  $keyword
     * @return bool
     */
    public function addKeyword($keyword)
    {
        $keywords = $this->keywords ?? [];
        if (!in_array($keyword, $keywords)) {
            $keywords[] = $keyword;
            return $this->update(['keywords' => $keywords]);
        }
        return false;
    }

    /**
     * Remove a keyword from the FAQ.
     *
     * @param  string  $keyword
     * @return bool
     */
    public function removeKeyword($keyword)
    {
        $keywords = $this->keywords ?? [];
        $key = array_search($keyword, $keywords);
        if ($key !== false) {
            unset($keywords[$key]);
            $keywords = array_values($keywords); // Reindex array
            return $this->update(['keywords' => $keywords]);
        }
        return false;
    }

    /**
     * Check if FAQ has a specific keyword.
     *
     * @param  string  $keyword
     * @return bool
     */
    public function hasKeyword($keyword)
    {
        $keywords = $this->keywords ?? [];
        return in_array($keyword, $keywords);
    }

    /**
     * Get all FAQs grouped by category.
     *
     * @return \Illuminate\Support\Collection
     */
    public static function getByCategoryGrouped()
    {
        return self::active()
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->orderBy('category', 'asc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy('category');
    }

    /**
     * Get FAQs without category (uncategorized).
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getUncategorized()
    {
        return self::active()
            ->whereNull('category')
            ->orWhere('category', '')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        // You can add model events here if needed
        // Example:
        // static::creating(function ($faq) {
        //     // Logic before creating
        // });
        
        // static::created(function ($faq) {
        //     // Logic after creating
        // });
    }

    /**
     * Get the table name with database prefix.
     *
     * @return string
     */
    public function getTableWithPrefix()
    {
        return $this->getConnection()->getDatabaseName() . '.' . $this->getTable();
    }
}