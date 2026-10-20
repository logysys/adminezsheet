<?php

namespace App\Http\Controllers;

use App\Models\Powerstring;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PowerstringController extends Controller
{
    public function index()
    {
        $powerstrings = Powerstring::latest()->paginate(10);
        return inertia('Powerstrings/Index', compact('powerstrings'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'min_word' => 'required|integer',
            'max_word' => 'required|integer',
            'dollar_price' => 'required|numeric',
			'custom_price' => 'required|numeric',
        ]);

        Powerstring::create($validated);

        return redirect()->route('powerstrings.index')->with('success', 'Powerstring created successfully');
    }

    public function update(Request $request, Powerstring $powerstring)
    {
        $validated = $request->validate([
            'min_word' => 'required|integer',
            'max_word' => 'required|integer',
            'dollar_price' => 'required|numeric',
			'custom_price' => 'required|numeric',
        ]);

        $powerstring->update($validated);

        return back()->with('success', 'Powerstring updated successfully');
    }

    public function destroy(Powerstring $powerstring)
    {
        $powerstring->delete();
        return redirect()->route('powerstrings.index')->with('success', 'Powerstring deleted successfully');
    }
}