<?php

namespace App\Http\Controllers;

use App\Models\DomainRefundRecord;
use App\Models\Invoice;
use App\Models\Userlist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminRefundTransferController extends Controller
{
    public function index(Request $request)
    {
        $transfersQuery = DomainRefundRecord::with([
            'buyer', 
            'seller', 
            'domain', 
            'customDomain',
            'invoices' => function($query) {
                $query->select('id', 'invoice_number', 'domain_refund_id', 'issue_date', 'amount')
                      ->orderBy('created_at', 'desc');
            }
        ])
        ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->has('search')) {
            $transfersQuery->where(function($query) use ($request) {
                $query->whereHas('buyer', function($q) use ($request) {
                    $q->where('email', 'like', '%'.$request->search.'%');
                })
                ->orWhereHas('seller', function($q) use ($request) {
                    $q->where('email', 'like', '%'.$request->search.'%');
                })
                ->orWhereHas('invoices', function($q) use ($request) {
                    $q->where('invoice_number', 'like', '%'.$request->search.'%');
                });
            });
        }

        $paginatedTransfers = $transfersQuery->paginate(10)->through(function ($transfer) {
            $domainType = $transfer->domain_id ? 'DOMAIN' : 'CUSTOM';
            $domain = $transfer->domain ?? $transfer->customDomain;
            
            $domainUrl = $domainType === 'CUSTOM'
                ? "https://{$domain->domainselected}/{$domain->domain}"
                : "https://{$domain->domain}.{$domain->domainselected}";

            // Get all invoices for this transfer
            $invoices = $transfer->invoices->map(function ($invoice) {
                return [
                    'number' => $invoice->invoice_number,
                    'date' => Carbon::parse($invoice->issue_date)->format('Y-m-d'),
                    'amount' => $invoice->amount,
                    'type' => str_contains($invoice->invoice_number, 'INV-RFND') ? 'refund' : 
                              (str_contains($invoice->invoice_number, 'INV-PNLT') ? 'penalty' : 'unknown')
                ];
            });

            return [
                'id' => $transfer->id,
                'domain' => [
                    'id' => $domain->id,
                    'name' => $domain->domain,
                    'selected' => $domain->domainselected,
                    'type' => strtolower($domainType),
                    'url' => $domainUrl,
                ],
                'original_amount' => $transfer->original_amount,
                'buyer_payment_hold' => $transfer->buyer_payment_hold,
                'sell_service_commission' => $transfer->sell_service_commission,
                'reject_service_commission' => $transfer->reject_service_commission,
                'reject_buyer_commission' => $transfer->reject_buyer_commission,
                'total_penalty' => $transfer->total_penalty,
                'refund_amount' => $transfer->refund_amount,
                'status' => 'refunded',
                'processed_at' => Carbon::parse($transfer->created_at)->format('Y-m-d H:i:s'),
                'created_at' => Carbon::parse($transfer->created_at)->format('Y-m-d H:i:s'),
                'buyer' => $transfer->buyer ? [
                    'id' => $transfer->buyer->id,
                    'email' => $transfer->buyer->email,
                ] : null,
                'seller' => $transfer->seller ? [
                    'id' => $transfer->seller->id,
                    'email' => $transfer->seller->email,
                ] : null,
                'invoices' => $invoices,
            ];
        });

        if ($request->wantsJson()) {
            return response()->json($paginatedTransfers);
        }

        return Inertia::render('RefundTransfers/Index', [
            'transfers' => $paginatedTransfers,
            'filters' => $request->only(['search'])
        ]);
    }
	
	public function showRefundInvoiceseller($invoiceNumber)
{
    $invoice = Invoice::where('invoice_number', $invoiceNumber)->firstOrFail();

    // Manually load relationships if they don't load automatically
    if ($invoice->domain_refund_id) {
        $refundRecord = DomainRefundRecord::with(['buyer', 'seller', 'domain', 'customDomain'])
                            ->find($invoice->domain_refund_id);
        
        // Manually set the relationship
        $invoice->setRelation('domainRefundRecord', $refundRecord);
    }

    // Get domain details
    $domain = null;
    if ($invoice->domainRefundRecord->domain) {
        $domain = [
            'type' => 'standard',
            'name' => $invoice->domainRefundRecord->domain->domain,
            'domain' => $invoice->domainRefundRecord->domain->domainselected,
            'url' => "https://{$invoice->domainRefundRecord->domain->domain}.{$invoice->domainRefundRecord->domain->domainselected}"
        ];
    } elseif ($invoice->domainRefundRecord->customDomain) {
        $domain = [
            'type' => 'custom',
            'name' => $invoice->domainRefundRecord->customDomain->domain,
            'domain' => $invoice->domainRefundRecord->customDomain->domainselected,
            'url' => "https://{$invoice->domainRefundRecord->customDomain->domainselected}/{$invoice->domainRefundRecord->customDomain->domain}"
        ];
    }

    // Prepare transaction details
    $transaction = [
        'id' => $invoice->domainRefundRecord->original_transaction_id ?? 'N/A',
		'refund_reference' => $invoice->domainRefundRecord->refund_reference ?? null,
        'amount' => $invoice->domainRefundRecord->original_amount,
        'currency' => 'USD',
        'status' => $invoice->domainRefundRecord->status,
        'payment_method' => $invoice->domainRefundRecord->payment_method,
        'last4' => 'EZ$'
    ];

    // Prepare invoice items from the items array stored in the invoice
    $items = $invoice->items;
    // Prepare summary data
    $summary = [
        'original_sale_price' => $invoice->domainRefundRecord->original_amount,
        'buyer_payment_hold' => $invoice->domainRefundRecord->buyer_payment_hold,
        'sale_commission' => $invoice->domainRefundRecord->sell_service_commission,
        'buyer_compensation' => $invoice->domainRefundRecord->reject_buyer_commission,
        'rejection_fee' => $invoice->domainRefundRecord->reject_service_commission,
        'net_effect' => -$invoice->domainRefundRecord->total_penalty
    ];
	$user = Userlist::where('id', $invoice->domainRefundRecord->seller_id)
        ->first();
    return Inertia::render('RefundTransfers/Show', [
        'auth' => [
            'user' => $user ?? null
        ],
        'invoice' => [
            'invoice_number' => $invoice->invoice_number,
            'issue_date' => Carbon::parse($invoice->issue_date)->format('M d, Y'),
            'due_date' => Carbon::parse($invoice->due_date)->format('M d, Y'),
            'status' => $invoice->status,
            'amount' => number_format($invoice->amount, 2),
            'items' => $items,
            'summary' => $summary,
            'notes' => $invoice->notes ?? null,
            'transaction' => $transaction,
            'handle' => $domain,
            'is_seller' => true
        ]
    ]);
}

