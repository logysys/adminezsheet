<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserBalance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserBalanceController extends Controller
{
    public function index()
    {
        $balances = UserBalance::with('user')->paginate(10);
        return inertia('UserBalances/Index', compact('balances'));
    }

    public function edit(UserBalance $balance)
    {
        return inertia('UserBalances/Edit', compact('balance'));
    }

    public function update(Request $request, UserBalance $balance)
    {
        $validated = $request->validate([
            'bee_balance' => 'required|numeric',
            'bee_points_balance' => 'required|numeric',
        ]);

        $balance->update($validated);

        return redirect()->route('user-balances.index')->with('success', 'User balance updated successfully');
    }
}