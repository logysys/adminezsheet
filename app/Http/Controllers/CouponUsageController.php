<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\CouponUsage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class CouponUsageController extends Controller
{
    /**
     * Display a listing of coupon usages.
     */
    public function index(Request $request): Response
    {
        $query = CouponUsage::with(['coupon', 'user' => function($query) {
            $query->select('id', 'name', 'email');
        }]);
        
        // Apply filters
        if ($request->filled('coupon_id')) {
            $query->where('coupon_id', $request->coupon_id);
        }
        
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        if ($request->filled('date_from')) {
            $query->whereDate('used_at', '>=', $request->date_from);
        }
        
        if ($request->filled('date_to')) {
            $query->whereDate('used_at', '<=', $request->date_to);
        }
        
        $usages = $query->orderBy('used_at', 'desc')
            ->paginate(15)
            ->withQueryString();
        
        // Get all coupons for filter dropdown
        $coupons = Coupon::orderBy('coupon')->get(['id', 'coupon', 'title']);
        
        return Inertia::render('CouponUsages/Index', [
            'usages' => $usages,
            'coupons' => $coupons,
            'filters' => $request->only(['coupon_id', 'user_id', 'date_from', 'date_to'])
        ]);
    }
    
    /**
     * Display usage statistics.
     */
    public function statistics(Request $request): Response
    {
        $totalUsages = CouponUsage::count();
        $uniqueUsers = CouponUsage::distinct('user_id')->count('user_id');
        
        // Top coupons with usage count
        $topCoupons = CouponUsage::with('coupon')
            ->selectRaw('coupon_id, COUNT(*) as usage_count')
            ->groupBy('coupon_id')
            ->orderBy('usage_count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'coupon_id' => $item->coupon_id,
                    'coupon' => $item->coupon,
                    'usage_count' => $item->usage_count
                ];
            });
        
        // Get daily usage for last 30 days with missing dates filled
        $dailyUsages = $this->getDailyUsages(30);
        
        // Get monthly trends
        $monthlyUsages = $this->getMonthlyUsages(12);
        
        // Get usage by hour
        $hourlyUsages = $this->getHourlyUsages();
        
        return Inertia::render('CouponUsages/Statistics', [
            'totalUsages' => $totalUsages,
            'uniqueUsers' => $uniqueUsers,
            'topCoupons' => $topCoupons,
            'dailyUsages' => $dailyUsages,
            'monthlyUsages' => $monthlyUsages,
            'hourlyUsages' => $hourlyUsages,
        ]);
    }
    
    /**
     * Get daily usage statistics for the last X days
     */
    private function getDailyUsages(int $days): array
    {
        $result = [];
        $startDate = now()->subDays($days)->startOfDay();
        
        // Get actual usages
        $usages = CouponUsage::selectRaw('DATE(used_at) as date, COUNT(*) as count')
            ->where('used_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get()
            ->keyBy('date');
        
        // Fill in missing dates
        for ($i = $days; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $result[] = [
                'date' => $date,
                'count' => $usages[$date]->count ?? 0
            ];
        }
        
        return $result;
    }
    
    /**
     * Get monthly usage statistics
     */
    private function getMonthlyUsages(int $months): array
    {
        $result = [];
        $startDate = now()->subMonths($months)->startOfMonth();
        
        $usages = CouponUsage::selectRaw('DATE_FORMAT(used_at, "%Y-%m") as month, COUNT(*) as count')
            ->where('used_at', '>=', $startDate)
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get()
            ->keyBy('month');
        
        for ($i = $months; $i >= 0; $i--) {
            $month = now()->subMonths($i)->format('Y-m');
            $result[] = [
                'month' => $month,
                'display' => now()->subMonths($i)->format('M Y'),
                'count' => $usages[$month]->count ?? 0
            ];
        }
        
        return $result;
    }
    
    /**
     * Get usage statistics by hour of day
     */
    private function getHourlyUsages(): array
    {
        $result = [];
        
        $usages = CouponUsage::selectRaw('HOUR(used_at) as hour, COUNT(*) as count')
            ->groupBy('hour')
            ->orderBy('hour', 'asc')
            ->get()
            ->keyBy('hour');
        
        for ($hour = 0; $hour <= 23; $hour++) {
            $result[] = [
                'hour' => $hour,
                'display' => sprintf('%02d:00', $hour),
                'count' => $usages[$hour]->count ?? 0
            ];
        }
        
        return $result;
    }
    
    /**
     * Export coupon usages to CSV
     */
    public function export(Request $request): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $query = CouponUsage::with(['coupon', 'user']);
        
        // Apply same filters as index
        if ($request->filled('coupon_id')) {
            $query->where('coupon_id', $request->coupon_id);
        }
        
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        
        if ($request->filled('date_from')) {
            $query->whereDate('used_at', '>=', $request->date_from);
        }
        
        if ($request->filled('date_to')) {
            $query->whereDate('used_at', '<=', $request->date_to);
        }
        
        $usages = $query->orderBy('used_at', 'desc')->get();
        
        $filename = 'coupon-usages-' . now()->format('Y-m-d-His') . '.csv';
        
        $callback = function() use ($usages) {
            $handle = fopen('php://output', 'w');
            
            // Add headers
            fputcsv($handle, ['ID', 'Coupon Code', 'Coupon Title', 'User ID', 'User Email', 'User Name', 'Used At', 'Created At']);
            
            // Add rows
            foreach ($usages as $usage) {
                fputcsv($handle, [
                    $usage->id,
                    $usage->coupon_code,
                    $usage->coupon?->title ?? 'N/A',
                    $usage->user_id,
                    $usage->user?->email ?? 'N/A',
                    $usage->user?->name ?? 'N/A',
                    $usage->used_at,
                    $usage->created_at,
                ]);
            }
            
            fclose($handle);
        };
        
        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
    
    /**
     * Remove the specified usage record.
     */
    public function destroy(CouponUsage $couponUsage): RedirectResponse
    {
        // Optional: Add authorization check
        // $this->authorize('delete', $couponUsage);
        
        $couponUsage->delete();
        
        return redirect()->back()->with('success', 'Usage record deleted successfully.');
    }
    
    /**
     * Bulk delete usage records.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:coupon_usages,id'
        ]);
        
        // Optional: Add authorization check
        // $this->authorize('deleteAny', CouponUsage::class);
        
        $deletedCount = CouponUsage::whereIn('id', $request->ids)->delete();
        
        return redirect()->back()->with('success', "{$deletedCount} usage record(s) deleted successfully.");
    }
    
    /**
     * Get usage statistics for a specific coupon
     */
    public function couponStatistics(Coupon $coupon): Response
    {
        $totalUsages = $coupon->usages()->count();
        $uniqueUsers = $coupon->usages()->distinct('user_id')->count('user_id');
        $dailyUsages = $coupon->usages()
            ->selectRaw('DATE(used_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(30)
            ->get();
        
        return Inertia::render('CouponUsages/CouponStatistics', [
            'coupon' => $coupon,
            'totalUsages' => $totalUsages,
            'uniqueUsers' => $uniqueUsers,
            'dailyUsages' => $dailyUsages,
        ]);
    }
}