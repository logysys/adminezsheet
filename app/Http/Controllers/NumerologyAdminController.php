<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NumerologySearch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NumerologyAdminController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->input('limit', 100);
        $search = $request->input('search');
        $agent = $request->input('agent');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        $minCost = $request->input('min_cost');
        $maxCost = $request->input('max_cost');

        $limit = is_numeric($limit) && $limit > 0 ? (int)$limit : 100;

        $searches = NumerologySearch::query()
            ->when($search, function ($query, $search) {
                $query->where('watch_out', 'like', "%{$search}%")
                    ->orWhere('expect', 'like', "%{$search}%")
                    ->orWhere('extra_nuance', 'like', "%{$search}%");
            })
            ->when($agent, function ($query, $agent) {
                $query->where('agent_used', $agent);
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->when($minCost !== null && $minCost !== '', function ($query) use ($minCost) {
                $query->where('cost_usd', '>=', (float)$minCost);
            })
            ->when($maxCost !== null && $maxCost !== '', function ($query) use ($maxCost) {
                $query->where('cost_usd', '<=', (float)$maxCost);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($limit)
            ->withQueryString();

        // Convert paginated data to ensure proper numeric types
        $searches->getCollection()->transform(function ($item) {
            return [
                'id' => $item->id,
                'user_number' => $item->user_number,
                'agent_used' => $item->agent_used,
                'watch_out' => $item->watch_out,
                'expect' => $item->expect,
                'extra_nuance' => $item->extra_nuance,
                'input_tokens' => (int)$item->input_tokens,
                'output_tokens' => (int)$item->output_tokens,
                'cost_usd' => (float)$item->cost_usd,
                'ip_address' => $item->ip_address,
                'user_agent' => $item->user_agent,
                'created_at' => $item->created_at,
            ];
        });

        // Get statistics for dashboard
        $stats = [
            'total_searches' => NumerologySearch::count(),
            'total_cost' => (float)NumerologySearch::sum('cost_usd'),
            'total_input_tokens' => (int)NumerologySearch::sum('input_tokens'),
            'total_output_tokens' => (int)NumerologySearch::sum('output_tokens'),
            'avg_cost' => (float)(NumerologySearch::avg('cost_usd') ?? 0),
            'searches_by_agent' => NumerologySearch::selectRaw('agent_used, COUNT(*) as count, SUM(cost_usd) as total_cost')
                ->groupBy('agent_used')
                ->get()
                ->map(fn($item) => [
                    'agent' => $item->agent_used,
                    'count' => (int)$item->count,
                    'total_cost' => (float)$item->total_cost
                ]),
            'today_searches' => (int)NumerologySearch::whereDate('created_at', today())->count(),
            'week_searches' => (int)NumerologySearch::whereBetween('created_at', [now()->subDays(7), now()])->count(),
        ];

        return Inertia::render('Numerology/Index', [
            'searches' => $searches,
            'filters' => [
                'limit' => (string)$limit,
                'search' => $search ?? '',
                'agent' => $agent ?? '',
                'date_from' => $dateFrom ?? '',
                'date_to' => $dateTo ?? '',
                'min_cost' => $minCost ?? '',
                'max_cost' => $maxCost ?? '',
            ],
            'stats' => $stats,
            'flash' => session('flash')
        ]);
    }

    public function show(NumerologySearch $numerologySearch)
    {
        // Ensure numeric values are properly cast
        $search = [
            'id' => $numerologySearch->id,
            'user_number' => $numerologySearch->user_number,
            'agent_used' => $numerologySearch->agent_used,
            'watch_out' => $numerologySearch->watch_out,
            'expect' => $numerologySearch->expect,
            'extra_nuance' => $numerologySearch->extra_nuance,
            'input_tokens' => (int)$numerologySearch->input_tokens,
            'output_tokens' => (int)$numerologySearch->output_tokens,
            'cost_usd' => (float)$numerologySearch->cost_usd,
            'ip_address' => $numerologySearch->ip_address,
            'user_agent' => $numerologySearch->user_agent,
            'created_at' => $numerologySearch->created_at,
        ];

        return Inertia::render('Numerology/Show', [
            'search' => $search
        ]);
    }

    public function destroy(NumerologySearch $numerologySearch)
    {
        $numerologySearch->delete();
        return redirect()->route('numerology.index')->with('success', 'Search record deleted successfully.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:numerology_searches,id'
        ]);

        NumerologySearch::whereIn('id', $request->ids)->delete();

        return redirect()->route('numerology.index')->with('success', 'Selected records deleted successfully.');
    }

    public function clearAll(Request $request)
    {
        $agent = $request->input('agent');
        
        $query = NumerologySearch::query();
        if ($agent && in_array($agent, ['openai', 'kimi', 'perplexity', 'gemini', 'deepseek'])) {
            $query->where('agent_used', $agent);
            $count = $query->delete();
            $message = "Deleted {$count} records for agent: {$agent}";
        } else {
            $count = $query->delete();
            $message = "Deleted all {$count} numerology records";
        }

        return redirect()->route('numerology.index')->with('success', $message);
    }

    public function export(Request $request)
    {
        $search = $request->input('search');
        $agent = $request->input('agent');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');

        $searches = NumerologySearch::query()
            ->when($search, function ($query, $search) {
                $query->where('watch_out', 'like', "%{$search}%")
                    ->orWhere('expect', 'like', "%{$search}%");
            })
            ->when($agent, fn($q, $a) => $q->where('agent_used', $a))
            ->when($dateFrom, fn($q, $d) => $q->whereDate('created_at', '>=', $d))
            ->when($dateTo, fn($q, $d) => $q->whereDate('created_at', '<=', $d))
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'numerology_export_' . date('Y-m-d_His') . '.csv';
        $handle = fopen('php://temp', 'w');
        
        // Headers
        fputcsv($handle, [
            'ID', 'User Number', 'Agent', 'Watch Out', 'Expect', 
            'Extra Nuance', 'Input Tokens', 'Output Tokens', 
            'Cost USD', 'IP Address', 'Created At'
        ]);

        // Data
        foreach ($searches as $search) {
            fputcsv($handle, [
                $search->id,
                $search->user_number,
                $search->agent_used,
                $search->watch_out,
                $search->expect,
                $search->extra_nuance,
                (int)$search->input_tokens,
                (int)$search->output_tokens,
                (float)$search->cost_usd,
                $search->ip_address,
                $search->created_at
            ]);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response($csv, 200)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }

    public function dashboardStats()
    {
        $stats = [
            'total_searches' => NumerologySearch::count(),
            'total_cost' => (float)NumerologySearch::sum('cost_usd'),
            'total_tokens' => (int)(NumerologySearch::sum('input_tokens') + NumerologySearch::sum('output_tokens')),
            'avg_cost_per_search' => (float)(NumerologySearch::avg('cost_usd') ?? 0),
            'searches_last_7_days' => NumerologySearch::where('created_at', '>=', now()->subDays(7))
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'searches_by_agent' => NumerologySearch::selectRaw('agent_used, COUNT(*) as count, SUM(cost_usd) as total_cost')
                ->groupBy('agent_used')
                ->get(),
            'most_popular_numbers' => NumerologySearch::selectRaw('user_number, COUNT(*) as count')
                ->groupBy('user_number')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($stats);
    }
}