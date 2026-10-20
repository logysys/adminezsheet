<?php

namespace App\Http\Controllers;

use App\Models\Defaultpage;
use App\Models\EzFunnel;
use App\Models\Admindomain;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class DefaultpageController extends Controller
{
    public function index()
    {
        $defaultpages = Defaultpage::with(['handle', 'domain'])->paginate(100);
        $handles = EzFunnel::all();
        $domains = Admindomain::where('status', 'Active')->get();
        
        return Inertia::render('Defaultpage/Index', [
            'defaultpages' => $defaultpages,
            'handles' => $handles,
            'domains' => $domains
        ]);
    }

    public function create()
    {
        $handles = EzFunnel::all();
        $domains = Admindomain::where('status', 'Active')->get();
        
        return Inertia::render('Defaultpage/Create', [
            'handles' => $handles,
            'domains' => $domains
        ]);
    }

    public function store(Request $request)
    {

        $data = [
            'domain_id' => $request->domain_id
        ];

        $data['handle_id'] = $request->handle_id;

        Defaultpage::create($data);

        return redirect()->route('defaultpages.index')->with('success', 'Defaultpage created successfully.');
    }

    public function edit(Defaultpage $defaultpage)
    {
        $handles = EzFunnel::all();
        $domains = Admindomain::where('status', 'Active')->get();
        
        return Inertia::render('Defaultpage/Edit', [
            'defaultpage' => $defaultpage,
            'handles' => $handles,
            'domains' => $domains
        ]);
    }

    public function update(Request $request, Defaultpage $defaultpage)
    {

        $data = [
            'domain_id' => $request->domain_id
        ];

        $data['handle_id'] = $request->handle_id;

        $defaultpage->update($data);

        return redirect()->route('defaultpages.index')->with('success', 'Defaultpage updated successfully.');
    }

    public function destroy(Defaultpage $defaultpage)
    {
        $defaultpage->delete();
        return redirect()->route('defaultpage.index')->with('success', 'Defaultpage deleted successfully.');
    }
}