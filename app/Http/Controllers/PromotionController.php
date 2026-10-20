<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    public function index(): Response
    {
        // Changed from $Promotions to $promotions
        $promotions = Promotion::with(['coupon'])
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('Promotions/Index', [
            'promotions' => $promotions  // Changed key to lowercase
        ]);
    }

    public function create(): Response
    {
        $coupons = Coupon::where('status', 'Active')->get();
        
        return Inertia::render('Promotions/Create', [
            'coupons' => $coupons
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'coupon_id' => 'required|exists:coupons,id',
            'message' => 'required|string|max:500',
            'display_order' => 'nullable|integer|min:0',
            'status' => 'required|in:Active,Inactive',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        Promotion::create($validated);

        return redirect()->route('promotions.index')
            ->with('success', 'Promotion created successfully.');
    }

    public function edit(Promotion $promotion): Response  // Changed parameter name to lowercase
    {
        $coupons = Coupon::where('status', 'Active')->get();
        
        return Inertia::render('Promotions/Edit', [
            'promotionMessage' => $promotion->load(['coupon']),  // Changed key name
            'coupons' => $coupons
        ]);
    }

    public function update(Request $request, Promotion $promotion)  // Changed parameter name
    {
        $validated = $request->validate([
            'coupon_id' => 'required|exists:coupons,id',
            'message' => 'required|string|max:500',
            'display_order' => 'nullable|integer|min:0',
            'status' => 'required|in:Active,Inactive',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        $promotion->update($validated);  // Changed variable name

        return redirect()->route('promotions.index')
            ->with('success', 'Promotion updated successfully.');
    }

    public function destroy(Promotion $promotion)  // Changed parameter name
    {
        $promotion->delete();  // Changed variable name

        return redirect()->route('promotions.index')
            ->with('success', 'Promotion deleted successfully.');
    }
}