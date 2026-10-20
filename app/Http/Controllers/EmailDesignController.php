<?php

namespace App\Http\Controllers;

use App\Models\EmailDesign;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailDesignController extends Controller
{
    public function index(): Response
    {
        $emailDesigns = EmailDesign::paginate(10);
        return Inertia::render('EmailDesigns/Index', [
            'emailDesigns' => $emailDesigns,
            'flash' => session()->get('flash', [])
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('EmailDesigns/Create');
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'design' => 'required|string',
        ]);

        EmailDesign::create($request->all());

        return redirect()->route('email-designs.index')
            ->with('success', 'Email design created successfully.');
    }

    public function edit(EmailDesign $emailDesign): Response
    {
        return Inertia::render('EmailDesigns/Edit', [
            'emailDesign' => $emailDesign
        ]);
    }

    public function update(Request $request, EmailDesign $emailDesign): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'design' => 'required|string',
        ]);

        $emailDesign->update($request->all());

        return redirect()->route('email-designs.index')
            ->with('success', 'Email design updated successfully.');
    }

    public function destroy(EmailDesign $emailDesign): \Illuminate\Http\RedirectResponse
    {
        $emailDesign->delete();
        return redirect()->route('email-designs.index')
            ->with('success', 'Email design deleted successfully.');
    }
}