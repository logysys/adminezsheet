<?php

namespace App\Http\Controllers;

use App\Models\Template;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        $query = Template::query();
        
        // Apply filters
        if ($request->has('search')) {
            $query->where('title', 'like', '%'.$request->search.'%')
                  ->orWhere('description', 'like', '%'.$request->search.'%');
        }
        
        if ($request->has('status') && in_array($request->status, ['Active', 'Inactive'])) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }
        
        // Get paginated results
        $templates = $query->paginate(10)->withQueryString();
        
        return Inertia::render('Templates/Index', [
            'templates' => $templates,
            'filters' => $request->all(['search', 'status', 'min_price', 'max_price']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Templates/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $template = new Template();
        
        if ($request->hasFile('theme_upload')) {
            $image = $request->file('theme_upload');
            $imageName = time() . '_.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('template_pic');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            $image->move($destinationPath, $imageName);
            $template->image = 'template_pic/' . $imageName;
        } else {
            $template->image = $request->theme_link;
        }
        
        $template->framecolor = $request->frame_color;
        $template->title = $request->title;
        $template->price = $request->price;
        $template->user_id = 0;
        $template->transparency = $request->transparency;
        $template->description = $request->description;
        $template->option = $request->option ?? 'autoplay' ;
        $template->status = $request->status ?? 'Active';
        $template->save();

        return Redirect::route('templates.index')->with('success', 'Template created successfully.');
    }

    public function edit(Template $template)
    {
        return Inertia::render('Templates/Edit', [
            'template' => $template,
        ]);
    }

    public function update(Request $request, Template $template): RedirectResponse
    {
        if ($request->hasFile('theme_upload')) {
            if ($template->image && file_exists(public_path($template->image))) {
                unlink(public_path($template->image));
            }

            $image = $request->file('theme_upload');
            $imageName = time() . '_.' . $image->getClientOriginalExtension();
            $destinationPath = public_path('template_pic');
            
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }
            
            $image->move($destinationPath, $imageName);
            $template->image = 'template_pic/' . $imageName;
        } elseif ($request->theme_link) {
            $template->image = $request->theme_link;
        }

        $template->title = $request->title;
        $template->framecolor = $request->frame_color;
        $template->price = $request->price;
        $template->transparency = $request->transparency;
        $template->description = $request->description;
        $template->option = $request->option ?? 'autoplay' ;
        $template->status = $request->status ?? 'Active';
        $template->save();

        return Redirect::route('templates.index')->with('success', 'Template updated successfully.');
    }

    public function destroy(Template $template): RedirectResponse
    {
        if ($template->image && file_exists(public_path($template->image))) {
            unlink(public_path($template->image));
        }
        
        $template->delete();

        return Redirect::route('templates.index')->with('success', 'Template deleted successfully.');
    }
}