<?php

namespace App\Http\Controllers;

use App\Models\TokenInfo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TokenInfoController extends Controller
{
    public function index(): Response
    {
        $tokenInfo = TokenInfo::firstOrNew(); // Use firstOrNew() to handle null case
        return Inertia::render('TokenInfo/Index', [
            'tokenInfo' => $tokenInfo
        ]);
    }

    public function update(Request $request, TokenInfo $tokenInfo): RedirectResponse
    {
        $validated = $request->validate([
            'token_name' => 'required|string|max:50',
            'total_supply' => 'required|numeric',
            'circulating_supply' => 'required|numeric',
            'current_price' => 'required|numeric',
        ]);
			
        $tokenInfo->update($validated);

        return redirect()->back()->with('success', 'Token information updated successfully');
    }
}