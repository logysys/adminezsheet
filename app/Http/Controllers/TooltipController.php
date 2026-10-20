<?php

namespace App\Http\Controllers;

use App\Models\Tooltip;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TooltipController extends Controller
{
    public function index()
    {
        $tooltips = Tooltip::paginate(100);
        
        return Inertia::render('Tooltip/Index', [
            'tooltips' => $tooltips,
        ]);
    }

    public function create()
    {
        return Inertia::render('Tooltip/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'reference' => 'required|string|max:255|unique:tooltips,reference',
            'tooltips' => 'required|string',
        ]);

        // Convert the textarea content to JSON array
        $tooltipsArray = array_map('trim', explode("\n", $request->tooltips));
        $tooltipsArray = array_filter($tooltipsArray); // Remove empty lines

        Tooltip::create([
            'reference' => $request->reference,
            'tooltips' => json_encode($tooltipsArray),
        ]);

        return redirect()->route('tooltips.index')->with('success', 'Tooltip created successfully.');
    }

    public function edit(Tooltip $tooltip)
    {
        // Convert the JSON array back to newline-separated string for editing
        $tooltip->tooltips = implode("\n", $tooltip->tooltips ?? []);

        return Inertia::render('Tooltip/Edit', [
            'tooltip' => $tooltip,
        ]);
    }

    public function update(Request $request, Tooltip $tooltip)
    {
        $request->validate([
            'reference' => 'required|string|max:255|unique:tooltips,reference,' . $tooltip->id,
            'tooltips' => 'required|string',
        ]);

        // Convert the textarea content to JSON array
        $tooltipsArray = array_map('trim', explode("\n", $request->tooltips));
        $tooltipsArray = array_filter($tooltipsArray); // Remove empty lines

        $tooltip->update([
            'reference' => $request->reference,
            'tooltips' => json_encode($tooltipsArray),
        ]);

        return redirect()->route('tooltips.index')->with('success', 'Tooltip updated successfully.');
    }

    public function destroy(Tooltip $tooltip)
    {
        $tooltip->delete();
        return redirect()->route('tooltips.index')->with('success', 'Tooltip deleted successfully.');
    }
}