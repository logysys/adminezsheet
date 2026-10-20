<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\IncentiveHistory;
use App\Models\Invoice;
use App\Models\Userlist; // Added for admin user management
use Illuminate\Support\Facades\DB;

class IncentiveHistoryController extends Controller
{
    /**
     * Display the incentive history page.
     */
    public function index(Request $request)
    {
        // Get paginated incentive history for the user with invoice numbers
        $perPage = 10;
        $incentives = IncentiveHistory::with(['invoice', 'user'])
                        ->orderBy('distributed_at', 'desc')
                        ->orderBy('created_at', 'desc')
                        ->paginate($perPage, ['*']);

        // Transform the data to include invoice number and user details
        $incentives->getCollection()->transform(function ($incentive) {
            $incentive->invoice_number = $incentive->invoice->invoice_number ?? null;
            
            // Add user details for frontend
            if ($incentive->user) {
                $incentive->user->name = $incentive->user->name ?? 'N/A';
                $incentive->user->email = $incentive->user->email ?? 'N/A';
            } else {
                // Create a dummy user object if user doesn't exist
                $incentive->user = (object) [
                    'name' => 'N/A',
                    'email' => 'N/A'
                ];
            }
            
            return $incentive;
        });

        return Inertia::render('IncentiveHistory/Index', [
            'incentives' => $incentives,
            'filters' => $request->only(['search'])
        ]);
    }
    
	public function showInvoice($invoiceNumber)
    {
        $invoice = Invoice::where('invoice_number', $invoiceNumber)
        ->firstOrFail();

		// Find the related incentive history
		$incentiveHistory = IncentiveHistory::where('incentive_id', $invoice->incentive_id)
			->firstOrFail();
		
		return Inertia::render('IncentiveHistory/Show', [
            'invoice' => $invoice,
			'incentive' => $incentiveHistory
        ]);
    }
}