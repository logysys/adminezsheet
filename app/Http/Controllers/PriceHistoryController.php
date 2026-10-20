<?php

namespace App\Http\Controllers;

use App\Models\PriceHistory;
use App\Models\TokenInfo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class PriceHistoryController extends Controller
{
    public function index()
    {
        $priceHistory = PriceHistory::with('admin')->latest()->paginate(10);
        return inertia('PriceHistory/Index', compact('priceHistory'));
    }

    public function create()
    {
        return inertia('PriceHistory/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'price_per_point' => 'required|numeric',
            'notes' => 'nullable|string',
        ]);

        PriceHistory::create([
            'price_per_point' => $validated['price_per_point'],
            'set_by_admin' => Auth::id(),
            'notes' => $validated['notes'] ?? null,
			'effective_from' => now(),
        ]);
		
		$tokenInfo = TokenInfo::firstOrNew();
		$tokenInfo->current_price = $validated['price_per_point'];
		$tokenInfo->last_updated = now();
		$tokenInfo->save();

        return redirect()->route('price-history.index')->with('success', 'New price point created');
    }
}