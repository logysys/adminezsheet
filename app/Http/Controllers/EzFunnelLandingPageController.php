<?php

namespace App\Http\Controllers;

use App\Models\EzFunnel;
use App\Models\Customdomain;
use App\Models\AISearchHistory;
use App\Models\Domain;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EzFunnelLandingPageController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EzFunnel::with(['fields', 'customDomains', 'handleDomains', 'aiSearchHistory'])
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->has('search')) {
            $search = $request->search;
            $searchType = $request->search_type ?? 'fuzzy';
            
            if ($searchType === 'exact') {
                $query->where('token', $search);
            } else {
                $query->where('token', 'like', '%'.$search.'%');
            }
        }

        // Get paginated results
        $funnels = $query->paginate(10)->withQueryString();

        return Inertia::render('EzFunnelLandingPage/Index', [
            'funnels' => $funnels,
            'filters' => $request->all(['search', 'search_type']),
        ]);
    }
    
    public function editAiid(EzFunnel $ezfunnel)
    {
        // Get AI search histories for dropdown
        $aiHistories = AISearchHistory::whereNull('parent_id') // Only conversations (first messages)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'slug', 'conversation_title', 'query', 'created_at']);
        
        return Inertia::render('EzFunnelLandingPage/EditAiid', [
            'funnel' => $ezfunnel->load(['fields', 'customDomains', 'handleDomains', 'aiSearchHistory']),
            'aiHistories' => $aiHistories,
        ]);
    }

    public function updateAiid(Request $request, EzFunnel $ezfunnel)
    {
        $validated = $request->validate([
            'aiid' => 'nullable|exists:ai_search_histories,id',
        ]);
        
        $ezfunnel->update([
            'aiid' => $validated['aiid']
        ]);
        
        return redirect()->route('ezfunnellandingpage.index')
            ->with('success', 'AI History ID updated successfully.');
    }
}