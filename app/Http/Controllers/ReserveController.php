<?php

namespace App\Http\Controllers;

use App\Models\Reserve;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReserveController extends Controller
{
    public function index()
    {
        $reserves = Reserve::latest()->paginate(10);
        return inertia('Reserves/Index', compact('reserves'));
    }

    public function create()
    {
        return inertia('Reserves/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reserve' => 'required',
        ]);

        Reserve::create($validated);

        return redirect()->route('reserves.index')->with('success', 'Reserve created successfully');
    }

	public function edit($reserve)
	{
    // Debug what's being fetched
    $reserve = Reserve::find($reserve); // Added missing semicolon here
    
    return Inertia::render('Reserves/Edit', [
        'reserve' => $reserve,
        'auth' => [
            'user' => auth()->user()
        ]
    ]);
	}
   
    public function update(Request $request, $reserve)
    {
        $validated = $request->validate([
            'reserve' => 'required',
        ]);

		Reserve::find($reserve)->update($validated);
		
        return redirect()->route('reserves.index')->with('success', 'Reserve updated successfully');
    }
}