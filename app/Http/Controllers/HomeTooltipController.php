<?php

namespace App\Http\Controllers;

use App\Models\HomeTooltip;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeTooltipController extends Controller
{
    public function index(Request $request): Response
    {
        $query = HomeTooltip::query();
        
        // Filter by group
        if ($request->filled('group')) {
            $query->where('group', $request->group);
        }
        
        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }
        
        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }
        
        // Search by key or content
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('key', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%");
            });
        }
        
        // Get per_page value (default 100, max 500)
        $perPage = min($request->input('per_page', 100), 500);
        
        $tooltips = $query->orderBy('group')
            ->orderBy('sort_order')
            ->orderBy('key')
            ->paginate($perPage)
            ->withQueryString();
        
        return Inertia::render('HomeTooltips/Index', [
            'tooltips' => $tooltips,
            'filters' => [
                'group' => $request->group,
                'type' => $request->type,
                'status' => $request->status,
                'search' => $request->search,
                'per_page' => (int) $perPage,
            ],
            'availableGroups' => HomeTooltip::getAvailableGroups(),
            'availableTypes' => HomeTooltip::getAvailableTypes(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('HomeTooltips/Create', [
            'availableGroups' => HomeTooltip::getAvailableGroups(),
            'availableTypes' => HomeTooltip::getAvailableTypes(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:hometooltips,key',
            'group' => 'required|string|max:255',
            'content' => 'required|string',
            'fallback' => 'nullable|string',
            'type' => 'required|in:tooltip,placeholder,label',
            'metadata' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        // Ensure metadata is stored as JSON
        if (isset($validated['metadata']) && !empty($validated['metadata'])) {
            $validated['metadata'] = json_encode($validated['metadata']);
        } else {
            $validated['metadata'] = null;
        }

        HomeTooltip::create($validated);

        return redirect()->route('hometooltips.index')
            ->with('success', 'Tooltip created successfully.');
    }

    public function edit(HomeTooltip $hometooltip): Response
    {
        // Decode metadata for display
        if ($hometooltip->metadata && is_string($hometooltip->metadata)) {
            $hometooltip->metadata = json_decode($hometooltip->metadata, true);
        }
        
        return Inertia::render('HomeTooltips/Edit', [
            'tooltip' => $hometooltip,
            'availableGroups' => HomeTooltip::getAvailableGroups(),
            'availableTypes' => HomeTooltip::getAvailableTypes(),
        ]);
    }

    public function update(Request $request, HomeTooltip $hometooltip)
    {
        $validated = $request->validate([
            'key' => 'required|string|max:255|unique:hometooltips,key,' . $hometooltip->id,
            'group' => 'required|string|max:255',
            'content' => 'required|string',
            'fallback' => 'nullable|string',
            'type' => 'required|in:tooltip,placeholder,label',
            'metadata' => 'nullable|array',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0'
        ]);

        // Ensure metadata is stored as JSON
        if (isset($validated['metadata']) && !empty($validated['metadata'])) {
            $validated['metadata'] = json_encode($validated['metadata']);
        } else {
            $validated['metadata'] = null;
        }

        $hometooltip->update($validated);

        return redirect()->route('hometooltips.index')
            ->with('success', 'Tooltip updated successfully.');
    }

    public function destroy(HomeTooltip $hometooltip)
    {
        $hometooltip->delete();

        return redirect()->route('hometooltips.index')
            ->with('success', 'Tooltip deleted successfully.');
    }
    
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:hometooltips,id'
        ]);
        
        HomeTooltip::whereIn('id', $validated['ids'])->delete();
        
        return redirect()->route('hometooltips.index')
            ->with('success', 'Tooltips deleted successfully.');
    }
    
    public function clearCache()
    {
        HomeTooltip::clearAllCache();
        
        return redirect()->route('hometooltips.index')
            ->with('success', 'Tooltip cache cleared successfully.');
    }
}