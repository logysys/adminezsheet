<?php

namespace App\Http\Controllers;

use App\Models\WikiPage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class WikiPageController extends Controller
{
    public function index()
    {
        $wikipages = WikiPage::where('user_id', auth()->id())
            ->latest()
            ->get();
        
        return Inertia::render('WikiPages/Index', [
            'wikipages' => $wikipages
        ]);
    }

    public function create()
    {
        return Inertia::render('WikiPages/Editor');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|array',
            'elements' => 'required|array',
            'status' => 'in:draft,published'
        ]);

        // Generate HTML from elements with Tailwind CSS
        $htmlContent = $this->generateHtml($validated['elements'], $validated['title']);

        $wikipage = WikiPage::create([
            'title' => $validated['title'],
            'wiki_slug' => Str::slug($validated['title']) . '-' . time(),
            'content' => $validated['content'] ?? [],
            'elements' => $validated['elements'],
            'html_content' => $htmlContent, // Save HTML with Tailwind to database
            'status' => $validated['status'] ?? 'draft',
            'user_id' => auth()->id()
        ]);

        Log::info('Wiki page created', [
            'id' => $wikipage->id,
            'title' => $wikipage->title,
            'user_id' => auth()->id(),
            'html_saved' => !empty($htmlContent)
        ]);

        // For axios request, return JSON response
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Wiki page created successfully.',
                'wikipage' => $wikipage,
                'html_saved' => true
            ], 201);
        }

        return redirect()->route('wikipages.edit', $wikipage)->with('success', 'Wiki page created successfully.');
    }

    public function show($wiki_slug)
    {
        $wikipage = WikiPage::where('wiki_slug', $wiki_slug)
            ->where('status', 'published')
            ->firstOrFail();
        
        return Inertia::render('WikiPages/Show', [
            'wikipage' => $wikipage
        ]);
    }

    public function edit(WikiPage $wikipage)
    {
        // Check if user is authorized to update this wiki page
        if ($wikipage->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
        
        return Inertia::render('WikiPages/Editor', [
            'wikipage' => $wikipage
        ]);
    }

    public function update(Request $request, WikiPage $wikipage)
    {
        // Check if user is authorized to update this wiki page
        if ($wikipage->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|array',
            'elements' => 'required|array',
            'status' => 'in:draft,published'
        ]);

        // Generate HTML from elements with Tailwind CSS
        $htmlContent = $this->generateHtml($validated['elements'], $validated['title']);

        $updateData = [
            'title' => $validated['title'],
            'content' => $validated['content'] ?? $wikipage->content,
            'elements' => $validated['elements'],
            'html_content' => $htmlContent, // Update HTML with Tailwind in database
            'status' => $validated['status'] ?? $wikipage->status
        ];

        // Update wiki_slug only if title changed
        if ($wikipage->title !== $validated['title']) {
            $updateData['wiki_slug'] = Str::slug($validated['title']) . '-' . time();
        }

        $wikipage->update($updateData);

        Log::info('Wiki page updated', [
            'id' => $wikipage->id,
            'title' => $wikipage->title,
            'user_id' => auth()->id(),
            'html_updated' => !empty($htmlContent)
        ]);

        // For axios request
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Wiki page updated successfully.',
                'wikipage' => $wikipage,
                'html_saved' => true
            ]);
        }

        return back()->with('success', 'Wiki page updated successfully.');
    }

    public function autoSave(Request $request, WikiPage $wikipage)
    {
        // Check if user is authorized to update this wiki page
        if ($wikipage->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'elements' => 'sometimes|array',
            'status' => 'sometimes|in:draft,published'
        ]);

        $updates = [];
        if (isset($validated['title'])) $updates['title'] = $validated['title'];
        if (isset($validated['elements'])) {
            $updates['elements'] = $validated['elements'];
            // Also update HTML with Tailwind when elements change
            $updates['html_content'] = $this->generateHtml(
                $validated['elements'], 
                $validated['title'] ?? $wikipage->title
            );
        }
        if (isset($validated['status'])) $updates['status'] = $validated['status'];
        
        $wikipage->update($updates);

        Log::debug('Wiki page auto-saved', [
            'id' => $wikipage->id,
            'user_id' => auth()->id(),
            'html_updated' => isset($validated['elements'])
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Auto-saved successfully',
            'saved_at' => now()->format('H:i:s'),
            'html_saved' => isset($validated['elements'])
        ]);
    }

    public function destroy(WikiPage $wikipage)
    {
        // Check if user is authorized to delete this wiki page
        if ($wikipage->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }
        
        $wikipage->delete();
        
        Log::info('Wiki page deleted', [
            'id' => $wikipage->id,
            'title' => $wikipage->title,
            'user_id' => auth()->id()
        ]);
        
        // For axios request
        if (request()->wantsJson() || request()->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Wiki page deleted successfully.'
            ]);
        }
        
        return redirect()->route('wikipages.index')->with('success', 'Wiki page deleted successfully.');
    }

    public function preview($wiki_slug)
    {
        $wikipage = WikiPage::where('wiki_slug', $wiki_slug)
            ->where(function($query) {
                $query->where('user_id', auth()->id())
                      ->orWhere('status', 'published');
            })
            ->firstOrFail();
        
        return Inertia::render('WikiPages/Show', [
            'wikipage' => $wikipage
        ]);
    }

    public function duplicate(WikiPage $wikipage)
    {
        // Check if user is authorized to duplicate this wiki page
        if ($wikipage->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        // Generate fresh HTML with Tailwind for the duplicate
        $htmlContent = $this->generateHtml($wikipage->elements, $wikipage->title . ' (Copy)');

        $newWikiPage = WikiPage::create([
            'title' => $wikipage->title . ' (Copy)',
            'wiki_slug' => Str::slug($wikipage->title . '-copy') . '-' . time(),
            'content' => $wikipage->content,
            'elements' => $wikipage->elements,
            'html_content' => $htmlContent, // Save HTML with Tailwind for duplicate
            'status' => 'draft',
            'user_id' => auth()->id()
        ]);

        Log::info('Wiki page duplicated', [
            'original_id' => $wikipage->id,
            'new_id' => $newWikiPage->id,
            'user_id' => auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Wiki page duplicated successfully.',
            'newWikiPage' => $newWikiPage
        ]);
    }

    public function exportHtml(Request $request, WikiPage $wikipage = null)
    {
        // If a wikipage is specified in the route
        if ($wikipage) {
            // Check authorization for draft pages
            if ($wikipage->status === 'draft' && $wikipage->user_id !== auth()->id()) {
                abort(403, 'Unauthorized action.');
            }

            // Use stored HTML if available and not expired, otherwise generate it
            $html = $wikipage->html_content;
            $isFresh = false;
            
            // Regenerate HTML if it's more than 24 hours old or doesn't exist
            if (!$html || $wikipage->updated_at->diffInHours(now()) > 24) {
                $html = $this->generateHtml($wikipage->elements, $wikipage->title);
                $wikipage->update(['html_content' => $html]);
                $isFresh = true;
                
                Log::info('HTML regenerated for export', [
                    'id' => $wikipage->id,
                    'title' => $wikipage->title,
                    'was_stale' => !$wikipage->html_content,
                    'user_id' => auth()->id()
                ]);
            }
            
            $filename = Str::slug($wikipage->title) . '.html';
            
            return response($html, 200, [
                'Content-Type' => 'text/html',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'X-HTML-Fresh' => $isFresh ? 'true' : 'false',
                'X-HTML-Source' => $wikipage->html_content ? 'stored' : 'generated'
            ]);
        } 
        // For API export (from editor without specific wikipage)
        else {
            $validated = $request->validate([
                'elements' => 'required|array',
                'title' => 'required|string|max:255'
            ]);

            $html = $this->generateHtml($validated['elements'], $validated['title']);
            $filename = Str::slug($validated['title']) . '.html';
            
            return response($html, 200, [
                'Content-Type' => 'text/html',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'X-HTML-Source' => 'generated'
            ]);
        }
    }

    /**
     * Regenerate HTML for a specific wiki page or all pages
     */
    public function regenerateHtml(Request $request, WikiPage $wikipage = null)
    {
        $regenerated = [];
        
        if ($wikipage) {
            // Check authorization
            if ($wikipage->user_id !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized action.'
                ], 403);
            }

            // Regenerate HTML with Tailwind for a specific page
            $htmlContent = $this->generateHtml($wikipage->elements, $wikipage->title);
            $wikipage->update(['html_content' => $htmlContent]);
            
            $regenerated[] = [
                'id' => $wikipage->id,
                'title' => $wikipage->title,
                'html_length' => strlen($htmlContent)
            ];
            
            Log::info('HTML regenerated for single page', [
                'id' => $wikipage->id,
                'title' => $wikipage->title,
                'user_id' => auth()->id()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'HTML regenerated successfully.',
                'wikipage' => $wikipage,
                'regenerated' => $regenerated
            ]);
        } else {
            // Check if user is admin or has permission to regenerate all pages
            if (!auth()->user()->hasRole('admin')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Administrator access required.'
                ], 403);
            }

            // Regenerate HTML for all pages
            $pages = WikiPage::all();
            foreach ($pages as $page) {
                $htmlContent = $this->generateHtml($page->elements, $page->title);
                $page->update(['html_content' => $htmlContent]);
                
                $regenerated[] = [
                    'id' => $page->id,
                    'title' => $page->title,
                    'html_length' => strlen($htmlContent)
                ];
            }
            
            Log::info('HTML regenerated for all pages', [
                'count' => $pages->count(),
                'user_id' => auth()->id()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'HTML regenerated for all pages.',
                'count' => $pages->count(),
                'regenerated' => $regenerated
            ]);
        }
    }

    /**
     * Get the HTML content of a wiki page
     */
    public function getHtml(WikiPage $wikipage)
    {
        // Check authorization for draft pages
        if ($wikipage->status === 'draft' && $wikipage->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        // Return stored HTML or generate if missing
        $html = $wikipage->html_content;
        if (!$html) {
            $html = $this->generateHtml($wikipage->elements, $wikipage->title);
            $wikipage->update(['html_content' => $html]);
        }

        return response()->json([
            'success' => true,
            'html' => $html,
            'title' => $wikipage->title,
            'source' => $wikipage->html_content ? 'stored' : 'generated'
        ]);
    }

    /**
     * Generate HTML from elements array with Tailwind CSS
     */
    private function generateHtml($elements, $title = 'Wiki Page')
    {
        if (empty($elements)) {
            return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . htmlspecialchars($title) . '</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        * { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-6xl">
        <p class="text-gray-500 text-center">Empty wiki page</p>
    </div>
</body>
</html>';
        }

        // Helper function to convert styles to Tailwind classes
        $stylesToTailwind = function($styles) {
            if (empty($styles)) return '';
            
            $classes = [];
            
            // Map common styles to Tailwind classes
            $mappings = [
                'backgroundColor' => function($value) {
                    if (preg_match('/^#[0-9A-F]{6}$/i', $value) || preg_match('/^#[0-9A-F]{3}$/i', $value)) {
                        return 'bg-[' . $value . ']';
                    }
                    return 'bg-' . $value;
                },
                'color' => function($value) {
                    if (preg_match('/^#[0-9A-F]{6}$/i', $value) || preg_match('/^#[0-9A-F]{3}$/i', $value)) {
                        return 'text-[' . $value . ']';
                    }
                    return 'text-' . $value;
                },
                'padding' => function($value) {
                    return 'p-[' . $value . ']';
                },
                'margin' => function($value) {
                    return 'm-[' . $value . ']';
                },
                'fontSize' => function($value) {
                    return 'text-[' . $value . ']';
                },
                'fontWeight' => function($value) {
                    return 'font-[' . $value . ']';
                },
                'textAlign' => function($value) {
                    return 'text-' . $value;
                },
                'borderRadius' => function($value) {
                    return 'rounded-[' . $value . ']';
                },
                'boxShadow' => function($value) {
                    return 'shadow-[' . $value . ']';
                },
                'borderWidth' => function($value) {
                    return 'border-[' . $value . ']';
                },
                'borderColor' => function($value) {
                    if (preg_match('/^#[0-9A-F]{6}$/i', $value) || preg_match('/^#[0-9A-F]{3}$/i', $value)) {
                        return 'border-[' . $value . ']';
                    }
                    return 'border-' . $value;
                },
                'width' => function($value) {
                    return $value === '100%' ? 'w-full' : 'w-[' . $value . ']';
                },
                'height' => function($value) {
                    return $value === '100%' ? 'h-full' : 'h-[' . $value . ']';
                },
                'gap' => function($value) {
                    return 'gap-[' . $value . ']';
                },
                'display' => function($value) {
                    return $value === 'none' ? 'hidden' : $value;
                },
                'alignItems' => function($value) {
                    $map = ['flex-start' => 'items-start', 'flex-end' => 'items-end', 'center' => 'items-center'];
                    return $map[$value] ?? 'items-[' . $value . ']';
                },
                'justifyContent' => function($value) {
                    $map = ['flex-start' => 'justify-start', 'flex-end' => 'justify-end', 'center' => 'justify-center', 'space-between' => 'justify-between'];
                    return $map[$value] ?? 'justify-[' . $value . ']';
                },
                'flexDirection' => function($value) {
                    return strpos($value, 'row') !== false ? 'flex-row' : 'flex-col';
                },
                'gridTemplateColumns' => function($value) {
                    return 'grid-cols-[' . $value . ']';
                },
                'lineHeight' => function($value) {
                    return 'leading-[' . $value . ']';
                },
                'letterSpacing' => function($value) {
                    return 'tracking-[' . $value . ']';
                },
                'textTransform' => function($value) {
                    return $value;
                },
                'textDecoration' => function($value) {
                    return $value;
                },
                'opacity' => function($value) {
                    return 'opacity-[' . $value . ']';
                },
                'zIndex' => function($value) {
                    return 'z-[' . $value . ']';
                },
                'position' => function($value) {
                    return $value;
                },
                'top' => function($value) {
                    return 'top-[' . $value . ']';
                },
                'bottom' => function($value) {
                    return 'bottom-[' . $value . ']';
                },
                'left' => function($value) {
                    return 'left-[' . $value . ']';
                },
                'right' => function($value) {
                    return 'right-[' . $value . ']';
                },
                'overflow' => function($value) {
                    return 'overflow-' . $value;
                },
                'transition' => function($value) {
                    return 'transition-all duration-300 ease-in-out';
                },
            ];
            
            // Process each style property
            foreach ($styles as $key => $value) {
                if (!empty($value) && isset($mappings[$key])) {
                    $twClass = $mappings[$key]($value);
                    if ($twClass) {
                        $classes[] = $twClass;
                    }
                }
            }
            
            return implode(' ', $classes);
        };

        $htmlContent = '';
        foreach ($elements as $element) {
            $tailwindClasses = $stylesToTailwind($element['styles'] ?? []);
            
            // Safely parse JSON content
            $contentData = [];
            if (isset($element['content']) && !empty($element['content'])) {
                if (is_string($element['content']) && 
                    ($element['content'][0] === '{' || $element['content'][0] === '[')) {
                    try {
                        $contentData = json_decode($element['content'], true);
                    } catch (\Exception $e) {
                        $contentData = ['text' => $element['content']];
                    }
                } else {
                    $contentData = ['text' => $element['content']];
                }
            }

            $type = $element['type'] ?? 'CONTAINER';
            
            switch ($type) {
                case 'HEADER':
                    $htmlContent .= '<h2 class="' . $tailwindClasses . ' font-bold mb-4">' . htmlspecialchars($element['content'] ?? '') . '</h2>';
                    break;
                case 'PARAGRAPH':
                    $htmlContent .= '<p class="' . $tailwindClasses . ' mb-6 leading-relaxed">' . nl2br(htmlspecialchars($element['content'] ?? '')) . '</p>';
                    break;
                case 'BUTTON':
                    if (isset($element['href']) && $element['href']) {
                        $htmlContent .= '<a href="' . htmlspecialchars($element['href']) . '" class="' . $tailwindClasses . ' inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg">' . htmlspecialchars($element['content'] ?? '') . '</a>';
                    } else {
                        $htmlContent .= '<button class="' . $tailwindClasses . ' inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 shadow-md hover:shadow-lg">' . htmlspecialchars($element['content'] ?? '') . '</button>';
                    }
                    break;
                case 'IMAGE':
                    $src = $element['src'] ?? 'https://picsum.photos/400/300';
                    $alt = $element['alt'] ?? '';
                    $htmlContent .= '<img src="' . htmlspecialchars($src) . '" alt="' . htmlspecialchars($alt) . '" class="' . $tailwindClasses . ' max-w-full h-auto rounded-lg shadow-md" />';
                    break;
                case 'CONTAINER':
                    $htmlContent .= '<div class="' . $tailwindClasses . ' border border-gray-200 rounded-lg p-4">' . htmlspecialchars($element['content'] ?? '') . '</div>';
                    break;
                case 'TWO_COL':
                    $left = $contentData['left'] ?? 'Left Column Content';
                    $right = $contentData['right'] ?? 'Right Column Content';
                    $htmlContent .= '<div class="' . $tailwindClasses . ' grid grid-cols-1 md:grid-cols-2 gap-8">';
                    $htmlContent .= '<div class="p-6 bg-gray-50 rounded-lg">' . htmlspecialchars($left) . '</div>';
                    $htmlContent .= '<div class="p-6 bg-gray-50 rounded-lg">' . htmlspecialchars($right) . '</div>';
                    $htmlContent .= '</div>';
                    break;
                case 'NAVBAR':
                    $brand = $contentData['brand'] ?? 'My Brand';
                    $links = $contentData['links'] ?? [];
                    $buttonText = $contentData['buttonText'] ?? '';
                    $buttonHref = $contentData['buttonHref'] ?? '#';
                    
                    $linksHtml = '';
                    foreach ($links as $link) {
                        $linkText = is_array($link) ? ($link['text'] ?? 'Link') : $link;
                        $linkHref = is_array($link) ? ($link['href'] ?? '#') : '#';
                        $linksHtml .= '<li><a href="' . htmlspecialchars($linkHref) . '" class="text-gray-600 hover:text-primary-600 transition-colors duration-200">' . htmlspecialchars($linkText) . '</a></li>';
                    }
                    
                    $buttonHtml = '';
                    if ($buttonText) {
                        $buttonHtml = '<a href="' . htmlspecialchars($buttonHref) . '" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm">' . htmlspecialchars($buttonText) . '</a>';
                    }

                    $htmlContent .= '<nav class="' . $tailwindClasses . ' bg-white shadow-sm px-6 py-4">';
                    $htmlContent .= '<div class="container mx-auto flex items-center justify-between">';
                    $htmlContent .= '<div class="text-xl font-bold text-gray-900">' . htmlspecialchars($brand) . '</div>';
                    $htmlContent .= '<ul class="flex items-center space-x-6">' . $linksHtml . '</ul>';
                    $htmlContent .= $buttonHtml;
                    $htmlContent .= '</div></nav>';
                    break;
                case 'HERO':
                    $heroTitle = $contentData['title'] ?? 'Hero Title';
                    $subtitle = $contentData['subtitle'] ?? 'Hero subtitle text goes here...';
                    $cta = $contentData['cta'] ?? 'Get Started';
                    $ctaHref = $contentData['ctaHref'] ?? '#';
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20 px-4">';
                    $htmlContent .= '<div class="container mx-auto text-center max-w-4xl">';
                    $htmlContent .= '<h1 class="text-4xl md:text-5xl font-bold mb-6">' . htmlspecialchars($heroTitle) . '</h1>';
                    $htmlContent .= '<p class="text-xl mb-10 opacity-90">' . htmlspecialchars($subtitle) . '</p>';
                    $htmlContent .= '<a href="' . htmlspecialchars($ctaHref) . '" class="inline-block bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">';
                    $htmlContent .= htmlspecialchars($cta) . '</a>';
                    $htmlContent .= '</div></section>';
                    break;
                case 'FEATURES':
                    $features = is_array($contentData) ? $contentData : [];
                    $featuresHtml = '';
                    foreach ($features as $i => $feature) {
                        $title = $feature['title'] ?? 'Feature';
                        $desc = $feature['desc'] ?? 'Feature description';
                        $featuresHtml .= '<div class="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">';
                        $featuresHtml .= '<div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">';
                        $featuresHtml .= '<span class="text-primary-600 font-bold text-xl">' . ($i + 1) . '</span>';
                        $featuresHtml .= '</div>';
                        $featuresHtml .= '<h3 class="text-xl font-bold text-gray-900 mb-4">' . htmlspecialchars($title) . '</h3>';
                        $featuresHtml .= '<p class="text-gray-600 leading-relaxed">' . htmlspecialchars($desc) . '</p>';
                        $featuresHtml .= '</div>';
                    }
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' py-16 px-4">';
                    $htmlContent .= '<div class="container mx-auto">';
                    $htmlContent .= '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">' . $featuresHtml . '</div>';
                    $htmlContent .= '</div></section>';
                    break;
                case 'GALLERY':
                    $images = $contentData['images'] ?? [1, 2, 3, 4];
                    $galleryHtml = '';
                    foreach ($images as $i => $img) {
                        $src = is_string($img) && filter_var($img, FILTER_VALIDATE_URL) ? $img : 'https://picsum.photos/400/400?random=' . ($i + 1);
                        $galleryHtml .= '<div class="relative group overflow-hidden rounded-xl">';
                        $galleryHtml .= '<img src="' . htmlspecialchars($src) . '" alt="Gallery image ' . ($i + 1) . '" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" />';
                        $galleryHtml .= '<div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">';
                        $galleryHtml .= '<i class="fas fa-search text-white text-2xl"></i>';
                        $galleryHtml .= '</div></div>';
                    }
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' py-12 px-4">';
                    $htmlContent .= '<div class="container mx-auto">';
                    $htmlContent .= '<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">' . $galleryHtml . '</div>';
                    $htmlContent .= '</div></section>';
                    break;
                case 'PRODUCT_GRID':
                    $products = is_array($contentData) ? $contentData : [];
                    $productsHtml = '';
                    foreach ($products as $i => $product) {
                        $name = $product['name'] ?? 'Product';
                        $price = $product['price'] ?? '$99';
                        $image = $product['image'] ?? 'https://picsum.photos/400/300?product=' . ($i + 1);
                        $buttonText = $product['buttonText'] ?? 'Add to Cart';
                        
                        $productsHtml .= '<div class="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">';
                        $productsHtml .= '<div class="relative overflow-hidden h-48">';
                        $productsHtml .= '<img src="' . htmlspecialchars($image) . '" alt="' . htmlspecialchars($name) . '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />';
                        $productsHtml .= '<div class="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">';
                        $productsHtml .= '<i class="fas fa-heart text-gray-400"></i>';
                        $productsHtml .= '</div></div>';
                        $productsHtml .= '<div class="p-6">';
                        $productsHtml .= '<div class="flex justify-between items-start mb-4">';
                        $productsHtml .= '<h3 class="font-bold text-gray-900 text-lg">' . htmlspecialchars($name) . '</h3>';
                        $productsHtml .= '<span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-bold">' . htmlspecialchars($price) . '</span>';
                        $productsHtml .= '</div>';
                        $productsHtml .= '<button class="w-full bg-gray-900 hover:bg-primary-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">';
                        $productsHtml .= '<i class="fas fa-shopping-cart"></i>' . htmlspecialchars($buttonText);
                        $productsHtml .= '</button></div></div>';
                    }
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' py-12 px-4">';
                    $htmlContent .= '<div class="container mx-auto">';
                    $htmlContent .= '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">' . $productsHtml . '</div>';
                    $htmlContent .= '</div></section>';
                    break;
                case 'CONTACT_FORM':
                    $formTitle = $contentData['title'] ?? 'Contact Us';
                    $buttonText = $contentData['buttonText'] ?? 'Send Message';
                    $labels = $contentData['labels'] ?? [
                        'firstName' => 'First Name', 
                        'lastName' => 'Last Name', 
                        'email' => 'Email Address', 
                        'message' => 'Message'
                    ];
                    
                    $htmlContent .= '<section class="' . $tailwindClasses . ' py-16 px-4">';
                    $htmlContent .= '<div class="container mx-auto max-w-2xl">';
                    $htmlContent .= '<div class="bg-white rounded-2xl shadow-lg p-8 md:p-12">';
                    $htmlContent .= '<div class="text-center mb-10">';
                    $htmlContent .= '<h3 class="text-3xl font-bold text-gray-900 mb-4">' . htmlspecialchars($formTitle) . '</h3>';
                    $htmlContent .= '<p class="text-gray-600">We typically reply within 2 hours.</p>';
                    $htmlContent .= '</div>';
                    $htmlContent .= '<form class="space-y-6">';
                    $htmlContent .= '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
                    $htmlContent .= '<div>';
                    $htmlContent .= '<label class="block text-sm font-bold text-gray-700 uppercase mb-2">' . htmlspecialchars($labels['firstName'] ?? 'First Name') . '</label>';
                    $htmlContent .= '<input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="John" />';
                    $htmlContent .= '</div>';
                    $htmlContent .= '<div>';
                    $htmlContent .= '<label class="block text-sm font-bold text-gray-700 uppercase mb-2">' . htmlspecialchars($labels['lastName'] ?? 'Last Name') . '</label>';
                    $htmlContent .= '<input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="Doe" />';
                    $htmlContent .= '</div>';
                    $htmlContent .= '</div>';
                    $htmlContent .= '<div>';
                    $htmlContent .= '<label class="block text-sm font-bold text-gray-700 uppercase mb-2">' . htmlspecialchars($labels['email'] ?? 'Email Address') . '</label>';
                    $htmlContent .= '<input type="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all" placeholder="john@example.com" />';
                    $htmlContent .= '</div>';
                    $htmlContent .= '<div>';
                    $htmlContent .= '<label class="block text-sm font-bold text-gray-700 uppercase mb-2">' . htmlspecialchars($labels['message'] ?? 'Message') . '</label>';
                    $htmlContent .= '<textarea rows="4" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none transition-all" placeholder="How can we help you?"></textarea>';
                    $htmlContent .= '</div>';
                    $htmlContent .= '<button type="submit" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">';
                    $htmlContent .= '<i class="fas fa-paper-plane"></i>' . htmlspecialchars($buttonText);
                    $htmlContent .= '</button></form></div></div></section>';
                    break;
                case 'FOOTER':
                    $brand = $contentData['brand'] ?? 'My Website';
                    $copyright = $contentData['copyright'] ?? '© 2024 My Website';
                    $links = $contentData['links'] ?? [];
                    
                    $linksHtml = '';
                    foreach ($links as $col) {
                        $colTitle = $col['title'] ?? 'Column';
                        $colItems = $col['items'] ?? [];
                        
                        $linksHtml .= '<div>';
                        $linksHtml .= '<h4 class="font-bold text-gray-900 mb-4 text-lg">' . htmlspecialchars($colTitle) . '</h4>';
                        $linksHtml .= '<ul class="space-y-3">';
                        
                        foreach ($colItems as $item) {
                            $linksHtml .= '<li><a href="#" class="text-gray-600 hover:text-primary-600 transition-colors duration-200">' . htmlspecialchars($item) . '</a></li>';
                        }
                        
                        $linksHtml .= '</ul></div>';
                    }
                    
                    $htmlContent .= '<footer class="' . $tailwindClasses . ' bg-gray-900 text-gray-300 py-12 px-4">';
                    $htmlContent .= '<div class="container mx-auto">';
                    $htmlContent .= '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">';
                    $htmlContent .= '<div class="lg:col-span-2">';
                    $htmlContent .= '<div class="flex items-center gap-3 mb-6">';
                    $htmlContent .= '<div class="w-10 h-10 bg-primary-600 rounded-lg"></div>';
                    $htmlContent .= '<h3 class="text-2xl font-bold text-white">' . htmlspecialchars($brand) . '</h3>';
                    $htmlContent .= '</div>';
                    $htmlContent .= '<p class="text-gray-400 max-w-md leading-relaxed">';
                    $htmlContent .= 'Empowering creators to build the web of tomorrow, block by block.';
                    $htmlContent .= '</p></div>';
                    $htmlContent .= $linksHtml;
                    $htmlContent .= '</div>';
                    $htmlContent .= '<div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">';
                    $htmlContent .= '<p class="text-gray-500">' . htmlspecialchars($copyright) . '</p>';
                    $htmlContent .= '<div class="flex space-x-6 mt-4 md:mt-0">';
                    $htmlContent .= '<a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>';
                    $htmlContent .= '<a href="#" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>';
                    $htmlContent .= '</div></div></div></footer>';
                    break;
                default:
                    $htmlContent .= '<div class="' . $tailwindClasses . '">' . htmlspecialchars($element['content'] ?? '') . '</div>';
            }
        }

        return '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>' . htmlspecialchars($title) . '</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        * { font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-6xl animate-[fadeIn_0.6s_ease-out]">
        ' . $htmlContent . '
    </div>
</body>
</html>';
    }

    /**
     * Get HTML statistics for a wiki page
     */
    public function getHtmlStats(WikiPage $wikipage)
    {
        // Check authorization
        if ($wikipage->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        $html = $wikipage->html_content;
        $hasHtml = !empty($html);
        
        return response()->json([
            'success' => true,
            'stats' => [
                'has_html' => $hasHtml,
                'html_length' => $hasHtml ? strlen($html) : 0,
                'elements_count' => count($wikipage->elements),
                'last_updated' => $wikipage->updated_at,
                'html_updated_at' => $wikipage->updated_at, // HTML is updated when page is updated
                'estimated_size_kb' => $hasHtml ? round(strlen($html) / 1024, 2) : 0
            ]
        ]);
    }
}