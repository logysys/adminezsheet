<?php

namespace App\Http\Controllers;

use App\Models\Admindomain;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdmindomainController extends Controller
{
    public function index(Request $request): Response
    {
        $limit = $request->input('limit', 10);
        
        $query = Admindomain::query()
            ->when($request->search, function ($query, $search) {
                $query->where('domain', 'like', '%'.$search.'%');
            })
            ->orderBy($request->input('sort', 'created_at'), $request->input('direction', 'desc'));
        
        return Inertia::render('Admindomains/Index', [
            'admindomains' => $query->paginate($limit),
            'limit' => (int)$limit,
            'filters' => $request->only(['search', 'sort', 'direction'])
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admindomains/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'domain' => 'required|string|max:255|unique:admindomains',
            'days' => 'nullable|string|max:255',
            'status' => 'required|in:Active,Inactive'
        ]);

        Admindomain::create($validated);

        return redirect()->route('admindomains.index')
            ->with('success', 'Admindomain created successfully.');
    }

    public function edit(Admindomain $admindomain): Response
    {
        return Inertia::render('Admindomains/Edit', [
            'admindomain' => $admindomain
        ]);
    }

    public function update(Request $request, Admindomain $admindomain): RedirectResponse
    {
        $validated = $request->validate([
            'domain' => 'required|string|max:255|unique:admindomains,domain,'.$admindomain->id,
            'days' => 'nullable|string',
            'status' => 'required|in:Active,Inactive'
        ]);

        $admindomain->update($validated);

        return redirect()->route('admindomains.index')
            ->with('success', 'Admindomain updated successfully.');
    }

    public function destroy(Admindomain $admindomain): RedirectResponse
    {
        $admindomain->delete();

        return redirect()->route('admindomains.index')
            ->with('success', 'Admindomain deleted successfully.');
    }

    public function changeDays(Request $request)
    {
        $request->validate([
        'id' => 'required|exists:admindomains,id',
        'days' => 'nullable|string'
    ]);

    Admindomain::find($request->id)->update(['days' => $request->days]);

    return back()->with(['success' => true]); // Proper Inertia response
    }

    public function changeStatus(Request $request)
    {
        $request->validate([
        'id' => 'required|exists:admindomains,id',
        'status' => 'required|in:Active,Inactive'
    ]);

    Admindomain::find($request->id)->update(['status' => $request->status]);

    return back()->with(['success' => true]); // Proper Inertia response
    }
}