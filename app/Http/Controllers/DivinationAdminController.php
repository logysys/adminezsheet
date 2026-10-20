<?php

namespace App\Http\Controllers;

use App\Models\DivinationRecord;
use App\Models\GlobalStat;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DivinationAdminController extends Controller
{
    /**
     * Display a listing of divination records.
     */
    public function index(Request $request)
    {
        $limit = $request->input('limit', 50);
        $search = $request->input('search');
        $aiSource = $request->input('ai_source');
        $luckLevel = $request->input('luck_level');
        $isFavorite = $request->input('is_favorite');
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        
        $limit = is_numeric($limit) && $limit > 0 ? (int)$limit : 50;
        
        $records = DivinationRecord::query()
            ->with('user')
            ->when($search, function ($query, $search) {
                $query->where('character', 'like', "%{$search}%")
                      ->orWhere('structure', 'like', "%{$search}%")
                      ->orWhere('fortune', 'like', "%{$search}%");
            })
            ->when($aiSource, function ($query, $aiSource) {
                $query->where('ai_source', $aiSource);
            })
            ->when($luckLevel, function ($query, $luckLevel) {
                $query->where('luck_level', 'like', "%{$luckLevel}%");
            })
            ->when($isFavorite !== null && $isFavorite !== '', function ($query) use ($isFavorite) {
                $query->where('is_favorite', filter_var($isFavorite, FILTER_VALIDATE_BOOLEAN));
            })
            ->when($dateFrom, function ($query, $dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query, $dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($limit)
            ->withQueryString();
        
        // Get statistics for dashboard
        $stats = $this->getStats($request);
        
        return Inertia::render('Divination/Index', [
            'records' => $records,
            'filters' => [
                'limit' => (string) $limit,
                'search' => $search ?? '',
                'ai_source' => $aiSource ?? '',
                'luck_level' => $luckLevel ?? '',
                'is_favorite' => $isFavorite ?? '',
                'date_from' => $dateFrom ?? '',
                'date_to' => $dateTo ?? '',
            ],
            'stats' => $stats,
            'globalStats' => GlobalStat::getSummary(),
            'flash' => session('flash')
        ]);
    }
    
    /**
     * Get statistics for the dashboard.
     */
    private function getStats(Request $request)
    {
        $query = DivinationRecord::query();
        
        // Apply same filters as index for stats
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('character', 'like', "%{$search}%")
                  ->orWhere('structure', 'like', "%{$search}%");
            });
        }
        
        if ($aiSource = $request->input('ai_source')) {
            $query->where('ai_source', $aiSource);
        }
        
        return [
            'total_records' => (clone $query)->count(),
            'total_favorites' => (clone $query)->where('is_favorite', true)->count(),
            'by_ai_source' => [
                'kimi' => (clone $query)->where('ai_source', 'kimi')->count(),
                'perplexity' => (clone $query)->where('ai_source', 'perplexity')->count(),
                'offline' => (clone $query)->where('ai_source', 'offline')->count(),
            ],
            'by_luck_level' => [
                '大吉' => (clone $query)->where('luck_level', 'like', '%大吉%')->count(),
                '上吉' => (clone $query)->where('luck_level', 'like', '%上吉%')->count(),
                '中吉' => (clone $query)->where('luck_level', 'like', '%中吉%')->count(),
                '小吉' => (clone $query)->where('luck_level', 'like', '%小吉%')->count(),
                '平' => (clone $query)->where('luck_level', 'like', '%平%')->count(),
            ],
            'avg_response_time' => (clone $query)->avg('response_time_ms'),
            'total_cost' => (clone $query)->sum(DB::raw('JSON_EXTRACT(cost_data, "$.total_cost")')),
        ];
    }
    
    /**
     * Display the specified record.
     */
    public function show(DivinationRecord $divinationRecord)
    {
        $divinationRecord->load('user');
        
        return Inertia::render('Divination/Show', [
            'record' => $divinationRecord,
            'globalStats' => GlobalStat::getSummary(),
        ]);
    }
    
    /**
     * Show the form for editing the specified record.
     */
    public function edit(DivinationRecord $divinationRecord)
    {
        return Inertia::render('Divination/Edit', [
            'record' => $divinationRecord,
        ]);
    }
    
    /**
     * Update the specified record.
     */
    public function update(Request $request, DivinationRecord $divinationRecord)
    {
        $validated = $request->validate([
            'character' => 'required|string|size:1',
            'structure' => 'nullable|string',
            'fortune' => 'nullable|string',
            'luck_level' => 'nullable|string',
            'is_favorite' => 'boolean',
        ]);
        
        $divinationRecord->update($validated);
        
        return redirect()->route('divination.index')
            ->with('success', 'Divination record updated successfully.');
    }
    
    /**
     * Remove the specified record.
     */
    public function destroy(DivinationRecord $divinationRecord)
    {
        $divinationRecord->delete();
        
        return redirect()->route('divination.index')
            ->with('success', 'Divination record deleted successfully.');
    }
    
    /**
     * Bulk delete records.
     */
    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:divination_records,id',
        ]);
        
        DivinationRecord::whereIn('id', $validated['ids'])->delete();
        
        return redirect()->route('divination.index')
            ->with('success', 'Selected records deleted successfully.');
    }
    
    /**
     * Export records.
     */
    public function export(Request $request)
    {
        $query = DivinationRecord::query();
        
        // Apply filters
        if ($search = $request->input('search')) {
            $query->where('character', 'like', "%{$search}%");
        }
        
        if ($aiSource = $request->input('ai_source')) {
            $query->where('ai_source', $aiSource);
        }
        
        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        
        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }
        
        $records = $query->orderBy('created_at', 'desc')->get();
        
        $filename = 'divination_records_' . date('Y-m-d_His') . '.csv';
        
        $handle = fopen('php://temp', 'w+');
        
        // Add UTF-8 BOM for Excel compatibility
        fwrite($handle, "\xEF\xBB\xBF");
        
        // Headers
        fputcsv($handle, [
            'ID', 'Character', 'Structure', 'Fortune', 'Luck Level', 
            'AI Source', 'Is Favorite', 'Total Cost', 'Input Tokens', 
            'Output Tokens', 'Response Time (ms)', 'Created At'
        ]);
        
        foreach ($records as $record) {
            $costData = $record->cost_data ?? [];
            fputcsv($handle, [
                $record->id,
                $record->character,
                $record->structure,
                $record->fortune,
                $record->luck_level,
                $record->ai_source,
                $record->is_favorite ? 'Yes' : 'No',
                $costData['total_cost'] ?? 0,
                ($costData['input_tokens'] ?? 0) + ($costData['input_tokens'] ?? 0),
                ($costData['output_tokens'] ?? 0) + ($costData['output_tokens'] ?? 0),
                $record->response_time_ms,
                $record->created_at,
            ]);
        }
        
        rewind($handle);
        $csvContent = stream_get_contents($handle);
        fclose($handle);
        
        return response($csvContent)
            ->withHeaders([
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
    }
    
    /**
     * Get dashboard statistics (AJAX).
     */
    public function dashboardStats(Request $request)
    {
        $period = $request->input('period', 'week'); // week, month, year
        
        $dateFrom = match($period) {
            'week' => now()->subDays(7),
            'month' => now()->subMonth(),
            'year' => now()->subYear(),
            default => now()->subDays(7),
        };
        
        $dailyStats = DivinationRecord::where('created_at', '>=', $dateFrom)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        $aiSourceStats = DivinationRecord::where('created_at', '>=', $dateFrom)
            ->select('ai_source', DB::raw('COUNT(*) as count'))
            ->groupBy('ai_source')
            ->get();
        
        return response()->json([
            'success' => true,
            'data' => [
                'daily' => $dailyStats,
                'by_ai_source' => $aiSourceStats,
            ]
        ]);
    }
}