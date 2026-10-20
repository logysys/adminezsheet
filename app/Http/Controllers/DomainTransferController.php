<?php

namespace App\Http\Controllers;

use App\Models\Domain;
use App\Models\Customdomain;
use App\Models\HandleTransfer;
use App\Models\Userlist;
use App\Models\EzFunnel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DomainTransferController extends Controller
{
    public function index(Request $request): Response
    {
        $query = HandleTransfer::with(['sender', 'recipient', 'handle'])
            ->orderBy('created_at', 'desc');

        $transfers = $query->paginate(10)->withQueryString();

        return Inertia::render('DomainTransfer/Index', [
            'transfers' => $transfers,
            'users' => Userlist::all(),
            'domains' => Domain::all(),
            'customDomains' => Customdomain::all(),
            'auth' => ['user' => auth()->user() ?? null],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'handle_type' => 'required|in:custom,domain',
            'handle_id' => 'required|integer',
            'expires_at' => 'nullable|date',
        ]);

        $handle = $validated['handle_type'] === 'custom' 
            ? Customdomain::findOrFail($validated['handle_id'])
            : Domain::findOrFail($validated['handle_id']);

        $transfer = HandleTransfer::create([
            'user_id' => $handle->user_id,
            'recipient_id' => $validated['recipient_id'],
            'handle_type' => $validated['handle_type'],
            'handle_id' => $validated['handle_id'],
            'handle_name' => $validated['handle_type'] === 'custom' 
                ? 'https://'.$handle->domainselected.'/'.$handle->domain 
                : 'https://'.$handle->domain . '.' . $handle->domainselected,
            'token' => Str::random(32),
            'expires_at' => $validated['expires_at'] ?? now()->addDays(7),
        ]);

        return redirect()->route('domain-transfers.index')->with('success', 'Transfer created successfully!');
    }

    public function completeTransfer(Request $request, $token)
    {
        $transfer = HandleTransfer::where('token', $token)
            ->where('used', false)
            ->where(function($q) {
                // Admin can complete any transfer
                    return $q;
            })
            ->firstOrFail();

        if ($transfer->handle_type === 'custom') {
            $handle = Customdomain::findOrFail($transfer->handle_id);
        } else {
            $handle = Domain::findOrFail($transfer->handle_id);
        }

        // Handle funnel transfer logic
        $funnelId = $request->input('funnel_id');
        $originalFunnel = $handle->funnelid ? EzFunnel::find($handle->funnelid) : null;

        if ($funnelId) {
            $handle->update([
                'user_id' => $transfer->recipient_id,
                'funnelid' => $funnelId
            ]);
        } elseif ($originalFunnel) {
            $funnel = EzFunnel::create([
                'user_id' => $transfer->recipient_id,
                'theme' => $originalFunnel->theme ?? 'default',
                'color' => $originalFunnel->color ?? '#5d0f6e',
                'transparency' => $originalFunnel->transparency ?? 0,
                'mode' => $originalFunnel->mode ?? 'light',
                'fly_sign' => $originalFunnel->fly_sign ?? null,
                'eye_tracking' => $originalFunnel->eye_tracking ?? null,
                'seo_tag' => $originalFunnel->seo_tag ?? null
            ]);

            // Copy all related data
            if ($originalFunnel->fields()->exists()) {
                foreach ($originalFunnel->fields as $field) {
                    $funnel->fields()->create($field->toArray());
                }
            }

            if ($originalFunnel->effectSettings()->exists()) {
                foreach ($originalFunnel->effectSettings as $effect) {
                    $funnel->effectSettings()->create($effect->toArray());
                }
            }

            if ($originalFunnel->seoSettings()->exists()) {
                $seoSettings = $originalFunnel->seoSettings->toArray();
                unset($seoSettings['id']);
                $funnel->seoSettings()->create($seoSettings);
            }

            if ($originalFunnel->logoSettings()->exists()) {
                $logoSettings = $originalFunnel->logoSettings->toArray();
                unset($logoSettings['id']);
                $funnel->logoSettings()->create($logoSettings);
            }

            $handle->update([
                'user_id' => $transfer->recipient_id,
                'funnelid' => $funnel->id
            ]);
        } else {
            $handle->update([
                'user_id' => $transfer->recipient_id,
                'funnelid' => null
            ]);
        }

        $transfer->update([
            'used' => true,
            'transferred_at' => now(),
            'completed_by_admin' => auth()->user()->is_admin,
        ]);

        return redirect()->route('domain-transfers.index')->with('success', 'Transfer completed successfully!');
    }
}