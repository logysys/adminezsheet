<?php

namespace App\Http\Controllers;

use App\Models\TokenTransaction;
use App\Models\PointPurchase;
use App\Models\HandlePurchase;
use App\Models\TokenInfo;
use App\Models\HandleSellingDetail;
use App\Models\EzFunnel;
use App\Models\HandleTransfer;
use App\Models\Domain;
use App\Models\Customdomain;
use App\Models\IncentiveHistory;
use App\Models\Invoice;
use App\Models\Userlist;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        // Get total users count for admin dashboard
        $totalUsers = Userlist::count();
        
        // Get recent token transactions from all users
        $tokenTransactions = TokenTransaction::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        // Get recent point purchases from all users
        $pointPurchases = PointPurchase::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        // Get recent handle purchases from all users - UPDATED
        $handlePurchases = HandlePurchase::with(['user', 'Customdomain', 'domain'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($purchase) {
                $domain = $purchase->Customdomain ?? $purchase->domain;
                $type = $purchase->Customdomain ? 'custom' : ($purchase->domain ? 'standard' : 'unknown');
                
                return [
                    'id' => $purchase->id,
                    'bee_points_amount' => $purchase->bee_points_amount,
                    'amount' => $purchase->amount,
                    'currency' => $purchase->currency,
                    'payment_method' => $purchase->payment_method,
                    'status' => $purchase->status,
                    'created_at' => $purchase->created_at,
                    'user' => $purchase->user ? [
                        'name' => $purchase->user->name,
                        'email' => $purchase->user->email
                    ] : null,
                    'domain' => $domain ? [
                        'domain' => $domain->domain,
                        'domainselected' => $domain->domainselected,
                        'type' => $type
                    ] : null
                ];
            });
            
        // Get recent selling details from all users
        $sellingDetails = HandleSellingDetail::with(['user', 'customDomain', 'domain'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        // Get user-specific funnels or all funnels for admin with search functionality
        $funnelQuery = EzFunnel::with(['user', 'customDomains', 'handleDomains'])
            ->withCount(['customDomains', 'handleDomains']);

        if ($request->has('funnel_search')) {
                $search = $request->funnel_search;
                $searchType = $request->funnel_search_type ?? 'fuzzy';
                
                if ($searchType === 'exact') {
                    $funnelQuery->where('token', $search);
                } else {
                    $funnelQuery->where('token', 'like', '%'.$search.'%');
                }
            }

        $funnels = $funnelQuery->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        // Get all domains
        $domains = Domain::with(['user', 'funnel'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        // Get all custom domains
        $customDomains = Customdomain::with(['user', 'funnel'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        // Get recent transfers
        $transfers = HandleTransfer::with(['sender', 'recipient'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();
            
        // Get recent incentive history
        $incentives = IncentiveHistory::with(['user', 'invoice'])
            ->orderBy('distributed_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($incentive) {
                return [
                    'id' => $incentive->id,
                    'user_id' => $incentive->user_id,
                    'user_name' => $incentive->user->name ?? 'Unknown User',
                    'amount' => $incentive->amount,
                    'description' => $incentive->description,
                    'distributed_at' => $incentive->distributed_at,
                    'invoice_number' => $incentive->invoice->invoice_number ?? null,
                    'created_at' => $incentive->created_at
                ];
            });
            
        // Get token information
        $tokenInfo = TokenInfo::first();
        
        // Calculate total incentives across all users
        $totalIncentives = IncentiveHistory::sum('amount');

        // Get system-wide statistics for admin dashboard
        $stats = [
            'total_users' => $totalUsers,
            'total_funnels' => EzFunnel::count(),
            'total_domains' => Domain::count() + Customdomain::count(),
            'total_transactions' => TokenTransaction::count(),
            'total_point_purchases' => PointPurchase::where('status', 'completed')->sum('fiat_amount'),
        ];

        return Inertia::render('Dashboard', [
            'user' => $user,
            'tokenTransactions' => $tokenTransactions,
            'pointPurchases' => $pointPurchases,
            'handlePurchases' => $handlePurchases,
            'sellingDetails' => $sellingDetails,
            'funnels' => $funnels,
            'domains' => $domains,
            'customDomains' => $customDomains,
            'transfers' => $transfers,
            'incentives' => $incentives,
            'tokenInfo' => $tokenInfo,
            'totalIncentives' => $totalIncentives,
            'stats' => $stats,
            'filters' => $request->only(['search', 'funnel_search', 'funnel_search_type'])
        ]);
    }

    /**
     * Show incentive invoice details (admin can view any invoice)
     */
    public function showInvoice($invoiceNumber)
    {
        $invoice = Invoice::where('invoice_number', $invoiceNumber)
            ->firstOrFail();

        $incentiveHistory = IncentiveHistory::with('user')
            ->where('incentive_id', $invoice->incentive_id)
            ->firstOrFail();
        
        return Inertia::render('Dashboard/InvoiceShow', [
            'invoice' => $invoice,
            'incentive' => $incentiveHistory
        ]);
    }

    /**
     * Get incentive history with pagination (all users)
     */
    public function getIncentives(Request $request)
    {
        $perPage = 10;
        
        $incentives = IncentiveHistory::with(['user', 'invoice'])
            ->orderBy('distributed_at', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->through(function ($incentive) {
                return [
                    'id' => $incentive->id,
                    'user_id' => $incentive->user_id,
                    'user_name' => $incentive->user->name ?? 'Unknown User',
                    'amount' => $incentive->amount,
                    'type' => $incentive->type,
                    'distributed_at' => $incentive->distributed_at,
                    'invoice_number' => $incentive->invoice->invoice_number ?? null,
                    'created_at' => $incentive->created_at
                ];
            });

        return response()->json([
            'incentives' => $incentives
        ]);
    }
}