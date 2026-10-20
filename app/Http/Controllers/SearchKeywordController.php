<?php

namespace App\Http\Controllers;

use App\Models\SearchKeyword;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class SearchKeywordController extends Controller
{
    public function index()
    {
        $searchKeywords = SearchKeyword::latest()->paginate(10);
        return inertia('SearchKeywords/Index', compact('searchKeywords'));
    }

    public function create()
    {
        return inertia('SearchKeywords/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'language' => 'required|string|max:10',
            'word'     => 'required|string',
        ]);

        // Friendly duplicate check (mirrors the unique(['language','word']) constraint)
        $exists = SearchKeyword::where('language', $validated['language'])
            ->where('word', $validated['word'])
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'word' => 'This word already exists for the selected language.',
            ]);
        }

        SearchKeyword::create($validated);

        return redirect()->route('search-keywords.index')
            ->with('success', 'Search keyword created successfully');
    }

    public function edit($searchKeyword)
    {
        $searchKeyword = SearchKeyword::find($searchKeyword);

        return Inertia::render('SearchKeywords/Edit', [
            'searchKeyword' => $searchKeyword,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function update(Request $request, $searchKeyword)
    {
        $validated = $request->validate([
            'language' => 'required|string|max:10',
            'word'     => 'required|string',
        ]);

        // Duplicate check ignoring the current record
        $exists = SearchKeyword::where('language', $validated['language'])
            ->where('word', $validated['word'])
            ->where('id', '!=', $searchKeyword)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'word' => 'This word already exists for the selected language.',
            ]);
        }

        SearchKeyword::find($searchKeyword)->update($validated);

        return redirect()->route('search-keywords.index')
            ->with('success', 'Search keyword updated successfully');
    }

    public function destroy($searchKeyword)
    {
        SearchKeyword::find($searchKeyword)->delete();

        return redirect()->route('search-keywords.index')
            ->with('success', 'Search keyword deleted successfully');
    }
}