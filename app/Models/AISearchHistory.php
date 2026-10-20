<?php
// app/Models/AISearchHistory.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Session;

class AISearchHistory extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ai_search_histories';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'slug',
        'conversation_id',
        'conversation_title',
        'parent_id',
        'message_role',
        'thread_id',
        'user_id',
        'query',
        'response',
        'sources',
        'usage',
        'thinking_enabled',
        'model',
        'temperature',
        'max_tokens',
        'finish_reason',
        'ip_address',
        'user_agent',
        'session_id',
        'status',
        'pinned',
        'pinned_order',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'sources' => 'array',
        'usage' => 'array',
        'thinking_enabled' => 'boolean',
        'temperature' => 'float',
        'max_tokens' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'status' => 'string',
        'pinned' => 'boolean',
        'pinned_order' => 'integer',
    ];
    
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'ip_address',
        'user_agent',
    ];
    
    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'formatted_created_at',
        'response_preview',
        'total_tokens',
        'conversation_tokens',
        'cost_estimate',
        'conversation_cost',
        'response_time',
        'message_count',
        'share_url',
        'conversation_url',
    ];
    
    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = static::generateUniqueSlug($model->query);
            }
            
            // Set conversation ID if this is the first message
            if (empty($model->conversation_id)) {
                $model->conversation_id = Str::uuid()->toString();
            }
            
            // Generate thread ID for conversation tracking
            if (empty($model->thread_id)) {
                $model->thread_id = 'thread_' . Str::random(16);
            }
            
            // Set message role if not specified
            if (empty($model->message_role)) {
                $model->message_role = 'user';
            }
            
            // Set conversation title from first query if not set
            if (empty($model->conversation_title) && empty($model->parent_id)) {
                // Handle different languages for conversation title
                $model->conversation_title = static::generateConversationTitle($model->query);
            }
            
            // Set session ID if not set
            if (empty($model->session_id)) {
                $model->session_id = Session::getId();
            }
            
            // Set IP address if not set
            if (empty($model->ip_address) && isset($_SERVER['REMOTE_ADDR'])) {
                $model->ip_address = $_SERVER['REMOTE_ADDR'];
            }
            
            // Set user agent if not set
            if (empty($model->user_agent) && isset($_SERVER['HTTP_USER_AGENT'])) {
                $model->user_agent = $_SERVER['HTTP_USER_AGENT'];
            }
            
            // Set default values
            if (empty($model->temperature)) {
                $model->temperature = 0.7;
            }
            
            if (empty($model->max_tokens)) {
                $model->max_tokens = 2000;
            }
            
            if (empty($model->model)) {
                $model->model = 'kimi-k2.5';
            }
            
            // Set default status if not specified
            if (empty($model->status)) {
                $model->status = 'public';
            }
            
            // Set default pinned value
            if (!isset($model->pinned)) {
                $model->pinned = false;
            }
        });
        
        static::updating(function ($model) {
            // Update slug if query changed and it's a user message
            if ($model->isDirty('query') && $model->message_role === 'user') {
                $model->slug = static::generateUniqueSlug($model->query);
            }
        });
    }
    
    /**
     * Generate a unique slug from query.
     *
     * @param string $query
     * @param int $attempt
     * @return string
     */
    public static function generateUniqueSlug(string $query, int $attempt = 0): string
    {
        // Generate base slug from query
        $baseSlug = static::createSlugFromQuery($query);
        
        // If attempt is 0, try the base slug first
        if ($attempt === 0) {
            $slug = $baseSlug;
        } else {
            // For subsequent attempts, append the attempt number with a hyphen
            $slug = $baseSlug . '-' . $attempt;
        }
        
        // Check if slug exists
        if (static::where('slug', $slug)->exists()) {
            // Increment attempt and try again
            return static::generateUniqueSlug($query, $attempt + 1);
        }
        
        return $slug;
    }
    
    /**
     * Create slug from query preserving Unicode characters.
     *
     * @param string $query
     * @return string
     */
    protected static function createSlugFromQuery(string $query): string
    {
        $query = trim($query);
        
        // If query is empty or very short, use a generic slug
        if (empty($query) || strlen($query) < 1) {
            return 'conversation';
        }
        
        // Clean the query for use in URL
        $slug = static::cleanForUrl($query);
        
        // Limit length for URL safety
        $slug = mb_substr($slug, 0, 50, 'UTF-8');
        
        // Remove any remaining unwanted characters
        $slug = preg_replace('/[^\p{L}\p{N}\p{M}\-\s]/u', '', $slug);
        $slug = trim($slug);
        
        // Replace multiple spaces and hyphens with single hyphen
        $slug = preg_replace('/[\s\-]+/u', '-', $slug);
        
        // Remove leading/trailing hyphens
        $slug = trim($slug, '-');
        
        // If slug is empty after cleaning, use a random one
        if (empty($slug)) {
            $slug = 'q-' . Str::random(8);
        }
        
        return $slug;
    }
    
    /**
     * Clean text for URL use while preserving Unicode characters.
     *
     * @param string $text
     * @return string
     */
    protected static function cleanForUrl(string $text): string
    {
        // Convert to lowercase
        $text = mb_strtolower($text, 'UTF-8');
        
        // Replace common Chinese punctuation with spaces
        $text = preg_replace('/[，。；：！？、]/u', ' ', $text);
        
        // Replace other punctuation with spaces
        $text = preg_replace('/[.,;:!?\/\\\\|@#\$%\^&\*\(\)\[\]\{\}<>~`"\'_=+]/u', ' ', $text);
        
        // Trim and remove extra spaces
        $text = trim($text);
        $text = preg_replace('/\s+/u', ' ', $text);
        
        return $text;
    }
    
    /**
     * Generate conversation title from query.
     *
     * @param string $query
     * @return string
     */
    protected static function generateConversationTitle(string $query): string
    {
        $query = trim($query);
        
        // Handle different languages
        if (preg_match('/[\x{4e00}-\x{9fff}]/u', $query)) {
            // Chinese characters
            $title = '中文对话: ' . mb_substr($query, 0, 30, 'UTF-8');
        } elseif (preg_match('/[\x{3040}-\x{309F}\x{30A0}-\x{30FF}]/u', $query)) {
            // Japanese characters
            $title = '日本語の会話: ' . mb_substr($query, 0, 30, 'UTF-8');
        } elseif (preg_match('/[\x{AC00}-\x{D7AF}]/u', $query)) {
            // Korean characters
            $title = '한국어 대화: ' . mb_substr($query, 0, 30, 'UTF-8');
        } elseif (preg_match('/[\x{0600}-\x{06FF}]/u', $query)) {
            // Arabic characters
            $title = 'محادثة عربية: ' . mb_substr($query, 0, 30, 'UTF-8');
        } elseif (preg_match('/[\x{0400}-\x{04FF}]/u', $query)) {
            // Cyrillic characters
            $title = 'Разговор: ' . mb_substr($query, 0, 30, 'UTF-8');
        } elseif (preg_match('/[\x{1F300}-\x{1F9FF}]/u', $query)) {
            // Emojis
            $title = '💬 ' . mb_substr($query, 0, 30, 'UTF-8');
        } else {
            // Other languages, use default
            $title = Str::limit($query, 60);
        }
        
        return $title;
    }
    
    /**
     * Get the user that owns the search.
     */
    public function user()
    {
        return $this->belongsTo(User::class)->withDefault([
            'name' => 'Guest User',
        ]);
    }
    
    /**
     * Get parent message.
     */
    public function parent()
    {
        return $this->belongsTo(AISearchHistory::class, 'parent_id');
    }
    
    /**
     * Get child messages (replies).
     */
    public function children()
    {
        return $this->hasMany(AISearchHistory::class, 'parent_id')->orderBy('created_at', 'asc');
    }
    
    /**
     * Get all messages in the conversation.
     */
    public function conversation()
    {
        return static::where('conversation_id', $this->conversation_id)
            ->orderBy('created_at', 'asc')
            ->orderBy('id', 'asc');
    }
    
    /**
     * Get conversation messages as a threaded array.
     */
    public function getConversationThreadAttribute()
    {
        $messages = $this->conversation()->get();
        
        // Build threaded structure
        $threaded = [];
        $byId = [];
        
        foreach ($messages as $message) {
            $byId[$message->id] = $message;
            $message->children = [];
        }
        
        foreach ($messages as $message) {
            if ($message->parent_id && isset($byId[$message->parent_id])) {
                $byId[$message->parent_id]->children[] = $message;
            } else {
                $threaded[] = $message;
            }
        }
        
        return $threaded;
    }
    
    /**
     * Get shareable URL.
     *
     * @return string
     */
    public function getShareableUrl(): string
    {
        $url = url('/X/' . $this->slug);
        
        // Parse the URL to handle domain separately
        $parsedUrl = parse_url($url);
        
        if (isset($parsedUrl['host'])) {
            // Convert domain if it contains non-ASCII characters
            $parsedUrl['host'] = idn_to_utf8($parsedUrl['host'], IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
            
            // Rebuild URL
            $scheme = isset($parsedUrl['scheme']) ? $parsedUrl['scheme'] . '://' : '';
            $host = $parsedUrl['host'] ?? '';
            $port = isset($parsedUrl['port']) ? ':' . $parsedUrl['port'] : '';
            $path = $parsedUrl['path'] ?? '';
            $query = isset($parsedUrl['query']) ? '?' . $parsedUrl['query'] : '';
            $fragment = isset($parsedUrl['fragment']) ? '#' . $parsedUrl['fragment'] : '';
            
            return $scheme . $host . $port . $path . $query . $fragment;
        }
        
        return $url;
    }
    
    /**
     * Get conversation URL (always points to first message).
     *
     * @return string
     */
    public function getConversationUrl(): string
    {
        $firstMessage = $this->getFirstMessage();
        return $firstMessage ? $firstMessage->getShareableUrl() : $this->getShareableUrl();
    }
    
    /**
     * Get first message in conversation.
     *
     * @return AISearchHistory|null
     */
    public function getFirstMessage()
    {
        return static::where('conversation_id', $this->conversation_id)
            ->whereNull('parent_id')
            ->orderBy('created_at', 'asc')
            ->first();
    }
    
    /**
     * Get last message in conversation.
     *
     * @return AISearchHistory|null
     */
    public function getLastMessage()
    {
        return static::where('conversation_id', $this->conversation_id)
            ->orderBy('created_at', 'desc')
            ->first();
    }
    
    /**
     * Get conversation message count.
     *
     * @return int
     */
    public function getMessageCountAttribute(): int
    {
        return static::where('conversation_id', $this->conversation_id)->count();
    }
    
    /**
     * Get short URL.
     *
     * @return string
     */
    public function getShortUrl(): string
    {
        return url('/s/' . urlencode($this->slug));
    }
    
    /**
     * Get response preview (first 200 characters).
     *
     * @return string
     */
    public function getResponsePreviewAttribute(): string
    {
        if (empty($this->response)) {
            return 'No response yet';
        }
        
        $plainText = strip_tags($this->response);
        return Str::limit($plainText, 200);
    }
    
    /**
     * Get formatted created date.
     *
     * @return string
     */
    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->format('M d, Y \a\t h:i A');
    }
    
    /**
     * Get total tokens used.
     *
     * @return int
     */
    public function getTotalTokensAttribute(): int
    {
        return $this->usage['total_tokens'] ?? 0;
    }
    
    /**
     * Get conversation total tokens.
     *
     * @return int
     */
    public function getConversationTokensAttribute(): int
    {
        return static::where('conversation_id', $this->conversation_id)
            ->sum('total_tokens');
    }
    
    /**
     * Get estimated cost based on Kimi API pricing.
     *
     * @return float
     */
    public function getCostEstimateAttribute(): float
    {
        // Kimi API pricing estimate: ~$0.01 per 1000 tokens
        $totalTokens = $this->total_tokens;
        return round(($totalTokens / 1000) * 0.01, 4);
    }
    
    /**
     * Get conversation cost estimate.
     *
     * @return float
     */
    public function getConversationCostAttribute(): float
    {
        $totalTokens = $this->conversation_tokens;
        return round(($totalTokens / 1000) * 0.01, 4);
    }
    
    /**
     * Get response time in seconds.
     *
     * @return int|null
     */
    public function getResponseTimeAttribute(): ?int
    {
        if (!$this->created_at || !$this->updated_at) {
            return null;
        }
        
        return $this->created_at->diffInSeconds($this->updated_at);
    }
    
    /**
     * Get share URL attribute.
     *
     * @return string
     */
    public function getShareUrlAttribute(): string
    {
        return $this->getShareableUrl();
    }
    
    /**
     * Get conversation URL attribute.
     *
     * @return string
     */
    public function getConversationUrlAttribute(): string
    {
        return $this->getConversationUrl();
    }
    
    /**
     * Scope a query to only include public searches.
     */
    public function scopePublic($query)
    {
        return $query->where('status', 'public');
    }
    
    /**
     * Scope a query to only include private searches.
     */
    public function scopePrivate($query)
    {
        return $query->where('status', 'private');
    }
    
    /**
     * Scope a query to only include hidden messages.
     */
    public function scopeHidden($query)
    {
        return $query->where('status', 'hidden');
    }
    
    /**
     * Scope a query to only include user's searches.
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
    
    /**
     * Scope a query to only include searches from session.
     */
    public function scopeForSession($query, $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }
    
    /**
     * Scope a query to only include conversations (first messages).
     */
    public function scopeConversations($query)
    {
        return $query->whereNull('parent_id');
    }
    
    /**
     * Scope a query to only include messages (non-root).
     */
    public function scopeMessages($query)
    {
        return $query->whereNotNull('parent_id');
    }
    
    /**
     * Scope a query to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate = null)
    {
        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }
        
        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }
        
        return $query;
    }
    
    /**
     * Scope a query to filter by model.
     */
    public function scopeByModel($query, $model)
    {
        return $query->where('model', $model);
    }
    
    /**
     * Scope a query to only include pinned conversations.
     */
    public function scopePinned($query)
    {
        return $query->where('pinned', true);
    }
    
    /**
     * Scope a query to order by pinned first with custom order.
     */
    public function scopeOrderByPinned($query)
    {
        return $query->orderByRaw('CASE WHEN pinned = 1 AND pinned_order IS NOT NULL THEN 1 
                                          WHEN pinned = 1 AND pinned_order IS NULL THEN 2 
                                          ELSE 3 END')
                     ->orderBy('pinned_order', 'asc')
                     ->orderBy('created_at', 'desc');
    }
    
    /**
     * Get related searches (similar queries).
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getRelatedSearches($limit = 5)
    {
        $keywords = explode(' ', $this->query);
        $keywords = array_filter($keywords, function($word) {
            return strlen($word) > 3;
        });
        
        if (empty($keywords)) {
            return collect();
        }
        
        return static::where('id', '!=', $this->id)
            ->where(function($query) use ($keywords) {
                foreach ($keywords as $keyword) {
                    $query->orWhere('query', 'LIKE', '%' . $keyword . '%');
                }
            })
            ->whereNull('parent_id') // Only show top-level conversations
            ->public() // Only public conversations
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
    
    /**
     * Get popular searches.
     *
     * @param int $limit
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getPopularSearches($limit = 10)
    {
        return static::whereNull('parent_id')
            ->public()
            ->select('query', \DB::raw('COUNT(*) as count'))
            ->groupBy('query')
            ->orderBy('count', 'desc')
            ->limit($limit)
            ->get();
    }
    
    /**
     * Get conversation messages for API response.
     * This method ensures all messages include the status field.
     *
     * @return array
     */
    public function getConversationMessages(): array
    {
        $messages = $this->conversation()->get();
        
        return $messages->map(function ($message) {
            return [
                'id' => $message->id,
                'slug' => $message->slug,
                'message_role' => $message->message_role,
                'query' => $message->query,
                'response' => $message->response,
                'created_at' => $message->created_at->toISOString(),
                'formatted_created_at' => $message->formatted_created_at,
                'thinking_enabled' => $message->thinking_enabled,
                'model' => $message->model,
                'temperature' => $message->temperature,
                'max_tokens' => $message->max_tokens,
                'total_tokens' => $message->total_tokens,
                'usage' => $message->usage,
                'finish_reason' => $message->finish_reason,
                'sources' => $message->sources,
                'status' => $message->status ?? 'public', // Ensure status is always present
                'pinned' => $message->pinned ?? false,
                'share_url' => $message->getShareableUrl(),
                'conversation_url' => $message->getConversationUrl(),
            ];
        })->toArray();
    }
    
    /**
     * Get conversation summary.
     *
     * @return array
     */
    public function getConversationSummary(): array
    {
        $firstMessage = $this->getFirstMessage();
        $lastMessage = $this->getLastMessage();
        
        return [
            'id' => $this->conversation_id,
            'title' => $firstMessage->conversation_title ?? 'Untitled Conversation',
            'message_count' => $this->message_count,
            'total_tokens' => $this->conversation_tokens,
            'total_cost' => $this->conversation_cost,
            'created_at' => $firstMessage->created_at->toISOString(),
            'updated_at' => $lastMessage->created_at->toISOString(),
            'status' => $firstMessage->status ?? 'public',
            'pinned' => $firstMessage->pinned ?? false,
            'pinned_order' => $firstMessage->pinned_order,
            'user' => $firstMessage->user ? [
                'id' => $firstMessage->user->id,
                'name' => $firstMessage->user->name,
            ] : null,
            'first_message_url' => $firstMessage ? $firstMessage->getShareableUrl() : null,
        ];
    }
    
    /**
     * Check if the search is public.
     *
     * @return bool
     */
    public function isPublic(): bool
    {
        return $this->status === 'public';
    }
    
    /**
     * Check if the search is private.
     *
     * @return bool
     */
    public function isPrivate(): bool
    {
        return $this->status === 'private';
    }
    
    /**
     * Check if the message is hidden.
     *
     * @return bool
     */
    public function isHidden(): bool
    {
        return $this->status === 'hidden';
    }
    
    /**
     * Check if the conversation is pinned.
     *
     * @return bool
     */
    public function isPinned(): bool
    {
        return $this->pinned === true;
    }
    
    /**
     * Toggle status between public and private.
     *
     * @return $this
     */
    public function toggleStatus()
    {
        $this->status = $this->isPublic() ? 'private' : 'public';
        $this->save();
        
        return $this;
    }
    
    /**
     * Make the search public.
     *
     * @return $this
     */
    public function makePublic()
    {
        $this->status = 'public';
        $this->save();
        
        return $this;
    }
    
    /**
     * Make the search private.
     *
     * @return $this
     */
    public function makePrivate()
    {
        $this->status = 'private';
        $this->save();
        
        return $this;
    }
    
    /**
     * Hide the message.
     *
     * @return $this
     */
    public function hide()
    {
        $this->status = 'hidden';
        $this->save();
        
        return $this;
    }
    
    /**
     * Unhide the message.
     *
     * @return $this
     */
    public function unhide()
    {
        $this->status = 'public';
        $this->save();
        
        return $this;
    }
    
    /**
     * Pin the conversation.
     *
     * @return $this
     */
    public function pin()
    {
        $maxOrder = static::where('pinned', true)->max('pinned_order');
        $nextOrder = $maxOrder ? $maxOrder + 1 : 1;
        
        $this->pinned = true;
        $this->pinned_order = $nextOrder;
        $this->save();
        
        return $this;
    }
    
    /**
     * Unpin the conversation.
     *
     * @return $this
     */
    public function unpin()
    {
        $oldOrder = $this->pinned_order;
        
        $this->pinned = false;
        $this->pinned_order = null;
        $this->save();
        
        // Reorder remaining pinned items
        static::where('pinned', true)
            ->where('pinned_order', '>', $oldOrder)
            ->decrement('pinned_order');
        
        return $this;
    }
    
    /**
     * Toggle pin status.
     *
     * @return $this
     */
    public function togglePin()
    {
        if ($this->isPinned()) {
            return $this->unpin();
        } else {
            return $this->pin();
        }
    }
    
    /**
     * Get status badge HTML.
     *
     * @return string
     */
    public function getStatusBadgeAttribute(): string
    {
        if ($this->isPublic()) {
            return '<span class="badge bg-success">Public</span>';
        } elseif ($this->isPrivate()) {
            return '<span class="badge bg-secondary">Private</span>';
        } elseif ($this->isHidden()) {
            return '<span class="badge bg-danger">Hidden</span>';
        }
        
        return '<span class="badge bg-light">Unknown</span>';
    }
    
    /**
     * Get pinned badge HTML.
     *
     * @return string
     */
    public function getPinnedBadgeAttribute(): string
    {
        if ($this->isPinned()) {
            $orderText = $this->pinned_order ? ' #' . $this->pinned_order : '';
            return '<span class="badge bg-warning text-dark">📌 Pinned' . $orderText . '</span>';
        }
        
        return '';
    }
    
    /**
     * Get message role badge.
     *
     * @return string
     */
    public function getRoleBadgeAttribute(): string
    {
        if ($this->message_role === 'user') {
            return '<span class="badge bg-primary">User</span>';
        } elseif ($this->message_role === 'assistant') {
            return '<span class="badge bg-info">Assistant</span>';
        } else {
            return '<span class="badge bg-warning">System</span>';
        }
    }
    
    /**
     * Get model badge.
     *
     * @return string
     */
    public function getModelBadgeAttribute(): string
    {
        $models = [
            'kimi-k2.5' => 'badge bg-dark',
            'gpt-4' => 'badge bg-danger',
            'gpt-3.5-turbo' => 'badge bg-warning text-dark',
        ];
        
        $class = $models[$this->model] ?? 'badge bg-secondary';
        
        return '<span class="' . $class . '">' . $this->model . '</span>';
    }
    
    /**
     * Delete the model and all its children.
     *
     * @return bool|null
     */
    public function delete()
    {
        // Delete all children first
        foreach ($this->children as $child) {
            $child->delete();
        }
        
        return parent::delete();
    }
    
    /**
     * Get the route key for the model.
     *
     * @return string
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}