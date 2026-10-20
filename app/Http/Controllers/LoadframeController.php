<?php

namespace App\Http\Controllers;

use App\Models\Loadframe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoadframeController extends Controller
{
    public function index()
    {
        $loadframes = Loadframe::paginate(10);
        return Inertia::render('Loadframes/Index', ['loadframes' => $loadframes]);
    }

    public function create()
    {
        return Inertia::render('Loadframes/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'boolean',
        ]);

        Loadframe::create($request->all());

        return redirect()->route('loadframes.index')->with('success', 'Loadframe created successfully.');
    }

    public function edit(Loadframe $loadframe)
    {
        return Inertia::render('Loadframes/Edit', ['loadframe' => $loadframe]);
    }

    public function update(Request $request, Loadframe $loadframe)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'boolean',
        ]);

        $loadframe->update($request->all());

        return redirect()->route('loadframes.index')->with('success', 'Loadframe updated successfully.');
    }

    public function destroy(Loadframe $loadframe)
    {
        $loadframe->delete();
        return redirect()->route('loadframes.index')->with('success', 'Loadframe deleted successfully.');
    }
}