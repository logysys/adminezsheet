<?php

namespace App\Http\Controllers;

use App\Models\TokenInfo;
use App\Models\ReserveTransaction;
use App\Models\TokenTransaction;
use App\Models\HandlePurchase;
use App\Models\UserBalance;
use App\Models\Customdomain;
use App\Models\Domain;
use App\Models\Userlist;
use App\Models\Invoice;
use App\Models\PendingReserveTransfer;
use App\Models\EmailDesign;
use App\Models\PointPurchase;
use App\Models\HandleSellingDetail;
use App\Models\PendingDomainTransfer;
use App\Models\DomainRefundRecord;
use App\Models\IncentiveHistory;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\Eznew;
use Carbon\Carbon;

class ReserveManagementController extends Controller
{
    public function dashboard(Request $request)
    {
        $tokenInfo = TokenInfo::first();
        
        // Ensure we always have an array, even if no transactions exist
        $recentTransactions = ReserveTransaction::with(['admin', 'user', 'invoice'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get() ?? [];
		$add_reserve = ReserveTransaction::where('transaction_type', 'reserve')->sum('amount');
        $reduce_reserve = ReserveTransaction::where('transaction_type', 'release')->sum('amount');
        $reserve_balance = ReserveTransaction::where('transaction_type', 'transfer_to_user')->sum('amount');
        // Get users for the transfer dropdown
        $users = Userlist::select('id', 'name', 'email')
            ->orderBy('name')
            ->get();
            
        $purchases = HandlePurchase::query()
            ->when($request->purchases_search, function ($query, $search) {
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
            ->paginate(10, ['*'], 'purchases_page');
			$purchases = $purchases->through(function ($purchase) {
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

        $beepurchases = PointPurchase::query()
            ->when($request->beepurchases_search, function ($query, $search) {
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
            ->paginate(10, ['*'], 'beepurchases_page');

        $beepurchases = $beepurchases->through(function ($purchase) {
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
		
        $transactions = TokenTransaction::query()
            ->when($request->transactions_search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->transaction_type, function ($query, $type) {
                $query->where('transaction_type', $type);
            })
            ->when($request->date_range, function ($query, $dateRange) {
                $dates = explode(' to ', $dateRange);
                $startDate = Carbon::parse($dates[0])->startOfDay();
                $endDate = Carbon::parse($dates[1] ?? $dates[0])->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->orderBy('created_at', 'desc')
            ->with(['user:id,name,email'])
            ->paginate(10, ['*'], 'transactions_page');

        $transactions = $transactions->through(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'amount' => $transaction->amount,
                    'transaction_type' => $transaction->transaction_type,
                    'reference_id' => $transaction->reference_id,
                    'custom_id' => $transaction->custom_id,
                    'domain_id' => $transaction->domain_id,
                    'balance_before' => $transaction->balance_before,
                    'balance_after' => $transaction->balance_after,
                    'created_at' => Carbon::parse($transaction->created_at)->format('Y-m-d H:i:s'),
                    'user' => $transaction->user ? [
                        'name' => $transaction->user->name,
                        'email' => $transaction->user->email
                    ] : null,
                ];
            });

        // Summary calculations
        $totalBalance = TokenTransaction::sum('amount');
        $positiveBalance = TokenTransaction::where('amount', '>', 0)->sum('amount');
        $negativeBalance = abs(TokenTransaction::where('amount', '<', 0)->sum('amount'));

        $sales = HandleSellingDetail::query()
            ->when($request->sales_status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->sales_search, function ($query, $search) {
                $query->where(function($q) use ($search) {
                    $q->whereHas('buyer', function ($subq) use ($search) {
                        $subq->where('email', 'like', "%{$search}%");
                    })->orWhereHas('seller', function ($subq) use ($search) {
                        $subq->where('email', 'like', "%{$search}%");
                    });
                });
            })
            ->orderBy('created_at', 'desc')
            ->with([
                'invoice:id,handle_selling_detail_id,invoice_number,issue_date,amount',
                'customDomain:id,domain,domainselected',
                'domain:id,domain,domainselected',
                'user:id,name,email'
            ])
            ->paginate(10);

        $sales->getCollection()->transform(function ($sale) {
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

        $transfers = PendingDomainTransfer::query()
            ->with(['buyer', 'seller', 'domain'])
            ->when($request->pending_transfers_search, function ($query, $search) {
                $query->whereHas('buyer', function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%");
                })
                ->orWhereHas('seller', function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%");
                });
            })
            ->when($request->transfers_status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'transfers_page');

        $transfers->getCollection()->transform(function ($transfer) {
            $domainUrl = $transfer->domain_type === 'CUSTOM'
                ? "https://{$transfer->domain->domainselected}/{$transfer->domain->domain}"
                : "https://{$transfer->domain->domain}.{$transfer->domain->domainselected}";

            return [
                'id' => $transfer->id,
                'domain' => [
                    'id' => $transfer->domain_id,
                    'url' => $domainUrl,
                    'type' => strtolower($transfer->domain_type),
                ],
                'amount' => $transfer->amount,
                'seller_amount' => $transfer->seller_amount,
                'commission' => $transfer->commission,
                'status' => $transfer->status,
                'expires_at' => Carbon::parse($transfer->expires_at)->format('Y-m-d H:i:s'),
                'created_at' => Carbon::parse($transfer->created_at)->format('Y-m-d H:i:s'),
                'buyer' => $transfer->buyer ? ['email' => $transfer->buyer->email] : null,
                'seller' => $transfer->seller ? ['email' => $transfer->seller->email] : null,
                'can_force_complete' => $transfer->status === 'pending',
            ];
        });

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

        if ($request->has('refund_transfers_search')) {
            $search = $request->refund_transfers_search;
            $transfersQuery->where(function($query) use ($search) {
                $query->whereHas('buyer', function($q) use ($search) {
                    $q->where('email', 'like', '%'.$search.'%');
                })
                ->orWhereHas('seller', function($q) use ($search) {
                    $q->where('email', 'like', '%'.$search.'%');
                })
                ->orWhereHas('invoices', function($q) use ($search) {
                    $q->where('invoice_number', 'like', '%'.$search.'%');
                });
            });
        }

        $paginatedTransfers = $transfersQuery->paginate(10, ['*'], 'refundtransfers_page');
        $paginatedTransfers = $paginatedTransfers->through(function ($transfer) {
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


        $perPage = 10;
        $incentives = IncentiveHistory::with(['invoice', 'user'])
                        ->orderBy('distributed_at', 'desc')
                        ->orderBy('created_at', 'desc')
                        ->paginate($perPage, ['*'], 'incentives_page');

        $incentives->getCollection()->transform(function ($incentive) {
            $incentive->invoice_number = $incentive->invoice->invoice_number ?? null;
            if ($incentive->user) {
                $incentive->user->name = $incentive->user->name ?? 'N/A';
                $incentive->user->email = $incentive->user->email ?? 'N/A';
            } else {
                $incentive->user = (object) [
                    'name' => 'N/A',
                    'email' => 'N/A'
                ];
            }
            return $incentive;
        });

        // Add invoices query
        $invoices = Invoice::with([
                'user:id,name,email',
                'pointPurchase',
                'handlePurchase',
                'reserveTransaction',
                'handleSellingDetail',
                'domainRefundRecord'
            ])
            ->when($request->invoices_search, function ($query, $search) {
                $query->where('invoice_number', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                      });
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'invoices_page');

        $invoices->getCollection()->transform(function ($invoice) {
            $type = 'other';
            $relatedModel = null;
            
            if ($invoice->pointPurchase) {
                $type = 'point_purchase';
                $relatedModel = $invoice->pointPurchase;
            } elseif ($invoice->handlePurchase) {
                $type = 'handle_purchase';
                $relatedModel = $invoice->handlePurchase;
            } elseif ($invoice->reserveTransaction) {
                $type = 'reserve_transaction';
                $relatedModel = $invoice->reserveTransaction;
            } elseif ($invoice->handleSellingDetail) {
                $type = 'handle_sale';
                $relatedModel = $invoice->handleSellingDetail;
            } elseif ($invoice->domainRefundRecord) {
                $type = 'domain_refund';
                $relatedModel = $invoice->domainRefundRecord;
            }

            return [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'amount' => $invoice->amount,
                'status' => $invoice->status,
                'issue_date' => $invoice->issue_date,
                'due_date' => $invoice->due_date,
                'type' => $type,
                'user' => $invoice->user ? [
                    'name' => $invoice->user->name,
                    'email' => $invoice->user->email
                ] : null,
                'related_model' => $relatedModel,
                'created_at' => $invoice->created_at
            ];
        });

        return Inertia::render('Reserve/Dashboard', [
            'tokenInfo' => $tokenInfo,
            'recentTransactions' => $recentTransactions,
            'purchases' => $purchases,
            'beepurchases' => $beepurchases,
            'users' => $users,
            'transactions' => $transactions,
            'sales' => $sales,
            'transfers' => $transfers,
            'refundtransfers' => $paginatedTransfers,
            'incentives' => $incentives,
            'invoices' => $invoices,
            'summary' => [
                'total_balance' => $totalBalance,
                'positive_balance' => $positiveBalance,
                'negative_balance' => $negativeBalance,
                'add_reserve' => $add_reserve,
                'reduce_reserve' => $reduce_reserve,
                'reserve_balance' => $reserve_balance,
            ],
            'filters' => $request->only([
                'purchases_search', 
                'beepurchases_search', 
                'transactions_search', 'transaction_type', 'date_range',
                'sales_search', 'sales_status',
                'pending_transfers_search', 'transfers_status',
                'refund_transfers_search',
                'invoices_search'
            ])
        ]);
    }

    public function reservePoints(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.00000001',
            'reason' => 'nullable|string|max:500'
        ]);

        DB::transaction(function () use ($request) {
            $tokenInfo = TokenInfo::first();
            
            if ($tokenInfo->circulating_supply < $request->amount) {
                throw new \Exception('Insufficient circulating supply');
            }

            $tokenInfo->circulating_supply -= $request->amount;
            $tokenInfo->reserved_supply += $request->amount;
            $tokenInfo->last_updated = now();
            $tokenInfo->save();

            $transaction = ReserveTransaction::create([
                'transaction_type' => 'reserve',
                'amount' => $request->amount,
                'reason' => $request->reason,
                'reference_id' => 'RES-' . Str::upper(Str::random(8)),
                'admin_id' => auth()->id()
            ]);

            // Generate invoice
            InvoiceService::createForReserveTransaction($transaction);
        });

        return redirect()->back()->with('success', 'Points reserved successfully');
    }

    public function releasePoints(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.00000001',
            'reason' => 'nullable|string|max:500'
        ]);

        DB::transaction(function () use ($request) {
            $tokenInfo = TokenInfo::first();
            
            if ($tokenInfo->reserved_supply < $request->amount) {
                throw new \Exception('Insufficient reserved supply');
            }

            $tokenInfo->circulating_supply += $request->amount;
            $tokenInfo->reserved_supply -= $request->amount;
            $tokenInfo->last_updated = now();
            $tokenInfo->save();

            $transaction = ReserveTransaction::create([
                'transaction_type' => 'release',
                'amount' => $request->amount,
                'reason' => $request->reason,
                'reference_id' => 'REL-' . Str::upper(Str::random(8)),
                'admin_id' => auth()->id()
            ]);

            // Generate invoice
            InvoiceService::createForReserveTransaction($transaction);
        });

        return redirect()->back()->with('success', 'Points released successfully');
    }

    public function transferFromReserve(Request $request)
    {
        $request->validate([
            'email' => 'required|email', // Changed from user_id to email
            'amount' => 'required|numeric|min:0.00000001',
            'reason' => 'nullable|string|max:500'
        ]);

        DB::transaction(function () use ($request) {
            $tokenInfo = TokenInfo::first();
            
            if ($tokenInfo->reserved_supply < $request->amount) {
                throw new \Exception('Insufficient reserved supply');
            }

            $tokenInfo->reserved_supply -= $request->amount;
            $tokenInfo->last_updated = now();
            $tokenInfo->save();

            // Check if user exists
            $user = Userlist::where('email', $request->email)->first();
            $userId = $user ? $user->id : null;
            
            $invoiceNumber = 'TRF-RES-' . Str::upper(Str::random(8)) . '-' . now()->format('YmdHis');

            $transaction = ReserveTransaction::create([
                'transaction_type' => 'transfer_to_user',
                'amount' => $request->amount,
                'reason' => $request->reason,
                'reference_id' => $invoiceNumber,
                'admin_id' => auth()->id(),
                'user_id' => $userId,
                'recipient_email' => $request->email // Store the email for future reference
            ]);

            // If user exists, credit their balance immediately
            if ($user) {
                $userBalance = UserBalance::firstOrNew(['user_id' => $userId]);
                $balanceBefore = $userBalance->bee_points_balance ?? 0;
                $userBalance->bee_points_balance += $request->amount;
                $userBalance->last_updated = now();
                $userBalance->save();

                TokenTransaction::create([
                    'user_id' => $userId,
                    'amount' => $request->amount,
                    'transaction_type' => 'reserve_transfer',
                    'reference_id' => $invoiceNumber,
                    'balance_before' => $balanceBefore,
                    'balance_after' => $userBalance->bee_points_balance
                ]);
            }
            // If user doesn't exist, we'll create a pending transfer record
            else {
                PendingReserveTransfer::create([
                    'email' => $request->email,
                    'amount' => $request->amount,
                    'reserve_transaction_id' => $transaction->id,
                    'reference_id' => $invoiceNumber
                ]);
            }

            $emaildesign = EmailDesign::where('id', 18)->first();
            $str = ['{amount}','{email}','{reference_id}','{register_link}','{login_link}'];
            $rplc =[$request->amount,$request->email,$invoiceNumber,'https://ez.wiki/register','https://ez.wiki/login'];
            $div=str_replace($str,$rplc,$emaildesign['design']);
            $mailData = [
                                'design' => $div
                            ];
            try{
                $subject = "Ez.wifi Claim Your EZ$ Reward!";
               Mail::to(strtolower($request->email))->send(new Eznew($mailData, $subject));
            }catch (\Exception $e){
                    $subject = "Ez.wifi Claim Your EZ$ Reward!";
                    
                    mail(strtolower($request->email), $subject, $div, null,'funnel@ez.wifi');
            }
            // Generate invoice
            InvoiceService::createForReserveTransaction($transaction);
        });

        return redirect()->back()->with('success', 'Points transferred successfully. If the user is not registered, they will receive the points upon registration.');
    }

    public function transactionHistory(Request $request)
    {
        $query = ReserveTransaction::with(['admin', 'user', 'invoice'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('transaction_type', 'like', "%{$search}%")
                  ->orWhere('reference_id', 'like', "%{$search}%")
                  ->orWhere('reason', 'like', "%{$search}%")
                  ->orWhereHas('admin', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('user', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  })
                  ->orWhereHas('invoice', function($q) use ($search) {
                      $q->where('invoice_number', 'like', "%{$search}%");
                  });
            });
        }

        $transactions = $query->paginate(20);

        return Inertia::render('Reserve/History', [
            'transactions' => $transactions,
            'filters' => $request->only(['search'])
        ]);
    }
    
    public function show($id)
    {
        $invoice = Invoice::with([
            'reserveTransaction.admin',
            'reserveTransaction.user'
        ])->findOrFail($id);

        return Inertia::render('Reserve/Invoice', [
            'invoice' => $invoice
        ]);
    }
    
	public function showinvoice($invoiceNumber)
    {
        $invoice = Invoice::with([
            'user:id,name,email',
            'pointPurchase',
            'handlePurchase',
            'reserveTransaction.admin',
            'handleSellingDetail',
            'domainRefundRecord'
        ])->where('invoice_number', $invoiceNumber)->firstOrFail();

        // Determine the invoice type and related data
        $invoiceType = 'other';
        $relatedData = null;
        
        if ($invoice->pointPurchase) {
            $invoiceType = 'point_purchase';
            $relatedData = $invoice->pointPurchase;
        } elseif ($invoice->handlePurchase) {
            $invoiceType = 'handle_purchase';
            $relatedData = $invoice->handlePurchase;
        } elseif ($invoice->reserveTransaction) {
            $invoiceType = 'reserve_transaction';
            $relatedData = $invoice->reserveTransaction;
        } elseif ($invoice->handleSellingDetail) {
            $invoiceType = 'handle_sale';
            $relatedData = $invoice->handleSellingDetail;
        } elseif ($invoice->domainRefundRecord) {
            $invoiceType = 'domain_refund';
            $relatedData = $invoice->domainRefundRecord;
        }

        return Inertia::render('Reserve/Showinvoice', [
            'invoice' => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'amount' => $invoice->amount,
                'status' => $invoice->status,
                'issue_date' => $invoice->issue_date,
                'due_date' => $invoice->due_date,
                'type' => $invoiceType,
                'user' => $invoice->user ? [
                    'name' => $invoice->user->name,
                    'email' => $invoice->user->email
                ] : null,
                'related_data' => $relatedData,
                'created_at' => $invoice->created_at,
                'updated_at' => $invoice->updated_at,
            ]
        ]);
    }
}