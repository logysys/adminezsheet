<?php
// app/Services/BioLinkExtractorService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\Models\PlatformUser;
use App\Models\UserBioLink;

class BioLinkExtractorService
{
    private $userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
    ];
    
    /**
     * Extract all bio links from a platform by discovering users
     */
    public function extractAllBioLinks(string $platform, array $options = []): array
    {
        $platform = $this->normalizePlatform($platform);
        
        // First, try to discover users on the platform
        $users = $this->discoverUsers($platform, $options);
        
        $results = [];
        
        foreach ($users as $user) {
            try {
                $userData = $this->extractUserBioLinks($platform, $user);
                $results[] = $userData;
                
                // Save to database
                $this->saveToDatabase($platform, $user, $userData);
                
            } catch (\Exception $e) {
                Log::error("Failed to extract from user {$user} on {$platform}: " . $e->getMessage());
                $results[] = [
                    'username' => $user,
                    'error' => $e->getMessage(),
                    'links' => []
                ];
            }
            
            // Rate limiting - be respectful
            if (isset($options['delay'])) {
                usleep($options['delay'] * 1000000);
            } else {
                usleep(1000000); // 1 second default
            }
        }
        
        return $results;
    }
    
    /**
     * Discover users on a platform
     */
    private function discoverUsers(string $platform, array $options = []): array
    {
        // Check cache first
        $cacheKey = "discovered_users_{$platform}";
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }
        
        $users = [];
        
        // Method 1: Try to get from sitemap with better error handling
        $sitemapUsers = $this->getUsersFromSitemap($platform);
        $users = array_merge($users, $sitemapUsers);
        
        // Method 2: Get from database (already discovered users)
        if (class_exists('App\Models\PlatformUser')) {
            try {
                $dbUsers = PlatformUser::where('platform', $platform)
                    ->orderBy('last_crawled_at', 'asc')
                    ->limit(100)
                    ->pluck('username')
                    ->toArray();
                $users = array_merge($users, $dbUsers);
            } catch (\Exception $e) {
                Log::warning("Failed to get users from database: " . $e->getMessage());
            }
        }
        
        // Method 3: Platform-specific discovery
        $platformSpecificUsers = $this->platformSpecificDiscovery($platform);
        $users = array_merge($users, $platformSpecificUsers);
        
        $users = array_values(array_unique($users));
        
        // Limit if specified
        if (isset($options['limit']) && $options['limit'] > 0) {
            $users = array_slice($users, 0, $options['limit']);
        }
        
        // Cache for 1 hour
        Cache::put($cacheKey, $users, now()->addHour());
        
        return $users;
    }
    
    /**
     * Get users from sitemap using regex with better error handling
     */
    private function getUsersFromSitemap(string $platform): array
    {
        $users = [];
        $sitemapUrls = [
            "https://{$platform}/sitemap.xml",
            "https://{$platform}/sitemap_users.xml",
            "https://{$platform}/sitemap/user-sitemap.xml",
            "https://{$platform}/users-sitemap.xml",
            "https://{$platform}/sitemap/users.xml",
        ];
        
        foreach ($sitemapUrls as $sitemapUrl) {
            try {
                $response = $this->makeRequest($sitemapUrl);
                if ($response && $response->successful()) {
                    $body = $response->body();
                    
                    // Handle XML sitemap
                    if (strpos($body, '<?xml') !== false) {
                        // Extract from XML sitemap
                        preg_match_all('/<loc>(.*?)<\/loc>/', $body, $locMatches);
                        foreach ($locMatches[1] as $loc) {
                            if (preg_match('/https?:\/\/' . preg_quote($platform, '/') . '\/([a-zA-Z0-9_\-\.]+)/', $loc, $usernameMatch)) {
                                $username = $usernameMatch[1];
                                if ($this->isValidUsername($username)) {
                                    $users[] = $username;
                                }
                            }
                        }
                    } else {
                        // Extract usernames using regex
                        preg_match_all('/https?:\/\/' . preg_quote($platform, '/') . '\/([a-zA-Z0-9_\-\.]+)/', $body, $matches);
                        if (!empty($matches[1])) {
                            foreach ($matches[1] as $username) {
                                if ($this->isValidUsername($username)) {
                                    $users[] = $username;
                                }
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::warning("Sitemap not available for {$sitemapUrl}: " . $e->getMessage());
                // Sitemap not available, continue
            }
        }
        
        return $users;
    }
    
    /**
     * Platform-specific user discovery with better handling
     */
    private function platformSpecificDiscovery(string $platform): array
    {
        $users = [];
        
        try {
            switch ($platform) {
                case 'linktr.ee':
                    $users = $this->discoverLinktreeUsers();
                    break;
                case 'beacons.ai':
                    $users = $this->discoverBeaconsUsers();
                    break;
                case 'bio.link':
                    $users = $this->discoverBioDotLinkUsers();
                    break;
                case 'campsite.bio':
                    $users = $this->discoverCampsiteUsers();
                    break;
            }
        } catch (\Exception $e) {
            Log::error("Platform discovery failed for {$platform}: " . $e->getMessage());
        }
        
        return $users;
    }
    
    /**
     * Discover Linktree users - uses public API endpoints
     */
    private function discoverLinktreeUsers(): array
    {
        $users = [];
        
        // Try to use Linktree's API endpoints (if available)
        $apiUrls = [
            'https://linktr.ee/api/explore/trending',
            'https://linktr.ee/api/explore/popular',
        ];
        
        foreach ($apiUrls as $apiUrl) {
            try {
                $response = $this->makeRequest($apiUrl, ['Accept: application/json']);
                if ($response && $response->successful()) {
                    $data = $response->json();
                    if (isset($data['data']) && is_array($data['data'])) {
                        foreach ($data['data'] as $item) {
                            if (isset($item['username'])) {
                                $users[] = $item['username'];
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                // API not available
            }
        }
        
        // If no API results, return sample popular users for demo
        if (empty($users)) {
            $users = $this->getSampleUsers('linktr.ee');
        }
        
        return array_slice(array_unique($users), 0, 50);
    }
    
    /**
     * Discover Beacons users
     */
    private function discoverBeaconsUsers(): array
    {
        $users = [];
        
        // Try Beacons API
        try {
            $response = $this->makeRequest('https://beacons.ai/api/explore', ['Accept: application/json']);
            if ($response && $response->successful()) {
                $data = $response->json();
                if (isset($data['users']) && is_array($data['users'])) {
                    foreach ($data['users'] as $user) {
                        if (isset($user['username'])) {
                            $users[] = $user['username'];
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::warning("Beacons API not available");
        }
        
        // Return sample users if no results
        if (empty($users)) {
            $users = $this->getSampleUsers('beacons.ai');
        }
        
        return array_slice(array_unique($users), 0, 50);
    }
    
    /**
     * Discover Bio.link users
     */
    private function discoverBioDotLinkUsers(): array
    {
        $users = [];
        
        // Try Bio.link API
        try {
            $response = $this->makeRequest('https://bio.link/api/discover', ['Accept: application/json']);
            if ($response && $response->successful()) {
                $data = $response->json();
                if (isset($data['users']) && is_array($data['users'])) {
                    foreach ($data['users'] as $user) {
                        if (isset($user['username'])) {
                            $users[] = $user['username'];
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::warning("Bio.link API not available");
        }
        
        if (empty($users)) {
            $users = $this->getSampleUsers('bio.link');
        }
        
        return array_slice(array_unique($users), 0, 50);
    }
    
    /**
     * Discover Campsite users
     */
    private function discoverCampsiteUsers(): array
    {
        $users = [];
        
        try {
            $response = $this->makeRequest('https://campsite.bio/api/discover', ['Accept: application/json']);
            if ($response && $response->successful()) {
                $data = $response->json();
                if (isset($data['users']) && is_array($data['users'])) {
                    foreach ($data['users'] as $user) {
                        if (isset($user['username'])) {
                            $users[] = $user['username'];
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::warning("Campsite API not available");
        }
        
        if (empty($users)) {
            $users = $this->getSampleUsers('campsite.bio');
        }
        
        return array_slice(array_unique($users), 0, 50);
    }
    
    /**
     * Get sample users for demonstration when APIs are blocked
     */
    private function getSampleUsers(string $platform): array
    {
        // Return some common/sample usernames that are likely to exist
        $sampleUsers = [
            'linktr.ee' => ['example', 'demo', 'sample', 'test', 'official', 'creator', 'artist', 'brand'],
            'beacons.ai' => ['example', 'demo', 'sample', 'featured', 'popular', 'trending'],
            'bio.link' => ['example', 'demo', 'sample', 'featured'],
            'campsite.bio' => ['example', 'demo', 'sample', 'featured'],
        ];
        
        return $sampleUsers[$platform] ?? ['example', 'demo', 'sample'];
    }
    
    /**
     * Extract all bio links from a specific user
     */
    public function extractUserBioLinks(string $platform, string $username): array
    {
        $profileUrl = $this->buildProfileUrl($platform, $username);
        
        $response = $this->makeRequest($profileUrl);
        
        if (!$response || !$response->successful()) {
            // Check if user exists by trying a HEAD request first
            $headResponse = $this->makeHeadRequest($profileUrl);
            if (!$headResponse || $headResponse->status() === 404) {
                throw new \Exception("User '{$username}' not found on {$platform}");
            }
            throw new \Exception("Failed to fetch profile: HTTP " . ($response ? $response->status() : 'No response'));
        }
        
        $html = $response->body();
        
        // Extract profile info
        $profileInfo = $this->extractProfileInfoRegex($html, $platform);
        
        // Extract links based on platform
        switch ($platform) {
            case 'linktr.ee':
                $links = $this->extractLinktreeLinksRegex($html);
                break;
            case 'beacons.ai':
                $links = $this->extractBeaconsLinksRegex($html);
                break;
            case 'bio.link':
                $links = $this->extractBioDotLinkLinksRegex($html);
                break;
            default:
                $links = $this->extractGenericLinksRegex($html, $profileUrl);
        }
        
        return [
            'username' => $username,
            'profile_url' => $profileUrl,
            'display_name' => $profileInfo['display_name'],
            'bio' => $profileInfo['bio'],
            'avatar_url' => $profileInfo['avatar_url'],
            'links' => $links,
            'link_count' => count($links),
            'extracted_at' => now()->toIso8601String(),
        ];
    }
    
    /**
     * Extract Linktree links using regex
     */
    private function extractLinktreeLinksRegex(string $html): array
    {
        $links = [];
        
        // Method 1: Extract from JSON data (__NEXT_DATA__)
        if (preg_match('/<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s', $html, $jsonMatches)) {
            $data = json_decode($jsonMatches[1], true);
            if ($data && isset($data['props']['pageProps']['links'])) {
                foreach ($data['props']['pageProps']['links'] as $link) {
                    if (isset($link['url']) && $this->isExternalUrl($link['url'])) {
                        $links[] = [
                            'url' => $link['url'],
                            'title' => $link['title'] ?? $this->extractDomainFromUrl($link['url']),
                            'type' => $link['type'] ?? $this->detectLinkType($link['url'], $link['title'] ?? ''),
                        ];
                    }
                }
                return $this->deduplicateLinks($links);
            }
        }
        
        // Method 2: Extract from anchor tags with link classes
        preg_match_all('/<a[^>]*class="[^"]*link[^"]*"[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/is', $html, $matches);
        
        foreach ($matches[1] as $index => $href) {
            $text = strip_tags($matches[2][$index] ?? '');
            $text = html_entity_decode(trim($text));
            
            if ($this->isExternalUrl($href)) {
                $links[] = [
                    'url' => $href,
                    'title' => $text ?: $this->extractDomainFromUrl($href),
                    'type' => $this->detectLinkType($href, $text),
                ];
            }
        }
        
        return $this->deduplicateLinks($links);
    }
    
    /**
     * Extract Beacons links using regex
     */
    private function extractBeaconsLinksRegex(string $html): array
    {
        $links = [];
        
        // Try to extract from JSON
        if (preg_match('/<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s', $html, $jsonMatches)) {
            $data = json_decode($jsonMatches[1], true);
            if ($data && isset($data['props']['pageProps']['links'])) {
                foreach ($data['props']['pageProps']['links'] as $link) {
                    if (isset($link['url']) && $this->isExternalUrl($link['url'])) {
                        $links[] = [
                            'url' => $link['url'],
                            'title' => $link['title'] ?? $this->extractDomainFromUrl($link['url']),
                            'type' => $link['type'] ?? $this->detectLinkType($link['url'], $link['title'] ?? ''),
                        ];
                    }
                }
                return $this->deduplicateLinks($links);
            }
        }
        
        // Extract from anchor tags
        preg_match_all('/<a[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/is', $html, $matches);
        
        foreach ($matches[1] as $index => $href) {
            $text = strip_tags($matches[2][$index] ?? '');
            $text = html_entity_decode(trim($text));
            
            // Skip internal links
            if ($this->isExternalUrl($href) && strpos($href, '/redirect/') === false) {
                $links[] = [
                    'url' => $href,
                    'title' => $text ?: $this->extractDomainFromUrl($href),
                    'type' => $this->detectLinkType($href, $text),
                ];
            }
        }
        
        return $this->deduplicateLinks($links);
    }
    
    /**
     * Extract Bio.link links using regex
     */
    private function extractBioDotLinkLinksRegex(string $html): array
    {
        $links = [];
        
        preg_match_all('/<a[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/is', $html, $matches);
        
        foreach ($matches[1] as $index => $href) {
            $text = strip_tags($matches[2][$index] ?? '');
            $text = html_entity_decode(trim($text));
            
            if ($this->isExternalUrl($href)) {
                $links[] = [
                    'url' => $href,
                    'title' => $text ?: $this->extractDomainFromUrl($href),
                    'type' => $this->detectLinkType($href, $text),
                ];
            }
        }
        
        return $this->deduplicateLinks($links);
    }
    
    /**
     * Extract generic links using regex
     */
    private function extractGenericLinksRegex(string $html, string $profileUrl): array
    {
        $links = [];
        $baseHost = parse_url($profileUrl, PHP_URL_HOST);
        
        preg_match_all('/<a[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)<\/a>/is', $html, $matches);
        
        foreach ($matches[1] as $index => $href) {
            $text = strip_tags($matches[2][$index] ?? '');
            $text = html_entity_decode(trim($text));
            
            if ($this->isExternalUrl($href)) {
                $linkHost = parse_url($href, PHP_URL_HOST);
                
                // Skip if same as profile host
                if ($linkHost !== $baseHost) {
                    $links[] = [
                        'url' => $href,
                        'title' => $text ?: $this->extractDomainFromUrl($href),
                        'type' => $this->detectLinkType($href, $text),
                    ];
                }
            }
        }
        
        return $this->deduplicateLinks($links);
    }
    
    /**
     * Extract profile info using regex
     */
    private function extractProfileInfoRegex(string $html, string $platform): array
    {
        $info = [
            'display_name' => null,
            'bio' => null,
            'avatar_url' => null,
        ];
        
        // Try to extract from JSON first
        if (preg_match('/<script[^>]*id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s', $html, $jsonMatches)) {
            $data = json_decode($jsonMatches[1], true);
            if ($data) {
                $props = $data['props']['pageProps'] ?? [];
                $info['display_name'] = $props['name'] ?? $props['displayName'] ?? null;
                $info['bio'] = $props['bio'] ?? $props['description'] ?? null;
                $info['avatar_url'] = $props['avatar'] ?? $props['avatarUrl'] ?? null;
                
                if ($info['display_name']) {
                    return $info;
                }
            }
        }
        
        // Extract display name
        if (preg_match('/<h1[^>]*>(.*?)<\/h1>/is', $html, $matches)) {
            $info['display_name'] = trim(strip_tags($matches[1]));
        } elseif (preg_match('/<div[^>]*class="[^"]*name[^"]*"[^>]*>(.*?)<\/div>/is', $html, $matches)) {
            $info['display_name'] = trim(strip_tags($matches[1]));
        }
        
        // Extract bio
        if (preg_match('/<div[^>]*class="[^"]*bio[^"]*"[^>]*>(.*?)<\/div>/is', $html, $matches)) {
            $info['bio'] = trim(strip_tags($matches[1]));
        } elseif (preg_match('/<p[^>]*class="[^"]*bio[^"]*"[^>]*>(.*?)<\/p>/is', $html, $matches)) {
            $info['bio'] = trim(strip_tags($matches[1]));
        } elseif (preg_match('/<meta[^>]*name="description"[^>]*content="([^"]+)"/i', $html, $matches)) {
            $info['bio'] = trim($matches[1]);
        }
        
        // Extract avatar URL
        if (preg_match('/<img[^>]*class="[^"]*avatar[^"]*"[^>]*src="([^"]+)"/i', $html, $matches)) {
            $info['avatar_url'] = $matches[1];
        }
        
        return $info;
    }
    
    /**
     * Build profile URL based on platform
     */
    private function buildProfileUrl(string $platform, string $username): string
    {
        $platform = rtrim($platform, '/');
        $username = ltrim($username, '/');
        
        return "https://{$platform}/{$username}";
    }
    
    /**
     * Make HEAD request
     */
    private function makeHeadRequest(string $url)
    {
        $userAgent = $this->userAgents[array_rand($this->userAgents)];
        
        return Http::withHeaders([
            'User-Agent' => $userAgent,
            'Accept' => '*/*',
        ])->withOptions([
            'verify' => false,
            'timeout' => 10,
            'decode_content' => false, // Don't auto-decode content
        ])->head($url);
    }
    
    /**
     * Make HTTP request with proper headers
     */
    private function makeRequest(string $url, array $extraHeaders = [])
    {
        $userAgent = $this->userAgents[array_rand($this->userAgents)];
        
        $headers = array_merge([
            'User-Agent' => $userAgent,
            'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language' => 'en-US,en;q=0.5',
            'Connection' => 'keep-alive',
            'Upgrade-Insecure-Requests' => '1',
        ], $extraHeaders);
        
        try {
            return Http::withHeaders($headers)
                ->withOptions([
                    'verify' => false,
                    'timeout' => 30,
                    'decode_content' => false, // Don't auto-decode, handle manually if needed
                    'stream' => false,
                    'allow_redirects' => [
                        'max' => 5,
                        'strict' => true,
                        'referer' => true,
                        'protocols' => ['http', 'https'],
                        'track_redirects' => true,
                    ],
                ])
                ->get($url);
        } catch (\Exception $e) {
            Log::error("Request failed for {$url}: " . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Normalize platform URL
     */
    private function normalizePlatform(string $platform): string
    {
        $platform = strtolower(trim($platform));
        $platform = preg_replace('#^https?://#', '', $platform);
        $platform = preg_replace('#^www\.#', '', $platform);
        $platform = rtrim($platform, '/');
        
        return $platform;
    }
    
    /**
     * Check if username is valid
     */
    private function isValidUsername(string $username): bool
    {
        $invalidUsernames = ['explore', 'trending', 'popular', 'search', 'discover', 'about', 'contact', 'privacy', 'terms', 'api', 'login', 'signup', 'register', 'sitemap', 'robots.txt'];
        
        if (in_array(strtolower($username), $invalidUsernames)) {
            return false;
        }
        
        return preg_match('/^[a-zA-Z0-9_\-\.]{3,50}$/', $username) === 1;
    }
    
    /**
     * Check if URL is external
     */
    private function isExternalUrl(string $url): bool
    {
        if (empty($url)) return false;
        if (strpos($url, 'javascript:') === 0) return false;
        if (strpos($url, 'mailto:') === 0) return false;
        if (strpos($url, 'tel:') === 0) return false;
        if ($url[0] === '/') return false;
        if (strpos($url, '#') === 0) return false;
        
        return filter_var($url, FILTER_VALIDATE_URL) !== false &&
               (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0);
    }
    
    /**
     * Extract domain from URL for title
     */
    private function extractDomainFromUrl(string $url): string
    {
        $host = parse_url($url, PHP_URL_HOST);
        $host = preg_replace('/^www\./', '', $host);
        return $host ?: $url;
    }
    
    /**
     * Detect link type
     */
    private function detectLinkType(string $url, string $title): string
    {
        $urlLower = strtolower($url);
        $titleLower = strtolower($title);
        
        $socialPlatforms = ['instagram', 'facebook', 'twitter', 'linkedin', 'youtube', 'tiktok', 'snapchat', 'pinterest', 'reddit', 'twitch', 'discord', 'telegram', 'whatsapp', 'threads'];
        
        foreach ($socialPlatforms as $platform) {
            if (strpos($urlLower, $platform) !== false || strpos($titleLower, $platform) !== false) {
                return 'social';
            }
        }
        
        $ecommerceKeywords = ['shop', 'store', 'product', 'buy', 'etsy', 'amazon', 'shopify', 'checkout', 'cart'];
        foreach ($ecommerceKeywords as $keyword) {
            if (strpos($urlLower, $keyword) !== false || strpos($titleLower, $keyword) !== false) {
                return 'ecommerce';
            }
        }
        
        return 'website';
    }
    
    /**
     * Remove duplicate links
     */
    private function deduplicateLinks(array $links): array
    {
        $unique = [];
        $seen = [];
        
        foreach ($links as $link) {
            $url = $link['url'];
            if (!in_array($url, $seen)) {
                $seen[] = $url;
                $unique[] = $link;
            }
        }
        
        return $unique;
    }
    
    /**
     * Save extracted data to database
     */
    private function saveToDatabase(string $platform, string $username, array $data): void
    {
        if (!class_exists('App\Models\PlatformUser')) {
            return;
        }
        
        try {
            // Find or create platform user
            $user = PlatformUser::updateOrCreate(
                [
                    'platform' => $platform,
                    'username' => $username,
                ],
                [
                    'profile_url' => $data['profile_url'],
                    'display_name' => $data['display_name'] ?? null,
                    'bio' => $data['bio'] ?? null,
                    'avatar_url' => $data['avatar_url'] ?? null,
                    'last_crawled_at' => now(),
                ]
            );
            
            // Delete old links
            UserBioLink::where('platform_user_id', $user->id)->delete();
            
            // Save new links
            foreach ($data['links'] as $position => $link) {
                UserBioLink::create([
                    'platform_user_id' => $user->id,
                    'title' => $link['title'] ?? null,
                    'url' => $link['url'],
                    'type' => $link['type'] ?? 'website',
                    'position' => $position,
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Failed to save to database: " . $e->getMessage());
        }
    }
}