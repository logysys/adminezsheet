<?php

namespace App\Http\Controllers;

use App\Models\Emojimarker;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmojimarkerController extends Controller
{
    public function index(): Response
    {
        $emojimarkers = Emojimarker::paginate(10);
        return Inertia::render('Emojimarkers/Index', [
            'emojimarkers' => $emojimarkers,
            'flash' => session()->get('flash', [])
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Emojimarkers/Create');
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'emoji' => 'required|string|max:255',
            'add_emoji' => 'required|string|max:255',
            'edit_emoji' => 'required|string|max:255',
            'handle' => 'required|string|max:255',
        ]);

        Emojimarker::create($request->all());

        return redirect()->route('emojimarkers.index')
            ->with('success', 'Emojimarker created successfully.');
    }

    public function edit(Emojimarker $emojimarker): Response
    {
        return Inertia::render('Emojimarkers/Edit', [
            'emojimarker' => $emojimarker
        ]);
    }

    public function update(Request $request, Emojimarker $emojimarker): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'emoji' => 'required|string|max:255',
            'add_emoji' => 'required|string|max:255',
            'edit_emoji' => 'required|string|max:255',
            'handle' => 'required|string|max:255',
        ]);

        $emojimarker->update($request->all());

        return redirect()->route('emojimarkers.index')
            ->with('success', 'Emojimarker updated successfully.');
    }

    public function destroy(Emojimarker $emojimarker): \Illuminate\Http\RedirectResponse
    {
        $emojimarker->delete();
        return redirect()->route('emojimarkers.index')
            ->with('success', 'Emojimarker deleted successfully.');
    }
}