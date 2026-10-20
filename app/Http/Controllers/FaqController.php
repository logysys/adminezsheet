<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        $faqs = Faq::orderBy('created_at', 'desc')
                    ->where('is_active', true)
                    ->paginate(10);
        
        return Inertia::render('Faqs/Index', [
            'faqs' => $faqs
        ]);
    }

    public function create(): Response
    {
        $categories = Faq::distinct()->pluck('category')->filter()->values();
        
        return Inertia::render('Faqs/Create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:100',
            'category' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        if (isset($validated['keywords'])) {
            $validated['keywords'] = json_encode($validated['keywords']);
        }

        Faq::create($validated);

        return redirect()->route('faqs.index')->with('success', 'FAQ created successfully.');
    }

    public function edit(Faq $faq): Response
    {
        $categories = Faq::distinct()->pluck('category')->filter()->values();
        $faq->keywords = $faq->keywords ? json_decode($faq->keywords, true) : [];
        
        return Inertia::render('Faqs/Edit', [
            'faq' => $faq,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string|max:255',
            'answer' => 'required|string',
            'keywords' => 'nullable|array',
            'keywords.*' => 'string|max:100',
            'category' => 'nullable|string|max:255',
            'is_active' => 'boolean'
        ]);

        if (isset($validated['keywords'])) {
            $validated['keywords'] = json_encode($validated['keywords']);
        }

        $faq->update($validated);

        return redirect()->route('faqs.index')->with('success', 'FAQ updated successfully.');
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();

        return redirect()->route('faqs.index')->with('success', 'FAQ deleted successfully.');
    }
}