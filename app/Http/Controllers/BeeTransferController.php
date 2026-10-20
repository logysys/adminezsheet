<?php

namespace App\Http\Controllers;

use App\Models\BeeTransfer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BeeTransferController extends Controller
{
    public function index(Request $request)
    {
        $transfers = BeeTransfer::query()
            ->when($request->status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->whereHas('sender', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    })->orWhereHas('receiver', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
                });
            })
            ->orderBy('created_at', 'desc')
            ->with([
                'sender' => function($query) {
                    $query->select('id', 'name', 'email');
                },
                'receiver' => function($query) {
                    $query->select('id', 'name', 'email');
                }
            ])
            ->paginate(10)
            ->through(fn ($transfer) => $this->formatTransfer($transfer));
            
        return Inertia::render('BeeTransfers/Index', [
            'transfers' => $transfers,
            'filters' => $request->only(['search', 'status'])
        ]);
    }
    
    public function show(string $transactionHash): Response
    {
        $transfer = BeeTransfer::with([
            'sender' => function($query) {
                $query->select('id', 'name', 'email');
            },
            'receiver' => function($query) {
                $query->select('id', 'name', 'email');
            }
        ])->where('transaction_hash', $transactionHash)->firstOrFail();

        return Inertia::render('BeeTransfers/Show', [
            'transfer' => $this->formatTransfer($transfer, true) // Include full details
        ]);
    }

    /**
     * Format transfer data for response
     */
    protected function formatTransfer(BeeTransfer $transfer, bool $includeMetadata = false): array
    {
        $data = [
            'id' => $transfer->id,
            'amount' => $transfer->amount,
            'transaction_hash' => $transfer->transaction_hash,
            'status' => $transfer->status,
            'notes' => $transfer->notes,
            'created_at' => $transfer->created_at,
            'processed_at' => $transfer->processed_at,
            'sender' => $transfer->sender ? [
                'id' => $transfer->sender->id,
                'name' => $transfer->sender->name,
                'email' => $transfer->sender->email
            ] : null,
            'receiver' => $transfer->receiver ? [
                'id' => $transfer->receiver->id,
                'name' => $transfer->receiver->name,
                'email' => $transfer->receiver->email
            ] : null,
        ];

        if ($includeMetadata) {
            $data['metadata'] = $transfer->metadata;
        }

        return $data;
    }
}