<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display a listing of pages.
     */
    public function index(Request $request): Response
    {
        $limit = $request->input('limit', 10);
        
        $query = Page::query()
            ->when($request->search, function ($query, $search) {
                $query->where('pagename', 'like', '%' . $search . '%')
                    ->orWhere('code', 'like', '%' . $search . '%');
            })
            ->orderBy($request->input('sort', 'created_at'), $request->input('direction', 'desc'));
        
        return Inertia::render('Pages/Index', [
            'pages' => $query->paginate($limit),
            'limit' => (int)$limit,
            'filters' => $request->only(['search', 'sort', 'direction'])
        ]);
    }

    /**
     * Show the form for creating a new page.
     */
    public function create(): Response
    {
        return Inertia::render('Pages/Create');
    }

    /**
     * Store a newly created page.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'pagename' => 'required|string|max:255|unique:pages,pagename',
            'code' => 'nullable|string',
        ]);

        Page::create($validated);

        return redirect()->route('pages.index')
            ->with('success', 'Page created successfully.');
    }

    /**
     * Display the specified page.
     */
    public function show(Page $page): Response
    {
        return Inertia::render('Pages/Show', [
            'page' => $page
        ]);
    }

    /**
     * Show the form for editing the specified page.
     */
    public function edit(Page $page): Response
    {
        return Inertia::render('Pages/Edit', [
            'page' => $page
        ]);
    }

    /**
     * Update the specified page.
     */
    public function update(Request $request, Page $page): RedirectResponse
    {
        $validated = $request->validate([
            'pagename' => 'required|string|max:255|unique:pages,pagename,' . $page->id,
            'code' => 'nullable|string',
        ]);

        $page->update($validated);

        return redirect()->route('pages.index')
            ->with('success', 'Page updated successfully.');
    }

    /**
     * Remove the specified page.
     */
    public function destroy(Page $page): RedirectResponse
    {
        $page->delete();

        return redirect()->route('pages.index')
            ->with('success', 'Page deleted successfully.');
    }

    /**
     * Duplicate the specified page.
     */
    public function duplicate(Page $page): RedirectResponse
    {
        $newPage = $page->replicate();
        $newPage->pagename = $page->pagename . ' (Copy)';
        $newPage->save();

        return redirect()->route('pages.index')
            ->with('success', 'Page duplicated successfully.');
    }

    /**
     * Bulk delete pages.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:pages,id'
        ]);

        Page::whereIn('id', $request->ids)->delete();

        return redirect()->route('pages.index')
            ->with('success', 'Pages deleted successfully.');
    }
}