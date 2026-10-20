<?php

namespace App\Http\Controllers;

use App\Models\EzFunnel;
use App\Models\EzFunnelField;
use App\Models\FunnelLogoSetting;
use App\Models\FunnelSeoSetting;
use App\Models\EffectSetting; 
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class FunnelDefaultController extends Controller
{
    // Constant for the specific funnel ID
    const FUNNEL_ID = 40;
    
    /**
     * Show the form for editing funnel with ID 40.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit()
    {
        // Find the specific funnel with ID 40
        $funnel = EzFunnel::with([
            'fields' => function($query) {
                $query->orderBy('position', 'asc');
            },
            'seoSettings',
            'logoSettings',
            'effectSettings',
            'customDomains',
            'handleDomains',
            'user'
        ])->findOrFail(self::FUNNEL_ID);

        // Get available templates
        $templates = Template::where('status', 'active')->get();
        
        return Inertia::render('Defaultfunnels/Index', [
            'funnel' => $funnel,
            'templates' => $templates,
        ]);
    }

    /**
     * Update funnel with ID 40 in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        
		
        $ezFunnel = EzFunnel::findOrFail($request->id);
        
        // Update main funnel data
        $updateData = [
            'fly_sign' => $request->flySign,
            'eye_tracking' => $request->eyeTracking,
            'seo_tag' => $request->seoTag,
            'theme' => $request->theme,
            'color' => $request->color,
            'transparency' => $request->transparency,
            'mode' => $request->mode,
        ];
        
        $ezFunnel->update($updateData);
        
        // Delete existing fields
        EzFunnelField::where('ez_funnel_id', $request->id)->delete();
        
        // Update or create fields
        foreach ($request->dynamicFields as $index => $fieldData) {
            EzFunnelField::create([
                'ez_funnel_id' => $ezFunnel->id,
                'emoji_marker' => $fieldData['emojiMarker'],
                'font_size' => $fieldData['fontSize'],
                'caption' => $fieldData['caption'] ?? '',
                'reference' => $fieldData['reference'] ?? '',
                'url' => $fieldData['url'] ?? '',
                'orignal_url' => $fieldData['url'] ?? '',
                'pinned' => $fieldData['pinned'],
                'custom_width' => $fieldData['customWidth'] ?? 33,
                'position' => $index,
            ]);
        }
        
        // Reload the updated funnel with relationships
        $updatedFunnel = EzFunnel::with([
            'fields' => function($query) {
                $query->orderBy('position', 'asc');
            },
            'seoSettings',
            'logoSettings'
        ])->findOrFail($request->id);

        return redirect()->route('funnel-default.edit')
            ->with('success', 'Funnel updated successfully.')
            ->with('funnel', $updatedFunnel);
    }

    /**
     * Get funnel with ID 40 data (for API or AJAX requests)
     *
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        $funnel = EzFunnel::with([
            'fields' => function($query) {
                $query->orderBy('position', 'asc');
            },
            'seoSettings',
            'logoSettings'
        ])->findOrFail(self::FUNNEL_ID);

        return response()->json($funnel);
    }
	
	/**
     * Show the form for editing UI settings.
     *
     * @return \Illuminate\Http\Response
     */
    public function editUI()
{
    $funnel = EzFunnel::with([
        'effectSettings', // This should return a collection of effect settings
        'seoSettings',
        'logoSettings'
    ])->findOrFail(self::FUNNEL_ID);

    $templates = Template::where('status', 'active')->get();

    // If no effect settings exist, create a default one
    if ($funnel->effectSettings->isEmpty()) {
        $funnel->effectSettings->push(new EffectSetting([
            'moving_effect' => 'bee',
            'moving_pattern' => 'none',
            'brand_message' => '',
            'avatar_link' => '',
            'landing_page' => '',
        ]));
    }
    return Inertia::render('Defaultfunnels/ezui', [
        'funnel' => $funnel,
        'templates' => $templates,
    ]);
}

    /**
     * Show the form for editing logo settings.
     *
     * @return \Illuminate\Http\Response
     */
    public function editLogo()
    {
        $funnel = EzFunnel::with('logoSettings')->findOrFail(self::FUNNEL_ID);

        return Inertia::render('Defaultfunnels/logo', [
            'funnel' => $funnel,
        ]);
    }

    /**
     * Show the form for editing SEO settings.
     *
     * @return \Illuminate\Http\Response
     */
    public function editSeo()
	{
		$funnel = EzFunnel::with(['seoSettings'])
			->findOrFail(self::FUNNEL_ID);
			
		// Make sure canonical_url is accessible
		if (!$funnel->canonical_url) {
			$funnel->canonical_url = 'https://ez.wiki/' . $funnel->id;
		}

		return Inertia::render('Defaultfunnels/seo', [
			'funnel' => $funnel,
		]);
	}
	
	/**
     * Update UI settings for funnel.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateUI(Request $request)
{

    return DB::transaction(function () use ($request) {
        $ezFunnel = EzFunnel::findOrFail($request->id);
        
        // Update main funnel data
        $updateData = [
            'fly_sign' => $request->flySign,
            'eye_tracking' => $request->eyeTracking,
            'mode' => $request->mode,
            'freestyle_mode' => $request->freestyleMode,
            'theme' => $request->theme,
        ];
        
        $ezFunnel->update($updateData);
        
        // Delete all existing effect settings for this funnel
        EffectSetting::where('ez_funnel_id', $ezFunnel->id)->delete();
        
        // Create new effect settings for each form
        foreach ($request->effectForms as $effectForm) {
            EffectSetting::create([
                'ez_funnel_id' => $ezFunnel->id,
                'moving_effect' => $effectForm['movingEffect'] ?? null,
                'moving_pattern' => $effectForm['movingPattern'] ?? null,
                'brand_message' => $effectForm['flySignMessage'] ?? null,
                'avatar_link' => $effectForm['avatarLink'] ?? null,
                'landing_page' => $effectForm['landingPage'] ?? null,
            ]);
        }

        // Reload the updated funnel with relationships
        $updatedFunnel = EzFunnel::with([
            'effectSettings',
            'seoSettings',
            'logoSettings'
        ])->findOrFail($request->id);

        return redirect()->route('funnel-ui.edit')
            ->with('success', 'UI settings updated successfully.')
            ->with('funnel', $updatedFunnel);
    });
}

    /**
     * Update logo settings for funnel.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateLogo(Request $request)
    {
		$funnel = EzFunnel::where('id', $request->id)
        ->firstOrFail();

    $logoPath = null;
    if ($request->hasFile('logoImage')) {
        // Delete old logo if it exists
        if ($funnel->logoSettings && $funnel->logoSettings->logoimage) {
            $oldImagePath = public_path($funnel->logoSettings->logoimage);
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }

        $image = $request->file('logoImage');
        $imageName = time() . '_.' . $image->getClientOriginalExtension();
        $destinationPath = public_path('logoimage');
        
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }
        
        $image->move($destinationPath, $imageName);
        $logoPath = 'logoimage/' . $imageName;
    } else {
        $logoPath = $request->url;
    }

    $logoData = [
        'logoimage' => $logoPath,
        'fly_sign_logo' => $request->flySign,
        'favicon_logo' => $request->favicon,
        'meta_logo' => $request->metaLogo,
        'secondary_logo' => $request->secondaryLogo
    ];

    // Filter out null values to prevent overwriting existing logos with null
    $logoData = array_filter($logoData, function($value) {
        return $value !== null;
    });

    // Update or create logo settings through the relationship
    if ($funnel->logoSettings) {
        $funnel->logoSettings()->update($logoData);
    } else {
        $funnel->logoSettings()->create($logoData);
    }

    $updatedFunnel = EzFunnel::with('logoSettings')->findOrFail($request->id);

            return redirect()->route('funnel-logo.edit')
                ->with('success', 'Logo settings updated successfully.')
                ->with('funnel', $updatedFunnel);
    }

    /**
     * Update SEO settings for funnel.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateSeo(Request $request)
{
	$funnel = EzFunnel::findOrFail(self::FUNNEL_ID);
	$funnel->seoSettings()->updateOrCreate(
            ['funnel_id' => $funnel->id], // Conditions to find the record
            [
                'meta_title'       => $request->meta_title,
                'meta_keywords'    => $request->meta_keywords,
                'meta_description' => $request->meta_description,
                'meta_logo'        => $request->meta_logo,
                'meta_site_name'   => $request->meta_site_name,
                'meta_site_url'    => $request->canonical_url, 
            ]
        );
    $funnel = EzFunnel::with(['seoSettings'])
			->findOrFail(self::FUNNEL_ID);

        return redirect()->route('funnel-seo.edit')
            ->with('success', 'SEO settings updated successfully.')
            ->with('funnel', $funnel);
}

}