<?php

namespace App\Http\Controllers;

use App\Models\PromotionMessage;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromotionMessageController extends Controller
{
    public function index(): Response
    {
        $promotionMessages = PromotionMessage::with(['coupon'])
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->paginate(10);
        
        return Inertia::render('PromotionMessages/Index', [
            'promotionMessages' => $promotionMessages
        ]);
    }

    public function create(): Response
    {
        $coupons = Coupon::where('status', 'Active')->get();
        
        return Inertia::render('PromotionMessages/Create', [
            'coupons' => $coupons
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'domain' => 'required|string|max:255',
            'coupon_id' => 'required|exists:coupons,id',
            'message' => 'required|string|max:500',
            'display_order' => 'nullable|integer|min:0',
            'status' => 'required|in:Active,Inactive',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        PromotionMessage::create($validated);

        return redirect()->route('promotion-messages.index')
            ->with('success', 'Promotion message created successfully.');
    }

    public function edit(PromotionMessage $promotionMessage): Response
    {
        $coupons = Coupon::where('status', 'Active')->get();
        
        return Inertia::render('PromotionMessages/Edit', [
            'promotionMessage' => $promotionMessage->load(['coupon']),
            'coupons' => $coupons
        ]);
    }

    public function update(Request $request, PromotionMessage $promotionMessage)
    {
        $validated = $request->validate([
            'domain' => 'required|string|max:255',
            'coupon_id' => 'required|exists:coupons,id',
            'message' => 'required|string|max:500',
            'display_order' => 'nullable|integer|min:0',
            'status' => 'required|in:Active,Inactive',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date'
        ]);

        $promotionMessage->update($validated);

        return redirect()->route('promotion-messages.index')
            ->with('success', 'Promotion message updated successfully.');
    }

    public function destroy(PromotionMessage $promotionMessage)
    {
        $promotionMessage->delete();

        return redirect()->route('promotion-messages.index')
            ->with('success', 'Promotion message deleted successfully.');
    }
}