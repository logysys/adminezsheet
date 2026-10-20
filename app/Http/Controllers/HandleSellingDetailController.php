<?php

namespace App\Http\Controllers;

use App\Models\HandleSellingDetail;
use App\Models\Invoice;
use App\Models\Userlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class HandleSellingDetailController extends Controller
{
    public function index(Request $request)
    {
        $sales = HandleSellingDetail::query()
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('created_at', 'desc')
            ->with([
                'invoice:id,handle_selling_detail_id,invoice_number,issue_date,amount',
                'customDomain:id,domain,domainselected',
                'domain:id,domain,domainselected',
                'user:id,name,email'
            ])
            ->paginate(10)
            ->through(function ($sale) {
                $domain = $sale->customDomain ?? $sale->domain;
                $type = $sale->customDomain ? 'custom' : ($sale->domain ? 'standard' : 'unknown');
                
                return [
                    'id' => $sale->id,
                    'amount' => $sale->amount,
                    'seller_amount' => $sale->seller_amount,
                    'commission' => $sale->commission,
                    'currency' => $sale->currency ?? 'USD',
                    'payment_method' => $sale->payment_method,
                    'status' => $sale->status,
                    'processed_at' => Carbon::parse($sale->created_at)->format('Y-m-d H:i:s'),
                    'transaction_id' => $sale->transaction_id,
                    'invoice' => $sale->invoice ? [
                        'number' => $sale->invoice->invoice_number,
                        'date' => Carbon::parse($sale->invoice->issue_date)->format('Y-m-d'),
                        'amount' => $sale->invoice->amount
                    ] : null,
                    'domain' => $domain ? [
                        'name' => $domain->domain,
                        'selected' => $domain->domainselected,
                        'type' => $type,
                        'url' => $type === 'custom'
                            ? "https://{$domain->domainselected}/{$domain->domain}"
                            : "https://{$domain->domain}.{$domain->domainselected}"
                    ] : null,
                    'user' => $sale->user ? [
                        'name' => $sale->user->name,
                        'email' => $sale->user->email
                    ] : null,
                ];
            });

        return Inertia::render('HandleSellingHistory/Index', [
            'sales' => $sales,
            'filters' => $request->only(['search', 'status'])
        ]);
    }
	
	public function showHandleSellInvoice($invoiceNumber)
	{

    $invoice = Invoice::where('invoice_number', $invoiceNumber)
        ->with(['handleSellingDetail.customDomain', 'handleSellingDetail.domain'])
        ->firstOrFail();

    // Get handle details
    $handle = null;
    if ($invoice->handleSellingDetail) {
        if ($invoice->handleSellingDetail->customDomain) {
            $handle = [
                'type' => 'custom',
                'name' => $invoice->handleSellingDetail->customDomain->domain,
                'domain' => $invoice->handleSellingDetail->customDomain->domainselected,
                'url' => "https://{$invoice->handleSellingDetail->customDomain->domainselected}/{$invoice->handleSellingDetail->customDomain->domain}"
            ];
        } elseif ($invoice->handleSellingDetail->domain) {
            $handle = [
                'type' => 'standard',
                'name' => $invoice->handleSellingDetail->domain->domain,
                'domain' => $invoice->handleSellingDetail->domain->domainselected,
                'url' => "https://{$invoice->handleSellingDetail->domain->domain}.{$invoice->handleSellingDetail->domain->domainselected}"
            ];
        }
    }

    // Prepare transaction details
    $transaction = [
        'id' => $invoice->handleSellingDetail->transaction_id ?? 'N/A',
        'amount' => $invoice->amount,
        'currency' => 'USD',
        'status' => $invoice->status,
        'payment_method' => 'Bee Points',
        'last4' => 'EZ$'
    ];
	$user = Userlist::where('id', $invoice->domainRefundRecord->user_id)
        ->first();
    return Inertia::render('HandleSellingHistory/Show', [
        'auth' => [
            'user' => $user ?? null
        ],
        'invoice' => [
            'invoice_number' => $invoice->invoice_number,
            'issue_date' => Carbon::parse($invoice->issue_date)->format('M d, Y'),
            'due_date' => Carbon::parse($invoice->due_date)->format('M d, Y'),
            'status' => $invoice->status,
            'amount' => number_format($invoice->amount, 2),
            'items' => $invoice->items,
            'notes' => $invoice->notes,
            'transaction' => $transaction,
            'handle' => $handle
        ]
    ]);
	}
	
}