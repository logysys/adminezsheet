<?php

namespace App\Http\Controllers;

use App\Models\PointPurchase;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PointPurchaseController extends Controller
{
    public function index(Request $request)
    {
        $purchases = PointPurchase::query()
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->orderBy('processed_at', 'desc')
            ->with([
                'invoice' => function($query) {
                    $query->select('id', 'point_purchase_id', 'invoice_number');
                },
                'user' => function($query) {
                    $query->select('id', 'name', 'email');
                }
            ])
            ->paginate(10)
            ->through(function ($purchase) {
                return [
                    'id' => $purchase->id,
                    'bee_points_amount' => $purchase->bee_points_amount,
                    'fiat_amount' => $purchase->fiat_amount,
                    'price_per_point' => $purchase->price_per_point,
                    'payment_method' => $purchase->payment_method,
                    'status' => $purchase->status,
                    'processed_at' => $purchase->processed_at,
                    'transaction_hash' => $purchase->transaction_hash,
                    'invoice_number' => $purchase->invoice->invoice_number ?? null,
                    'user' => $purchase->user ? [
                        'name' => $purchase->user->name,
                        'email' => $purchase->user->email
                    ] : null,
                ];
            });
            
        return Inertia::render('PointPurchases/Index', [
            'purchases' => $purchases,
            'filters' => $request->only(['search', 'status'])
        ]);
    }
	
	public function show(string $invoiceNumber): Response
{
    $invoice = Invoice::with([
        'user' => function($query) {
            $query->select('id', 'name', 'email');
        },
        'pointPurchase' => function($query) {
            $query->select('id', 'bee_points_amount', 'fiat_amount', 'price_per_point', 'payment_method');
        },
        'stripeTransaction' => function($query) {
            $query->select('id', 'amount', 'currency', 'status', 'payment_method_details', 'customer_details');
        }
    ])->where('invoice_number', $invoiceNumber)->firstOrFail();

    return Inertia::render('Invoices/Showpoint', [
        'invoice' => [
            'invoice_number' => $invoice->invoice_number,
            'issue_date' => $invoice->issue_date,
            'due_date' => $invoice->due_date,
            'amount' => $invoice->amount,
            'status' => $invoice->status,
            'items' => $invoice->items,
            'notes' => $invoice->notes,
            'user' => $invoice->user,
            'point_purchase' => $invoice->pointPurchase, // Make sure this matches the JS side
            'stripe_transaction' => $invoice->stripeTransaction,
            'created_at' => $invoice->created_at,
        ]
    ]);
}
}