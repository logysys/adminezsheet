<?php

namespace App\Http\Controllers;

use App\Models\DomainTransferRule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DomainTransferRuleController extends Controller
{
    public function index(): Response
    {
        $rules = DomainTransferRule::orderBy('provider_name', 'asc')->paginate(10);
        
        return Inertia::render('DomainTransferRules/Index', [
            'rules' => $rules
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('DomainTransferRules/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider_name' => 'required|string|max:255',
            'keywords' => 'required|array',
            'keywords.*' => 'string|max:100',
            'steps' => 'required|string',
            'support_url' => 'nullable|url|max:255',
        ]);

        // Remove manual JSON encoding - Eloquent's array cast handles this
        // $validated['keywords'] = json_encode($validated['keywords']);

        DomainTransferRule::create($validated);

        return redirect()->route('domain-transfer-rules.index')->with('success', 'Domain transfer rule created successfully.');
    }

    public function edit(DomainTransferRule $domainTransferRule): Response
    {
        // Remove manual JSON decoding - Eloquent's array cast handles this
        // $domainTransferRule->keywords = $domainTransferRule->keywords ? json_decode($domainTransferRule->keywords, true) : [];
        
        return Inertia::render('DomainTransferRules/Edit', [
            'rule' => $domainTransferRule
        ]);
    }

    public function update(Request $request, DomainTransferRule $domainTransferRule)
    {
        $validated = $request->validate([
            'provider_name' => 'required|string|max:255',
            'keywords' => 'required|array',
            'keywords.*' => 'string|max:100',
            'steps' => 'required|string',
            'support_url' => 'nullable|url|max:255',
        ]);

        // Remove manual JSON encoding - Eloquent's array cast handles this
        // $validated['keywords'] = json_encode($validated['keywords']);

        $domainTransferRule->update($validated);

        return redirect()->route('domain-transfer-rules.index')->with('success', 'Domain transfer rule updated successfully.');
    }

    public function destroy(DomainTransferRule $domainTransferRule)
    {
        $domainTransferRule->delete();

        return redirect()->route('domain-transfer-rules.index')->with('success', 'Domain transfer rule deleted successfully.');
    }
}