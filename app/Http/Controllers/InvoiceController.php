<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\HandlePurchase;
use Inertia\Inertia;
use Carbon\Carbon;

class InvoiceController extends Controller
{
    public function show($invoiceNumber)
{
    $invoice = Invoice::where('invoice_number', $invoiceNumber)
        ->with(['handlePurchase.customDomain', 'handlePurchase.domain', 'stripeTransaction', 'user'])
        ->firstOrFail();

    // Get handle details
    $handle = null;
    if ($invoice->handlePurchase) {
        if ($invoice->handlePurchase->customDomain) {
            $handle = [
                'type' => 'custom',
                'name' => $invoice->handlePurchase->customDomain->domain,
                'domain' => $invoice->handlePurchase->customDomain->domainselected,
                'url' => "https://{$invoice->handlePurchase->customDomain->domainselected}/{$invoice->handlePurchase->customDomain->domain}"
            ];
        } elseif ($invoice->handlePurchase->domain) {
            $handle = [
                'type' => 'standard',
                'name' => $invoice->handlePurchase->domain->domain,
                'domain' => $invoice->handlePurchase->domain->domainselected,
                'url' => "https://{$invoice->handlePurchase->domain->domain}.{$invoice->handlePurchase->domain->domainselected}"
            ];
        }
    }

    // Prepare transaction details
    $transaction = [
        'id' => null,
        'amount' => $invoice->amount,
        'currency' => 'USD',
        'status' => $invoice->status,
        'payment_method' => 'N/A',
        'last4' => '****'
    ];

    if ($invoice->stripeTransaction) {
        $transaction = [
            'id' => $invoice->stripeTransaction->stripe_payment_id,
            'amount' => number_format($invoice->stripeTransaction->amount, 2),
            'currency' => strtoupper($invoice->stripeTransaction->currency),
            'status' => $invoice->stripeTransaction->status,
            'payment_method' => $invoice->stripeTransaction->payment_method_details['card']['brand'] ?? 'N/A',
            'last4' => $invoice->stripeTransaction->payment_method_details['card']['last4'] ?? '****',
        ];
    } elseif ($invoice->handlePurchase && $invoice->handlePurchase->payment_method === 'bee') {
        $transaction = [
            'id' => $invoice->handlePurchase->transaction_id,
            'amount' => number_format($invoice->handlePurchase->amount, 2),
            'currency' => $invoice->handlePurchase->currency,
            'status' => $invoice->handlePurchase->status,
            'payment_method' => 'Bee Points',
            'last4' => 'EZ$'
        ];
    }
    
    return Inertia::render('Invoices/Show', [
        'invoice' => [
            'number' => $invoice->invoice_number, // changed from invoice_number to number
            'issue_date' => Carbon::parse($invoice->issue_date)->format('M d, Y'),
            'due_date' => Carbon::parse($invoice->due_date)->format('M d, Y'),
            'status' => $invoice->status,
            'amount' => number_format($invoice->amount, 2),
            'items' => $invoice->items,
            'notes' => $invoice->notes,
            'transaction' => $transaction,
            'handle' => $handle,
            'user' => [ // added user data
                'name' => $invoice->user->name ?? 'N/A',
                'email' => $invoice->user->email ?? 'N/A'
            ],
            'purchase' => [ // restructured to match frontend
                'payment_method' => $invoice->handlePurchase->payment_method ?? null,
                'amount' => $invoice->handlePurchase->amount ?? null,
                'currency' => $invoice->handlePurchase->currency ?? 'USD',
                'bee_points_amount' => $invoice->handlePurchase->bee_points_amount ?? null,
                'domain' => $handle // moved handle under purchase.domain
            ]
        ]
    ]);
}
}