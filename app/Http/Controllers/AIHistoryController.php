<?php
// app/Http/Controllers/AIHistoryController.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AISearchHistory;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AIHistoryController extends Controller
{
    /**
     * Display a listing of all AI conversations (admin view)
     */
    public function index(Request $request)
    {
        $query = AISearchHistory::with('user')
            ->whereNull('parent_id') // Only conversation starters
            ->orderByPinned();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('query', 'LIKE', "%{$search}%")
                  ->orWhere('conversation_title', 'LIKE', "%{$search}%")
                  ->orWhere('conversation_id', 'LIKE', "%{$search}%")
                  ->orWhere('model', 'LIKE', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'LIKE', "%{$search}%")
                               ->orWhere('email', 'LIKE', "%{$search}%");
                  });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->filled('min_tokens')) {
            $query->where('total_tokens', '>=', $request->min_tokens);
        }

        if ($request->filled('max_tokens')) {
            $query->where('total_tokens', '<=', $request->max_tokens);
        }

        $perPage = $request->input('per_page', 15);
        $conversations = $query->paginate($perPage);

        // Enhance conversations with additional data
        $conversations->getCollection()->transform(function ($conversation) {
            return $this->enhanceConversationData($conversation);
        });

        // Get statistics
        $stats = $this->getStatistics();

        // Get filter options
        $filterOptions = [
            'models' => AISearchHistory::distinct('model')->pluck('model'),
            'statuses' => ['public', 'private', 'hidden'],
            'total_conversations' => AISearchHistory::whereNull('parent_id')->count(),
            'total_messages' => AISearchHistory::count(),
            'total_users' => AISearchHistory::whereNotNull('user_id')->distinct('user_id')->count('user_id'),
            'total_tokens' => $this->calculateTotalTokens(),
        ];
        
        return Inertia::render('AIHistory/Index', [
            'conversations' => $conversations,
            'filters' => $request->only(['search', 'status', 'model', 'date_from', 'date_to', 'user_id', 'min_tokens', 'max_tokens']),
            'stats' => $stats,
            'filterOptions' => $filterOptions,
        ]);
    }

    /**
     * Display the specified conversation
     */
    public function show($conversationId)
    {
        $messages = AISearchHistory::with('user', 'parent')
            ->where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get();

        if ($messages->isEmpty()) {
            return redirect()->route('ai-history.index')
                ->with('error', 'Conversation not found.');
        }

        $firstMessage = $messages->first();
        $lastMessage = $messages->last();

        // Calculate conversation stats
        $conversationTokens = $this->calculateConversationTokens($messages);
        $conversationCost = $conversationTokens > 0 ? ($conversationTokens / 1000) * 0.01 : 0;

        // Get user info
        $user = $firstMessage->user;

        // Get token usage breakdown
        $tokenBreakdown = [
            'prompt_tokens' => $messages->sum(function($msg) {
                return $msg->usage['prompt_tokens'] ?? 0;
            }),
            'completion_tokens' => $messages->sum(function($msg) {
                return $msg->usage['completion_tokens'] ?? 0;
            }),
            'total_tokens' => $conversationTokens,
        ];

        return Inertia::render('AIHistory/Show', [
            'conversation' => [
                'id' => $conversationId,
                'title' => $firstMessage->conversation_title ?? 'Untitled Conversation',
                'created_at' => $firstMessage->created_at->toISOString(),
                'created_at_formatted' => $firstMessage->created_at->format('M d, Y \a\t h:i A'),
                'updated_at' => $lastMessage->created_at->toISOString(),
                'updated_at_formatted' => $lastMessage->created_at->format('M d, Y \a\t h:i A'),
                'message_count' => $messages->count(),
                'total_tokens' => $conversationTokens,
                'total_cost' => round($conversationCost, 4),
                'token_breakdown' => $tokenBreakdown,
                'status' => $firstMessage->status ?? 'public',
                'pinned' => $firstMessage->pinned ?? false,
                'pinned_order' => $firstMessage->pinned_order,
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                ] : null,
                'session_id' => $firstMessage->session_id,
                'ip_address' => $firstMessage->ip_address,
                'user_agent' => $firstMessage->user_agent,
            ],
            'messages' => $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'slug' => $message->slug,
                    'message_role' => $message->message_role,
                    'parent_id' => $message->parent_id,
                    'query' => $message->query,
                    'response' => $message->response,
                    'created_at' => $message->created_at->toISOString(),
                    'created_at_formatted' => $message->created_at->format('M d, Y \a\t h:i A'),
                    'thinking_enabled' => $message->thinking_enabled,
                    'model' => $message->model,
                    'temperature' => $message->temperature,
                    'max_tokens' => $message->max_tokens,
                    'total_tokens' => $this->getMessageTokens($message),
                    'usage' => $message->usage,
                    'finish_reason' => $message->finish_reason,
                    'sources' => $message->sources,
                    'status' => $message->status ?? 'public',
                    'pinned' => $message->pinned ?? false,
                    'share_url' => $message->getShareableUrl(),
                    'ip_address' => $message->ip_address,
                    'user_agent' => $message->user_agent,
                ];
            }),
        ]);
    }

    /**
     * Update pinned order for conversations
     */
    public function updatePinnedOrder(Request $request)
    {
        $request->validate([
            'ordered_ids' => 'required|array',
            'ordered_ids.*' => 'string'
        ]);

        try {
            DB::beginTransaction();

            foreach ($request->ordered_ids as $index => $conversationId) {
                AISearchHistory::where('conversation_id', $conversationId)
                    ->update(['pinned_order' => $index + 1]);
            }

            DB::commit();

            Log::info('Admin updated pinned order', [
                'ordered_ids' => $request->ordered_ids,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pinned order updated successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update pinned order', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update pinned order'
            ], 500);
        }
    }

    /**
     * Update conversation status
     */
    public function updateStatus(Request $request, $conversationId)
    {
        $request->validate([
            'status' => 'required|in:public,private,hidden'
        ]);

        try {
            DB::beginTransaction();

            // Update all messages in the conversation
            AISearchHistory::where('conversation_id', $conversationId)
                ->update(['status' => $request->status]);

            DB::commit();

            Log::info('Admin updated conversation status', [
                'conversation_id' => $conversationId,
                'status' => $request->status,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Conversation status updated successfully',
                'status' => $request->status
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update conversation status', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update conversation status'
            ], 500);
        }
    }

    /**
     * Pin a conversation
     */
    public function pin($conversationId)
    {
        try {
            DB::beginTransaction();

            // Get the next available order number
            $maxOrder = AISearchHistory::where('pinned', true)
                ->max('pinned_order');
            
            $nextOrder = $maxOrder ? $maxOrder + 1 : 1;

            // Update all messages in the conversation
            AISearchHistory::where('conversation_id', $conversationId)
                ->update([
                    'pinned' => true,
                    'pinned_order' => $nextOrder
                ]);

            DB::commit();

            Log::info('Admin pinned conversation', [
                'conversation_id' => $conversationId,
                'pinned_order' => $nextOrder,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Conversation pinned successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to pin conversation', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to pin conversation'
            ], 500);
        }
    }

    /**
     * Unpin a conversation
     */
    public function unpin($conversationId)
    {
        try {
            DB::beginTransaction();

            $conversation = AISearchHistory::where('conversation_id', $conversationId)
                ->whereNull('parent_id')
                ->first();

            if ($conversation && $conversation->pinned) {
                $oldOrder = $conversation->pinned_order;

                // Update all messages in the conversation
                AISearchHistory::where('conversation_id', $conversationId)
                    ->update([
                        'pinned' => false,
                        'pinned_order' => null
                    ]);

                // Reorder remaining pinned items
                AISearchHistory::where('pinned', true)
                    ->where('pinned_order', '>', $oldOrder)
                    ->decrement('pinned_order');
            }

            DB::commit();

            Log::info('Admin unpinned conversation', [
                'conversation_id' => $conversationId,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Conversation unpinned successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to unpin conversation', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to unpin conversation'
            ], 500);
        }
    }

    /**
     * Bulk pin conversations
     */
    public function bulkPin(Request $request)
    {
        $request->validate([
            'conversation_ids' => 'required|array',
            'conversation_ids.*' => 'string'
        ]);

        try {
            DB::beginTransaction();

            // Get the next available order number
            $maxOrder = AISearchHistory::where('pinned', true)
                ->max('pinned_order');
            
            $nextOrder = $maxOrder ? $maxOrder + 1 : 1;

            foreach ($request->conversation_ids as $conversationId) {
                AISearchHistory::where('conversation_id', $conversationId)
                    ->update([
                        'pinned' => true,
                        'pinned_order' => $nextOrder++
                    ]);
            }

            DB::commit();

            Log::info('Admin bulk pinned conversations', [
                'conversation_ids' => $request->conversation_ids,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Conversations pinned successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to bulk pin conversations', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to pin conversations'
            ], 500);
        }
    }

    /**
     * Bulk unpin conversations
     */
    public function bulkUnpin(Request $request)
    {
        $request->validate([
            'conversation_ids' => 'required|array',
            'conversation_ids.*' => 'string'
        ]);

        try {
            DB::beginTransaction();

            $orderedIds = [];
            foreach ($request->conversation_ids as $conversationId) {
                $conv = AISearchHistory::where('conversation_id', $conversationId)
                    ->whereNull('parent_id')
                    ->first();
                if ($conv && $conv->pinned) {
                    $orderedIds[] = [
                        'id' => $conversationId,
                        'order' => $conv->pinned_order
                    ];
                }
            }

            // Sort by order to unpin in correct sequence
            usort($orderedIds, function($a, $b) {
                return $a['order'] <=> $b['order'];
            });

            foreach ($orderedIds as $item) {
                $this->unpin($item['id']);
            }

            DB::commit();

            Log::info('Admin bulk unpinned conversations', [
                'conversation_ids' => $request->conversation_ids,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Conversations unpinned successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to bulk unpin conversations', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to unpin conversations'
            ], 500);
        }
    }

    /**
     * Update message status
     */
    public function updateMessageStatus(Request $request, $slug)
    {
        $request->validate([
            'status' => 'required|in:public,hidden'
        ]);

        try {
            $message = AISearchHistory::where('slug', $slug)->firstOrFail();
            
            $message->status = $request->status;
            $message->save();

            Log::info('Admin updated message status', [
                'message_id' => $message->id,
                'slug' => $slug,
                'status' => $request->status,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message status updated successfully',
                'status' => $request->status
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update message status', [
                'slug' => $slug,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update message status'
            ], 500);
        }
    }

    /**
     * Delete a single message
     */
    public function deleteMessage($slug)
    {
        try {
            $message = AISearchHistory::where('slug', $slug)->firstOrFail();
            
            // Check if this is the only message in the conversation
            $conversationMessages = AISearchHistory::where('conversation_id', $message->conversation_id)->count();
            
            DB::beginTransaction();
            
            $message->delete();
            
            // If this was the last message in the conversation, the conversation is effectively deleted
            if ($conversationMessages === 1) {
                Log::info('Conversation deleted along with last message', [
                    'conversation_id' => $message->conversation_id
                ]);
            }
            
            DB::commit();

            Log::info('Admin deleted message', [
                'message_id' => $message->id,
                'slug' => $slug,
                'conversation_id' => $message->conversation_id,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete message', [
                'slug' => $slug,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete message'
            ], 500);
        }
    }

    /**
     * Delete a conversation
     */
    public function destroy($conversationId)
    {
        try {
            DB::beginTransaction();

            $messages = AISearchHistory::where('conversation_id', $conversationId)->get();
            
            if ($messages->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Conversation not found'
                ], 404);
            }

            $messageCount = $messages->count();
            
            foreach ($messages as $message) {
                $message->delete();
            }

            DB::commit();

            Log::info('Admin deleted conversation', [
                'conversation_id' => $conversationId,
                'message_count' => $messageCount,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Conversation deleted successfully',
                'deleted_count' => $messageCount
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete conversation', [
                'conversation_id' => $conversationId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete conversation'
            ], 500);
        }
    }

    /**
     * Bulk delete conversations
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'conversation_ids' => 'required|array',
            'conversation_ids.*' => 'string'
        ]);

        try {
            DB::beginTransaction();

            $deletedCount = 0;
            foreach ($request->conversation_ids as $conversationId) {
                $messages = AISearchHistory::where('conversation_id', $conversationId)->get();
                $deletedCount += $messages->count();
                
                foreach ($messages as $message) {
                    $message->delete();
                }
            }

            DB::commit();

            Log::info('Admin bulk deleted conversations', [
                'conversation_ids' => $request->conversation_ids,
                'total_messages' => $deletedCount,
                'admin_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Conversations deleted successfully',
                'deleted_count' => $deletedCount
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to bulk delete conversations', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete conversations'
            ], 500);
        }
    }

    /**
     * Export conversations data
     */
    public function export(Request $request)
    {
        $query = AISearchHistory::with('user')
            ->whereNull('parent_id')
            ->orderByPinned();

        // Apply same filters as index
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $conversations = $query->get();
        
        $exportData = $conversations->map(function ($conversation) {
            $messageCount = AISearchHistory::where('conversation_id', $conversation->conversation_id)->count();
            $totalTokens = $this->calculateConversationTokensById($conversation->conversation_id);
            
            return [
                'conversation_id' => $conversation->conversation_id,
                'title' => $conversation->conversation_title,
                'user' => $conversation->user ? $conversation->user->email : 'Guest',
                'message_count' => $messageCount,
                'total_tokens' => $totalTokens,
                'cost' => round(($totalTokens / 1000) * 0.01, 4),
                'status' => $conversation->status,
                'pinned' => $conversation->pinned ? 'Yes' : 'No',
                'pinned_order' => $conversation->pinned_order,
                'created_at' => $conversation->created_at->format('Y-m-d H:i:s'),
                'model' => $conversation->model,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $exportData
        ]);
    }

    /**
     * Get dashboard statistics
     */
    public function statistics()
    {
        $stats = $this->getStatistics();

        // Get daily trends for the last 30 days
        $dailyTrends = AISearchHistory::where('created_at', '>=', now()->subDays(30))
            ->get()
            ->groupBy(function($item) {
                return $item->created_at->format('Y-m-d');
            })
            ->map(function($items, $date) {
                $conversations = $items->whereNull('parent_id')->count();
                $messages = $items->count();
                $totalTokens = $items->sum(function($item) {
                    return $this->getMessageTokens($item);
                });
                
                return [
                    'date' => $date,
                    'conversations' => $conversations,
                    'messages' => $messages,
                    'total_tokens' => $totalTokens,
                ];
            })
            ->values();

        // Get model distribution
        $modelDistribution = AISearchHistory::whereNull('parent_id')
            ->get()
            ->groupBy('model')
            ->map(function($items, $model) {
                return [
                    'model' => $model,
                    'count' => $items->count(),
                ];
            })
            ->values();

        // Get top users by conversation count
        $topUsers = AISearchHistory::whereNull('parent_id')
            ->whereNotNull('user_id')
            ->with('user')
            ->get()
            ->groupBy('user_id')
            ->map(function($items, $userId) {
                $user = $items->first()->user;
                return [
                    'user' => $user ? $user->name : 'Unknown',
                    'email' => $user ? $user->email : 'Unknown',
                    'conversations' => $items->count(),
                ];
            })
            ->sortByDesc('conversations')
            ->take(10)
            ->values();

        // Get pinned conversations count
        $pinnedCount = AISearchHistory::whereNull('parent_id')
            ->where('pinned', true)
            ->count();

        return Inertia::render('AIHistory/Statistics', [
            'stats' => $stats,
            'dailyTrends' => $dailyTrends,
            'modelDistribution' => $modelDistribution,
            'topUsers' => $topUsers,
            'pinnedCount' => $pinnedCount,
        ]);
    }

    /**
     * Get conversation messages for API
     */
    public function getMessages($conversationId)
    {
        $messages = AISearchHistory::where('conversation_id', $conversationId)
            ->orderBy('created_at', 'asc')
            ->get();

        if ($messages->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Conversation not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'messages' => $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'slug' => $message->slug,
                    'message_role' => $message->message_role,
                    'query' => $message->query,
                    'response' => $message->response,
                    'created_at' => $message->created_at->toISOString(),
                    'created_at_formatted' => $message->created_at->format('M d, Y \a\t h:i A'),
                    'model' => $message->model,
                    'total_tokens' => $this->getMessageTokens($message),
                    'status' => $message->status,
                    'pinned' => $message->pinned,
                ];
            })
        ]);
    }

    /**
     * Enhance conversation data with additional info
     */
    private function enhanceConversationData($conversation)
    {
        $messageCount = AISearchHistory::where('conversation_id', $conversation->conversation_id)->count();
        
        $lastMessage = AISearchHistory::where('conversation_id', $conversation->conversation_id)
            ->orderBy('created_at', 'desc')
            ->first();

        // Calculate conversation tokens
        $conversationTokens = $this->calculateConversationTokensById($conversation->conversation_id);
        $conversationCost = $conversationTokens > 0 ? ($conversationTokens / 1000) * 0.01 : 0;
        $conversationCost = round($conversationCost, 4);

        return [
            'id' => $conversation->id,
            'slug' => $conversation->slug,
            'conversation_id' => $conversation->conversation_id,
            'conversation_title' => $conversation->conversation_title ?? 'Untitled Conversation',
            'query' => $conversation->query,
            'response_preview' => $this->getResponsePreview($conversation),
            'created_at' => $conversation->created_at->toISOString(),
            'created_at_formatted' => $conversation->created_at->format('M d, Y \a\t h:i A'),
            'updated_at' => $lastMessage ? $lastMessage->created_at->toISOString() : $conversation->created_at->toISOString(),
            'updated_at_formatted' => $lastMessage ? $lastMessage->created_at->format('M d, Y \a\t h:i A') : $conversation->created_at->format('M d, Y \a\t h:i A'),
            'share_url' => $conversation->getConversationUrl(),
            'message_count' => $messageCount,
            'total_tokens' => $conversationTokens,
            'conversation_cost' => $conversationCost,
            'thinking_enabled' => $conversation->thinking_enabled,
            'model' => $conversation->model,
            'temperature' => $conversation->temperature,
            'language' => $this->detectLanguage($conversation->query),
            'user' => $conversation->user ? [
                'id' => $conversation->user->id,
                'name' => $conversation->user->name,
                'email' => $conversation->user->email,
            ] : null,
            'session_id' => $conversation->session_id,
            'ip_address' => $conversation->ip_address,
            'status' => $conversation->status ?? 'public',
            'pinned' => $conversation->pinned ?? false,
            'pinned_order' => $conversation->pinned_order,
        ];
    }

    /**
     * Get response preview
     */
    private function getResponsePreview($conversation)
    {
        if (empty($conversation->response)) {
            return 'No response yet';
        }
        
        $plainText = strip_tags($conversation->response);
        return \Illuminate\Support\Str::limit($plainText, 150);
    }

    /**
     * Detect language of query
     */
    private function detectLanguage($query)
    {
        if (preg_match('/[\x{4e00}-\x{9fff}]/u', $query)) {
            return 'zh';
        } elseif (preg_match('/[\x{3040}-\x{309F}\x{30A0}-\x{30FF}]/u', $query)) {
            return 'ja';
        } elseif (preg_match('/[\x{AC00}-\x{D7AF}]/u', $query)) {
            return 'ko';
        } elseif (preg_match('/[\x{0600}-\x{06FF}]/u', $query)) {
            return 'ar';
        } else {
            return 'en';
        }
    }

    /**
     * Get message tokens from usage
     */
    private function getMessageTokens($message)
    {
        if ($message->usage && isset($message->usage['total_tokens'])) {
            return $message->usage['total_tokens'];
        }
        return $message->total_tokens ?? 0;
    }

    /**
     * Calculate total tokens from all messages
     */
    private function calculateTotalTokens()
    {
        $total = 0;
        $messages = AISearchHistory::all();
        foreach ($messages as $message) {
            $total += $this->getMessageTokens($message);
        }
        return $total;
    }

    /**
     * Calculate conversation tokens by ID
     */
    private function calculateConversationTokensById($conversationId)
    {
        $total = 0;
        $messages = AISearchHistory::where('conversation_id', $conversationId)->get();
        foreach ($messages as $message) {
            $total += $this->getMessageTokens($message);
        }
        return $total;
    }

    /**
     * Calculate conversation tokens from message collection
     */
    private function calculateConversationTokens($messages)
    {
        $total = 0;
        foreach ($messages as $message) {
            $total += $this->getMessageTokens($message);
        }
        return $total;
    }

    /**
     * Get overall statistics
     */
    private function getStatistics()
    {
        // Get total conversations (parent messages only)
        $totalConversations = AISearchHistory::whereNull('parent_id')->count();
        
        // Get total messages (all records)
        $totalMessages = AISearchHistory::count();
        
        // Calculate total tokens from usage JSON field
        $totalTokens = $this->calculateTotalTokens();
        
        // Calculate total cost based on token usage (example rate: $0.01 per 1000 tokens)
        $totalCost = $totalTokens > 0 ? round(($totalTokens / 1000) * 0.01, 2) : 0;
        
        // Calculate averages
        $avgMessagesPerConversation = $totalConversations > 0 
            ? round($totalMessages / $totalConversations, 1) 
            : 0;

        $avgTokensPerMessage = $totalMessages > 0 
            ? round($totalTokens / $totalMessages) 
            : 0;

        // Get status counts
        $statusCounts = [
            'public' => AISearchHistory::where('status', 'public')->count(),
            'private' => AISearchHistory::where('status', 'private')->count(),
            'hidden' => AISearchHistory::where('status', 'hidden')->count(),
        ];

        // Get pinned count
        $pinnedCount = AISearchHistory::whereNull('parent_id')
            ->where('pinned', true)
            ->count();

        // Today's conversations
        $todayConversations = AISearchHistory::whereNull('parent_id')
            ->whereDate('created_at', today())
            ->count();

        // This week's conversations
        $thisWeekConversations = AISearchHistory::whereNull('parent_id')
            ->where('created_at', '>=', now()->startOfWeek())
            ->count();

        // This month's conversations
        $thisMonthConversations = AISearchHistory::whereNull('parent_id')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        // Unique users and sessions
        $uniqueUsers = AISearchHistory::whereNotNull('user_id')
            ->distinct('user_id')
            ->count('user_id');
            
        $uniqueSessions = AISearchHistory::whereNotNull('session_id')
            ->distinct('session_id')
            ->count('session_id');

        return [
            'total_conversations' => $totalConversations,
            'total_messages' => $totalMessages,
            'total_tokens' => $totalTokens,
            'total_cost' => $totalCost,
            'avg_messages_per_conversation' => $avgMessagesPerConversation,
            'avg_tokens_per_message' => $avgTokensPerMessage,
            'status_counts' => $statusCounts,
            'pinned_count' => $pinnedCount,
            'today_conversations' => $todayConversations,
            'this_week_conversations' => $thisWeekConversations,
            'this_month_conversations' => $thisMonthConversations,
            'unique_users' => $uniqueUsers,
            'unique_sessions' => $uniqueSessions,
        ];
    }
}