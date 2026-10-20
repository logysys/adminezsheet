<?php

namespace App\Http\Controllers;

use App\Models\Incentive;
use App\Models\Userlist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IncentiveController extends Controller
{
    public function index()
    {
        $incentives = Incentive::with('user')->latest()->paginate(10);
        return inertia('Incentives/Index', compact('incentives'));
    }

    public function create()
    {
        $users = Userlist::all();
        return inertia('Incentives/Create', compact('users'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required',
            'amount' => 'required|numeric',
            'incentive_type' => 'required|string',
            'description' => 'nullable|string',
			'status' => 'required|in:pending,approved,rejected',
        ]);

        Incentive::create($validated);

        return redirect()->route('incentives.index')->with('success', 'Incentive created successfully');
    }

public function edit(Incentive $incentive)
{
    $users = Userlist::all();
    return inertia('Incentives/Edit', compact('incentive', 'users'));
}

public function update(Request $request, Incentive $incentive)
{
    $validated = $request->validate([
        'user_id' => 'required',
        'amount' => 'required|numeric',
        'incentive_type' => 'required|string',
        'description' => 'nullable|string',
        'status' => 'required|in:pending,approved,rejected',
    ]);

    $incentive->update($validated);

    return redirect()->route('incentives.index')->with('success', 'Incentive updated successfully');
}
}