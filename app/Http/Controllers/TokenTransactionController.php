<?php

namespace App\Http\Controllers;

use App\Models\TokenTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class TokenTransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = TokenTransaction::query()
            ->when($request->search, function ($query, $search) {
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
            ->paginate(10)
            ->through(function ($transaction) {
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
        $totalBalance = TokenTransaction::query()
            ->when($request->search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->date_range, function ($query, $dateRange) {
                $dates = explode(' to ', $dateRange);
                $startDate = Carbon::parse($dates[0])->startOfDay();
                $endDate = Carbon::parse($dates[1] ?? $dates[0])->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->sum('amount');

        $positiveBalance = TokenTransaction::query()
            ->when($request->search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->date_range, function ($query, $dateRange) {
                $dates = explode(' to ', $dateRange);
                $startDate = Carbon::parse($dates[0])->startOfDay();
                $endDate = Carbon::parse($dates[1] ?? $dates[0])->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->where('amount', '>', 0)
            ->sum('amount');

        $negativeBalance = abs(TokenTransaction::query()
            ->when($request->search, function ($query, $search) {
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->when($request->date_range, function ($query, $dateRange) {
                $dates = explode(' to ', $dateRange);
                $startDate = Carbon::parse($dates[0])->startOfDay();
                $endDate = Carbon::parse($dates[1] ?? $dates[0])->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            })
            ->where('amount', '<', 0)
            ->sum('amount'));

        return Inertia::render('TokenTransactions/Index', [
            'transactions' => $transactions,
            'summary' => [
                'total_balance' => $totalBalance,
                'positive_balance' => $positiveBalance,
                'negative_balance' => $negativeBalance,
            ],
            'filters' => $request->only(['search', 'transaction_type', 'date_range'])
        ]);
    }
	
}