<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display the settings page.
     */
    public function index(): Response
    {
        // Get or create settings
        $settings = Setting::first();
        
        if (!$settings) {
            $settings = Setting::create([
                'scraping' => 'OFF',
                'mode' => 'NO',
                'social' => 'YES',
                'widget' => 'NO',
                'slidget' => 'NO',
                'webring' => 'NO',
                'flysign' => 'NO',
                'hours' => 24,
                'minutes' => 60,
                'lockday' => 7,
                'handlelimit' => 0,
                'signupbonus' => 0,
                'up' => '⬆️',
                'down' => '⬇️',
                'color' => '#000000',
                'customcolor' => null,
                'domaincolor' => '#3eb80a',
                'default_coupon_code' => '#1010',
                'set' => null,
                'flycustom' => null,
                'flydefault' => null,
                'sitemapupdate' => null,
                'sitemapcustom' => null,
                'sitemapdomain' => null,
                'mailuid' => null,
                'mailuidjunk' => null,
                'scrapingurl' => json_encode([]),
                'scrapingtip_en' => json_encode([]),
                'scrapingtip_cn' => json_encode([]),
                'scrapingtip_hindi' => json_encode([]),
            ]);
        }

        return Inertia::render('Settings/Index', [
            'settings' => $settings
        ]);
    }

    /**
     * Update settings.
     */
    public function change(Request $request)
    {
        try {
            // Get the settings record
            $settings = Setting::first();
            
            if (!$settings) {
                $settings = new Setting();
            }
            
            // Get all request data
            $data = $request->all();
            
            // Define valid values for enum fields
            $enumFields = [
                'scraping' => ['ON', 'OFF'],
                'mode' => ['YES', 'NO'],
                'social' => ['YES', 'NO'],
                'widget' => ['YES', 'NO'],
                'slidget' => ['YES', 'NO'],
                'webring' => ['YES', 'NO'],
                'flysign' => ['YES', 'NO']
            ];
            
            // Define fields that need JSON encoding
            $jsonFields = ['scrapingurl', 'scrapingtip_en', 'scrapingtip_cn', 'scrapingtip_hindi'];
            
            // Define numeric fields
            $numericFields = ['hours', 'minutes', 'lockday', 'handlelimit', 'signupbonus', 'sitemapupdate', 'sitemapcustom', 'sitemapdomain'];
            
            // Update each field
            foreach ($data as $key => $value) {
                // Skip non-fillable fields
                if (!in_array($key, $settings->getFillable())) {
                    continue;
                }
                
                // Skip if value is null and field is not nullable
                if ($value === null && !in_array($key, ['set', 'flycustom', 'flydefault', 'customcolor', 'mailuid', 'mailuidjunk'])) {
                    continue;
                }
                
                // Handle enum fields - ensure valid values
                if (isset($enumFields[$key])) {
                    if (in_array($value, $enumFields[$key])) {
                        $settings->$key = $value;
                    } else {
                        // Default to first valid value if invalid
                        $settings->$key = $enumFields[$key][0];
                    }
                }
                // Handle JSON fields
                elseif (in_array($key, $jsonFields)) {
                    if (is_array($value)) {
                        // Filter out empty strings
                        $value = array_filter($value, function($item) {
                            return !empty($item) && $item !== null;
                        });
                        $settings->$key = json_encode(array_values($value));
                    } elseif (is_string($value) && !empty($value)) {
                        $settings->$key = $value;
                    } else {
                        $settings->$key = json_encode([]);
                    }
                } 
                // Handle numeric fields
                elseif (in_array($key, $numericFields)) {
                    $settings->$key = is_numeric($value) ? (int)$value : 0;
                }
                // Handle color fields
                elseif (in_array($key, ['color', 'customcolor', 'domaincolor'])) {
                    $settings->$key = $value && preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $value) ? $value : '#000000';
                }
                // Handle string fields with length limits
                elseif ($key === 'default_coupon_code') {
                    // Truncate to 255 characters max
                    $settings->$key = $value ? substr($value, 0, 255) : '#1010';
                }
                // Handle all other fields
                else {
                    $settings->$key = $value;
                }
            }
            
            // Save the settings
            $settings->save();
            
            return redirect()->back()->with('success', 'Settings updated successfully.');
            
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error saving settings: ' . $e->getMessage());
        }
    }

    /**
     * Get settings as JSON (for API endpoints)
     */
    public function getSettings()
    {
        $settings = Setting::first();
        
        if (!$settings) {
            $settings = Setting::create();
        }
        
        return response()->json([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Get scraping configuration
     */
    public function getScrapingConfig()
    {
        $settings = Setting::first();
        
        return response()->json([
            'enabled' => $settings?->isScrapingEnabled() ?? false,
            'urls' => $settings?->getScrapingUrls() ?? [],
            'tips' => [
                'en' => $settings?->scrapingtip_en ?? [],
                'cn' => $settings?->scrapingtip_cn ?? [],
                'hindi' => $settings?->scrapingtip_hindi ?? [],
            ],
            'schedule' => [
                'hours' => $settings?->hours ?? 24,
                'minutes' => $settings?->minutes ?? 60,
                'total_minutes' => $settings?->getScheduleIntervalMinutes() ?? 1440
            ]
        ]);
    }

    /**
     * Reset settings to default values
     */
    public function reset()
    {
        $settings = Setting::first();
        
        if ($settings) {
            $settings->delete();
        }
        
        $defaultSettings = Setting::create([
            'scraping' => 'OFF',
            'mode' => 'NO',
            'social' => 'YES',
            'widget' => 'NO',
            'slidget' => 'NO',
            'webring' => 'NO',
            'flysign' => 'NO',
            'hours' => 24,
            'minutes' => 60,
            'lockday' => 7,
            'handlelimit' => 0,
            'signupbonus' => 0,
            'up' => '⬆️',
            'down' => '⬇️',
            'color' => '#000000',
            'customcolor' => null,
            'domaincolor' => '#3eb80a',
            'default_coupon_code' => '#1010',
            'set' => null,
            'flycustom' => null,
            'flydefault' => null,
            'sitemapupdate' => null,
            'sitemapcustom' => null,
            'sitemapdomain' => null,
            'mailuid' => null,
            'mailuidjunk' => null,
            'scrapingurl' => json_encode([]),
            'scrapingtip_en' => json_encode([]),
            'scrapingtip_cn' => json_encode([]),
            'scrapingtip_hindi' => json_encode([]),
        ]);

        return redirect()->route('settings')->with('success', 'Settings reset to default values.');
    }

    /**
     * Export all settings as JSON
     */
    public function export()
    {
        $settings = Setting::first();
        
        if (!$settings) {
            return response()->json(['error' => 'No settings found'], 404);
        }
        
        return response()->json($settings, 200, [
            'Content-Disposition' => 'attachment; filename="settings-export.json"'
        ]);
    }

    /**
     * Import settings from JSON
     */
    public function import(Request $request)
    {
        $request->validate([
            'settings_file' => 'required|file|mimes:json|max:2048'
        ]);
        
        $content = json_decode($request->file('settings_file')->get(), true);
        
        if (!$content) {
            return redirect()->back()->with('error', 'Invalid JSON file.');
        }
        
        $settings = Setting::first();
        if (!$settings) {
            $settings = new Setting();
        }
        
        // Only import allowed fields
        $allowedFields = $settings->getFillable();
        foreach ($content as $key => $value) {
            if (in_array($key, $allowedFields)) {
                if (in_array($key, ['scrapingurl', 'scrapingtip_en', 'scrapingtip_cn', 'scrapingtip_hindi']) && is_array($value)) {
                    $settings->$key = json_encode(array_values($value));
                } else {
                    $settings->$key = $value;
                }
            }
        }
        
        $settings->save();
        
        return redirect()->route('settings')->with('success', 'Settings imported successfully.');
    }
}