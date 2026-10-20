<?php

namespace App\Http\Controllers;

use App\Models\AITooltip;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AITooltipController extends Controller
{
    public function index(Request $request)
    {
        $query = AITooltip::query();

        // Search filter (searches in reference and description)
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('reference', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Page filter - CHANGED FROM 'page' TO 'page_name'
        if ($request->has('page_name') && !empty($request->page_name)) {
            $query->where('page', $request->page_name);
        }

        // Category filter
        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        // Sort by created_at descending (newest first)
        $query->orderBy('created_at', 'desc');

        $aiTooltips = $query->paginate(100)->withQueryString();
        
        return Inertia::render('AITooltip/Index', [
            'aiTooltips' => $aiTooltips,
            'filters' => $request->only(['search', 'page_name', 'category']),
        ]);
    }

    public function create()
    {
        return Inertia::render('AITooltip/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'reference' => 'required|string|max:255|unique:ai_tooltips,reference',
            'component' => 'nullable|string|max:255',
            'page' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'tooltips' => 'required|string',
            'description' => 'nullable|string',
        ]);

        // Convert the textarea content to JSON array
        $tooltipsArray = array_map('trim', explode("\n", $request->tooltips));
        $tooltipsArray = array_filter($tooltipsArray); // Remove empty lines
        $tooltipsArray = array_values($tooltipsArray); // Reset array keys

        AITooltip::create([
            'reference' => $request->reference,
            'component' => $request->component,
            'page' => $request->page,
            'category' => $request->category,
            'tooltips' => json_encode($tooltipsArray),
            'description' => $request->description,
        ]);

        return redirect()->route('ai-tooltips.index')->with('success', 'AI Tooltip created successfully.');
    }

    public function edit(AITooltip $aiTooltip)
    {
        // Convert the JSON array back to newline-separated string for editing
        $aiTooltip->tooltips = implode("\n", $aiTooltip->tooltips ?? []);

        return Inertia::render('AITooltip/Edit', [
            'aiTooltip' => $aiTooltip,
        ]);
    }

    public function update(Request $request, AITooltip $aiTooltip): RedirectResponse
    {
        $request->validate([
            'reference' => 'required|string|max:255|unique:ai_tooltips,reference,' . $aiTooltip->id,
            'component' => 'nullable|string|max:255',
            'page' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'tooltips' => 'required|string',
            'description' => 'nullable|string',
        ]);

        // Convert the textarea content to JSON array
        $tooltipsArray = array_map('trim', explode("\n", $request->tooltips));
        $tooltipsArray = array_filter($tooltipsArray); // Remove empty lines
        $tooltipsArray = array_values($tooltipsArray); // Reset array keys

        $aiTooltip->update([
            'reference' => $request->reference,
            'component' => $request->component,
            'page' => $request->page,
            'category' => $request->category,
            'tooltips' => json_encode($tooltipsArray),
            'description' => $request->description,
        ]);

        return redirect()->route('ai-tooltips.index')->with('success', 'AI Tooltip updated successfully.');
    }

    public function destroy(AITooltip $aiTooltip): RedirectResponse
    {
        $aiTooltip->delete();

        return redirect()->route('ai-tooltips.index')->with('success', 'AI Tooltip deleted successfully.');
    }
}