public function showRefundInvoicebuyer($invoiceNumber)
{
    $invoice = Invoice::where('invoice_number', $invoiceNumber)->firstOrFail();

    // Manually load relationships if they don't load automatically
    if ($invoice->domain_refund_id) {
        $refundRecord = DomainRefundRecord::with(['buyer', 'seller', 'domain', 'customDomain'])
                            ->find($invoice->domain_refund_id);
        
        // Manually set the relationship
        $invoice->setRelation('domainRefundRecord', $refundRecord);
    }

    // Get domain details
    $domain = null;
    if ($invoice->domainRefundRecord->domain) {
        $domain = [
            'type' => 'standard',
            'name' => $invoice->domainRefundRecord->domain->domain,
            'domain' => $invoice->domainRefundRecord->domain->domainselected,
            'url' => "https://{$invoice->domainRefundRecord->domain->domain}.{$invoice->domainRefundRecord->domain->domainselected}"
        ];
    } elseif ($invoice->domainRefundRecord->customDomain) {
        $domain = [
            'type' => 'custom',
            'name' => $invoice->domainRefundRecord->customDomain->domain,
            'domain' => $invoice->domainRefundRecord->customDomain->domainselected,
            'url' => "https://{$invoice->domainRefundRecord->customDomain->domainselected}/{$invoice->domainRefundRecord->customDomain->domain}"
        ];
    }

    // Prepare transaction details
    $transaction = [
        'id' => $invoice->domainRefundRecord->original_transaction_id ?? 'N/A',
		'refund_reference' => $invoice->domainRefundRecord->refund_reference ?? null,
        'amount' => $invoice->domainRefundRecord->original_amount,
        'currency' => 'USD',
        'status' => $invoice->domainRefundRecord->status,
        'payment_method' => $invoice->domainRefundRecord->payment_method,
        'last4' => 'EZ$'
    ];

    // Prepare summary data specific to buyer's view
    $summary = [
        'subtotal' => $invoice->domainRefundRecord->original_amount,
		'Commission' => $invoice->domainRefundRecord->sell_service_commission,
        'compensation' => $invoice->domainRefundRecord->reject_buyer_commission,
        'total_refund' => $invoice->domainRefundRecord->refund_amount
    ];
	$user = Userlist::where('id', $invoice->domainRefundRecord->user_id)
        ->first();
    return Inertia::render('RefundTransfers/Show', [
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
            'summary' => $summary,
            'notes' => $invoice->notes ?? null,
            'transaction' => $transaction,
            'handle' => $domain,
            'is_seller' => false // This is a buyer's invoice
        ]
    ]);
}

}