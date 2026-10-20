<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    public function index(): Response
    {
        $coupons = Coupon::orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('Coupons/Index', [
            'coupons' => $coupons
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Coupons/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:percentage,all',
            'coupon' => 'required|string|max:255|unique:coupons,coupon',
            'offer' => 'required|numeric|min:0',
            'use_limit' => 'required|integer|min:0',
            'limit_type' => 'required|in:limited,unlimited',
            'expire' => 'required|date|after:today',
            'status' => 'required|in:Active,Inactive'
        ]);

        Coupon::create($validated);

        return redirect()->route('coupons.index')->with('success', 'Coupon created successfully.');
    }

    public function edit(Coupon $coupon): Response
    {
        return Inertia::render('Coupons/Edit', [
            'coupon' => $coupon
        ]);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'type' => 'required|in:percentage,all',
            'coupon' => 'required|string|max:255|unique:coupons,coupon,' . $coupon->id,
            'offer' => 'required|numeric|min:0',
            'use_limit' => 'required|integer|min:0',
            'limit_type' => 'required|in:limited,unlimited',
            'expire' => 'required|date',
            'status' => 'required|in:Active,Inactive'
        ]);

        $coupon->update($validated);

        return redirect()->route('coupons.index')->with('success', 'Coupon updated successfully.');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('coupons.index')->with('success', 'Coupon deleted successfully.');
    }
}