<?php

namespace App\Http\Controllers;

use App\Models\HandlePurchase;
use App\Models\Customdomain;
use App\Models\Domain;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class HandlePurchaseController extends Controller
{
    public function index(Request $request)
{
    $purchases = HandlePurchase::query()
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
            'invoice:id,handle_purchase_id,invoice_number,issue_date,amount',
            'Customdomain:id,domain,domainselected',
            'domain:id,domain,domainselected',
            'user:id,name,email' // Make sure this matches your relationship
        ])
        ->paginate(10)
        ->through(function ($purchase) {
            $domain = $purchase->Customdomain ?? $purchase->domain;
            $type = $purchase->Customdomain ? 'custom' : ($purchase->domain ? 'standard' : 'unknown');
            
            return [
                'id' => $purchase->id,
                'bee_points_amount' => $purchase->bee_points_amount,
                'amount' => $purchase->amount,
                'currency' => $purchase->currency,
                'payment_method' => $purchase->payment_method,
                'status' => $purchase->status,
                'processed_at' => Carbon::parse($purchase->created_at)->format('Y-m-d H:i:s'),
                'transaction_id' => $purchase->transaction_id,
                'invoice' => $purchase->invoice ? [
                    'number' => $purchase->invoice->invoice_number,
                    'date' => Carbon::parse($purchase->invoice->issue_date)->format('Y-m-d'),
                    'amount' => $purchase->invoice->amount
                ] : null,
                'domain' => $domain ? [
                    'name' => $domain->domain,
                    'selected' => $domain->domainselected,
                    'type' => $type,
                    'url' => $type === 'custom'
                        ? "https://{$domain->domainselected}/{$domain->domain}"
                        : "https://{$domain->domain}.{$domain->domainselected}"
                ] : null,
                'user' => $purchase->user ? [
                    'name' => $purchase->user->name,
                    'email' => $purchase->user->email
                ] : null,
            ];
        });
        
    return Inertia::render('HandlePurchases/Index', [
        'purchases' => $purchases,
        'filters' => $request->only(['search', 'status'])
    ]);
}

}