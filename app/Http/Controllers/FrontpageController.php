<?php

namespace App\Http\Controllers;

use App\Models\Frontpage;
use App\Models\Template;
use App\Models\EzFunnel;
use App\Models\Admindomain;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class FrontpageController extends Controller
{
    public function index()
    {
        $frontpages = Frontpage::with(['template', 'handle', 'domain'])->paginate(100);
        $templates = Template::all();
        $handles = EzFunnel::all();
        $domains = Admindomain::get();
        
        return Inertia::render('Frontpages/Index', [
            'frontpages' => $frontpages,
            'templates' => $templates,
            'handles' => $handles,
            'domains' => $domains
        ]);
    }

    public function create()
    {
        $templates = Template::all();
        $handles = EzFunnel::all();
        $domains = Admindomain::get();
        
        return Inertia::render('Frontpages/Create', [
            'templates' => $templates,
            'handles' => $handles,
            'domains' => $domains
        ]);
    }

    public function store(Request $request)
    {

        $data = [
            'page' => $request->page,
            'type' => $request->type,
            'domain_id' => $request->domain_id
        ];

        if ($request->type === 'THEME') {
            $data['theme_id'] = implode(',', $request->theme_id);
            $data['handle_id'] = null;
        } else {
            $data['handle_id'] = $request->handle_id;
            $data['theme_id'] = null;
        }

        Frontpage::create($data);

        return redirect()->route('frontpages.index')->with('success', 'Frontpage created successfully.');
    }

    public function edit(Frontpage $frontpage)
    {
        $templates = Template::all();
        $handles = EzFunnel::all();
        $domains = Admindomain::get();
        
        return Inertia::render('Frontpages/Edit', [
            'frontpage' => $frontpage,
            'templates' => $templates,
            'handles' => $handles,
            'domains' => $domains,
            'initialThemeIds' => $frontpage->theme_id ? explode(',', $frontpage->theme_id) : []
        ]);
    }

    public function update(Request $request, Frontpage $frontpage)
    {

        $data = [
            'page' => $request->page,
            'type' => $request->type,
            'domain_id' => $request->domain_id
        ];

        if ($request->type === 'THEME') {
            $data['theme_id'] = implode(',', $request->theme_id);
            $data['handle_id'] = null;
        } else {
            $data['handle_id'] = $request->handle_id;
            $data['theme_id'] = null;
        }

        $frontpage->update($data);

        return redirect()->route('frontpages.index')->with('success', 'Frontpage updated successfully.');
    }

    public function destroy(Frontpage $frontpage)
    {
        $frontpage->delete();
        return redirect()->route('frontpages.index')->with('success', 'Frontpage deleted successfully.');
    }
}