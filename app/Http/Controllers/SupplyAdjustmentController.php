<?php

namespace App\Http\Controllers;

use App\Models\SupplyAdjustment;
use App\Models\TokenInfo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class SupplyAdjustmentController extends Controller
{
    public function index()
    {
        $adjustments = SupplyAdjustment::with('executor')->latest()->paginate(10);
        return inertia('SupplyAdjustments/Index', compact('adjustments'));
    }

    public function create()
    {
        $tokenInfo = TokenInfo::first();
        return inertia('SupplyAdjustments/Create', compact('tokenInfo'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'new_supply' => 'required|numeric',
            'adjustment_type' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $tokenInfo = TokenInfo::first();
        $previousSupply = $tokenInfo->circulating_supply;

        SupplyAdjustment::create([
            'previous_supply' => $previousSupply,
            'new_supply' => $validated['new_supply'],
            'adjustment_type' => $validated['adjustment_type'],
            'percentage_change' => (($validated['new_supply'] - $previousSupply) / $previousSupply) * 100,
            'executed_by' => Auth::id(),
            'notes' => $validated['notes'] ?? null,
        ]);

        // Update the token info
        $tokenInfo->update(['circulating_supply' => $validated['new_supply']]);

        return redirect()->route('supply-adjustments.index')->with('success', 'Supply adjusted successfully');
    }
}