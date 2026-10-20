<?php
// app/Http/Controllers/BioLinkExtractorController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\BioLinkExtractorService;
use App\Models\PlatformUser;
use App\Models\UserBioLink;
use Inertia\Inertia;

class BioLinkExtractorController extends Controller
{
    protected $extractor;
    
    public function __construct(BioLinkExtractorService $extractor)
    {
        $this->extractor = $extractor;
    }
    
    /**
     * Show the extractor form
     */
    public function index()
    {
        $recentExtractions = PlatformUser::with('bioLinks')
            ->orderBy('last_crawled_at', 'desc')
            ->limit(20)
            ->get();
            
        $stats = [
            'total_users' => PlatformUser::count(),
            'total_links' => UserBioLink::count(),
            'platforms' => PlatformUser::select('platform')->distinct()->pluck('platform'),
        ];
        
        return Inertia::render('BioLinkExtractor/Index', [
            'recentExtractions' => $recentExtractions,
            'stats' => $stats,
        ]);
    }
    
    /**
     * Extract links from a specific user
     */
    public function extractUser(Request $request)
    {
        $request->validate([
            'platform' => 'required|string|max:255',
            'username' => 'required|string|max:255',
        ]);
        
        try {
            $result = $this->extractor->extractUserBioLinks(
                $request->platform,
                $request->username
            );
            
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Extract links from multiple users on a platform
     */
    public function extractPlatform(Request $request)
    {
        $request->validate([
            'platform' => 'required|string|max:255',
            'usernames' => 'nullable|array',
            'usernames.*' => 'string|max:255',
            'auto_discover' => 'boolean',
            'limit' => 'nullable|integer|min:1|max:500',
        ]);
        
        $usernames = $request->usernames ?? [];
        $autoDiscover = $request->auto_discover ?? true;
        $limit = $request->limit ?? 100;
        
        $results = [];
        
        if ($autoDiscover && empty($usernames)) {
            // Extract all discovered users
            $options = ['limit' => $limit, 'delay' => 0.5];
            $results = $this->extractor->extractAllBioLinks($request->platform, $options);
        } elseif (!empty($usernames)) {
            // Extract specific users
            foreach ($usernames as $username) {
                try {
                    $result = $this->extractor->extractUserBioLinks($request->platform, $username);
                    $results[] = $result;
                } catch (\Exception $e) {
                    $results[] = [
                        'username' => $username,
                        'error' => $e->getMessage(),
                        'links' => [],
                    ];
                }
            }
        }
        
        return response()->json([
            'success' => true,
            'platform' => $request->platform,
            'total_users' => count($results),
            'results' => $results,
        ]);
    }
    
    /**
     * Get all extracted users
     */
    public function getUsers(Request $request)
    {
        $users = PlatformUser::with('bioLinks')
            ->when($request->platform, function ($query, $platform) {
                $query->where('platform', $platform);
            })
            ->orderBy('last_crawled_at', 'desc')
            ->paginate(50);
            
        return response()->json($users);
    }
    
    /**
     * Get links for a specific user
     */
    public function getUserLinks($userId)
    {
        $user = PlatformUser::with('bioLinks')->findOrFail($userId);
        
        return response()->json([
            'user' => $user,
            'links' => $user->bioLinks,
        ]);
    }
    
    /**
     * Export all links as CSV
     */
    public function export(Request $request)
    {
        $request->validate([
            'platform' => 'nullable|string',
            'format' => 'in:csv,json',
        ]);
        
        $query = UserBioLink::with('user');
        
        if ($request->platform) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('platform', $request->platform);
            });
        }
        
        $links = $query->get();
        
        if ($request->format === 'json') {
            return response()->json($links);
        }
        
        // CSV Export
        $filename = 'bio-links-export-' . date('Y-m-d') . '.csv';
        $handle = fopen('php://temp', 'w');
        
        // Add headers
        fputcsv($handle, ['Platform', 'Username', 'Profile URL', 'Link Title', 'Link URL', 'Link Type', 'Extracted At']);
        
        foreach ($links as $link) {
            fputcsv($handle, [
                $link->user->platform,
                $link->user->username,
                $link->user->profile_url,
                $link->title,
                $link->url,
                $link->type,
                $link->created_at,
            ]);
        }
        
        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);
        
        return response($csv, 200)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename={$filename}");
    }
}