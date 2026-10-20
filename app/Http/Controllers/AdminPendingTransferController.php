<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PendingDomainTransfer;
use App\Models\UserBalance;
use App\Models\HandleSellingDetail;
use App\Models\TokenTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminPendingTransferController extends Controller
{
    public function index(Request $request)
    {
        $transfers = PendingDomainTransfer::query()
            ->with(['buyer', 'seller', 'domain'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('buyer', function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%");
                })
                ->orWhereHas('seller', function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%");
                });
            })
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->through(function ($transfer) {
                $domainUrl = $transfer->domain_type === 'CUSTOM'
                    ? "https://{$transfer->domain->domainselected}/{$transfer->domain->domain}"
                    : "https://{$transfer->domain->domain}.{$transfer->domain->domainselected}";

                return [
                    'id' => $transfer->id,
                    'domain' => [
                        'id' => $transfer->domain_id,
                        'name' => $transfer->domain->domain,
                        'selected' => $transfer->domain->domainselected,
                        'type' => strtolower($transfer->domain_type),
                        'url' => $domainUrl,
                    ],
                    'amount' => $transfer->amount,
                    'seller_amount' => $transfer->seller_amount,
                    'commission' => $transfer->commission,
                    'status' => $transfer->status,
                    'expires_at' => Carbon::parse($transfer->expires_at)->format('Y-m-d H:i:s'),
                    'created_at' => Carbon::parse($transfer->created_at)->format('Y-m-d H:i:s'),
                    'buyer' => $transfer->buyer ? [
                        'id' => $transfer->buyer->id,
                        'email' => $transfer->buyer->email,
                    ] : null,
                    'seller' => $transfer->seller ? [
                        'id' => $transfer->seller->id,
                        'email' => $transfer->seller->email,
                    ] : null,
                    'can_force_complete' => $transfer->status === 'pending',
                ];
            });

        return Inertia::render('PendingTransfers/Index', [
            'transfers' => $transfers,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    public function forceComplete(Request $request, $id)
    {
        $transfer = PendingDomainTransfer::with(['buyer', 'seller', 'domain'])->findOrFail($id);

        if ($transfer->status !== 'pending') {
            return back()->with('error', 'Transfer has already been processed.');
        }

        // Similar logic to the seller accepting the transfer
        $transfer->status = 'completed';
        $transfer->confirmed_at = now();
        $transfer->save();
        
        // Transfer domain ownership to the buyer
        $domain = $transfer->domain_type === 'CUSTOM' 
            ? $transfer->domain
            : $transfer->domain;
        $domain->user_id = $transfer->buyer_id;
        $domain->save();

        // Credit seller's balance with the hold amount (90% of sale price)
        $sellerBalance = UserBalance::firstOrCreate(
            ['user_id' => $transfer->seller_id],
            ['bee_points_balance' => 0]
        );
        $sellerBalanceBefore = $sellerBalance->bee_points_balance;
        $sellerBalance->bee_points_balance += $transfer->seller_amount;
        $sellerBalance->save();

        // Record transaction for seller
        TokenTransaction::create([
            'user_id' => $transfer->seller_id,
            'amount' => $transfer->seller_amount,
            'transaction_type' => 'domain_sale',
            'description' => 'Admin forced completion of domain transfer ID: ' . $transfer->id,
            'balance_before' => $sellerBalanceBefore,
            'balance_after' => $sellerBalance->bee_points_balance,
            'domain_id' => $transfer->domain_type === 'DOMAIN' ? $transfer->domain_id : null,
            'custom_id' => $transfer->domain_type === 'CUSTOM' ? $transfer->domain_id : null,
        ]);
	
		$handleSellingDetail = HandleSellingDetail::create([
                    'user_id' => $transfer->seller_id,
                    ($transfer->domain_type === 'DOMAIN' ? 'domain_id' : 'customdomain_id') => $transfer->domain_id,
                    'amount' => $transfer->amount,
                    'seller_amount' => $transfer->seller_amount,
                    'commission' => $transfer->commission,
                    'payment_method' => 'bee',
                    'status' => 'completed',
                    'transaction_id' => 'SELL-' . strtoupper(Str::random(8))
                ]);
		$description = $transfer->domain_type === 'DOMAIN' 
                    ? "Domain Purchase: {$domain->domain}.{$domain->domainselected}"
                    : "Custom Handle Purchase: {$domain->domainselected}/{$domain->domain}";
		$invoice = $handleSellingDetail->invoice()->create([
					'invoice_number' => 'INV-SELL-' . strtoupper(Str::random(8)),
					'user_id' => $transfer->seller_id,
					'handle_selling_detail_id' => $handleSellingDetail->id,
					'issue_date' => now(),
					'due_date' => now()->addDays(30),
					'amount' => $handleSellingDetail->seller_amount,
					'status' => 'paid',
					'items' => [
						[
							'description' => $description,
							'quantity' => 1,
							'unit_price' => $handleSellingDetail->amount,
							'amount' => $handleSellingDetail->amount,
						],
						[
							'description' => "Service Commission (10%)",
							'quantity' => 1,
							'unit_price' => -$handleSellingDetail->commission, // Show as negative since it's deducted
							'amount' => -$handleSellingDetail->commission,
						]
					],
					'summary' => [
						'total_sale' => $handleSellingDetail->amount,
						'commission' => $handleSellingDetail->commission,
						'amount_received' => $handleSellingDetail->seller_amount
					],
					'notes' => 'Thank you for selling with us! Your payout of '.number_format($handleSellingDetail->seller_amount, 2).' has been processed (90% of total sale after 10% commission).',
				]);
        return back()->with('success', 'Transfer has been forcefully completed.');
    }
}