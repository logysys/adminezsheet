<?php

namespace App\Http\Controllers;

use App\Models\Aiframe;
use App\Models\Admindomain;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AiframeController extends Controller
{
    public function index(Request $request)
    {
        // Get parameters from request
        $limit = $request->input('limit', 100);
        $search = $request->input('search');
        $type = $request->input('type');
        $status = $request->input('status');

        // Ensure limit is a positive integer
        $limit = is_numeric($limit) && $limit > 0 ? (int)$limit : 100;

        $aiframes = Aiframe::with('domain')
            ->when($search, function ($query, $search) {
                $query->where('content', 'like', "%{$search}%")
                      ->orWhereHas('domain', function ($q) use ($search) {
                          $q->where('domain', 'like', "%{$search}%");
                      });
            })
            ->when($type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($status !== null && $status !== '', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($limit)
            ->withQueryString();

        return Inertia::render('Aiframes/Index', [
            'aiframes' => $aiframes,
            'filters' => [
                'limit' => (string) $limit,
                'search' => $search ?? '',
                'type' => $type ?? '',
                'status' => $status ?? '',
            ],
            'flash' => session('flash')
        ]);
    }

    public function create()
    {
        $domains = Admindomain::orderBy('domain')->get();
        return Inertia::render('Aiframes/Create', [
            'domains' => $domains
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'domain_id' => 'required|exists:admindomains,id',
            'type' => 'required|in:TOP,BOTTOM',
            'content' => 'required|string',
            'status' => 'boolean',
        ]);

        Aiframe::create($validated);

        return redirect()->route('aiframes.index')->with('success', 'Aiframe created successfully.');
    }

    public function edit(Aiframe $aiframe)
    {
        $domains = Admindomain::orderBy('domain')->get();
        return Inertia::render('Aiframes/Edit', [
            'domains' => $domains,
            'aiframe' => $aiframe
        ]);
    }

    public function update(Request $request, Aiframe $aiframe)
    {
        $validated = $request->validate([
            'domain_id' => 'required|exists:admindomains,id',
            'type' => 'required|in:TOP,BOTTOM',
            'content' => 'required|string',
            'status' => 'boolean',
        ]);

        $aiframe->update($validated);

        return redirect()->route('aiframes.index')->with('success', 'Aiframe updated successfully.');
    }

    public function destroy(Aiframe $aiframe)
    {
        $aiframe->delete();
        return redirect()->route('aiframes.index')->with('success', 'Aiframe deleted successfully.');
    }
}