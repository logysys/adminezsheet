<?php

namespace App\Http\Controllers;

use App\Models\AiSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiSettingController extends Controller
{
    /**
     * Display the AI settings page.
     */
    public function index(): Response
    {
        // Get or create settings
        $settings = AiSetting::first();
        
        if (!$settings) {
            $settings = AiSetting::create([
                'guest_ai_enabled' => true,
                'guest_char_limit' => 1000,
                'user_ai_enabled' => true,
                'user_char_limit' => 5000,
            ]);
        }

        return Inertia::render('Settings/AiSettings', [
            'settings' => $settings
        ]);
    }

    /**
     * Update the AI settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'guest_ai_enabled' => 'required|boolean',
            'guest_char_limit' => 'required|integer|min:100|max:10000',
            'user_ai_enabled' => 'required|boolean',
            'user_char_limit' => 'required|integer|min:100|max:100000',
        ]);

        $settings = AiSetting::first();
        
        if (!$settings) {
            $settings = new AiSetting();
        }

        $settings->fill($validated);
        $settings->save();

        return redirect()->back()->with('success', 'AI settings updated successfully.');
    }
}