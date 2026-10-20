<?php

namespace App\Http\Controllers;

use App\Models\EzFunnel;
use App\Models\Customdomain;
use App\Models\Domain;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EzFunnelController extends Controller
{
    public function index(Request $request): Response
{
    $query = EzFunnel::with(['fields', 'customDomains', 'handleDomains'])
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

    return Inertia::render('EzFunnel/Index', [
        'funnels' => $funnels,
        'filters' => $request->all(['search', 'mode']),
    ]);
	}
}