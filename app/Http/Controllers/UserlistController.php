<?php

namespace App\Http\Controllers;

use App\Models\Userlist;
use App\Models\UserBalance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserlistController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Userlist::with([
            'balance' => function($query) {
                $query->select('user_id', 'bee_points_balance', 'last_updated');
            },
            'funnels' => function($query) {
                $query->select('user_id', 'id');
            },
            'funnels.customDomains' => function($query) {
                $query->select('id', 'funnelid');
            },
            'funnels.handleDomains' => function($query) {
                $query->select('id', 'funnelid');
            }
        ])
        ->select('id', 'name', 'email', 'created_at')
        ->orderBy('created_at', 'desc');

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                  ->orWhere('email', 'like', '%'.$search.'%');
            });
        }

        $users = $query->paginate(10);

        // Transform the data to include counts
        $transformedUsers = $users->getCollection()->map(function($user) {
            $user->funnels_count = $user->funnels->count();
            $user->custom_domains_count = $user->funnels->sum(function($funnel) {
                return $funnel->customDomains->count();
            });
            $user->handle_domains_count = $user->funnels->sum(function($funnel) {
                return $funnel->handleDomains->count();
            });
            return $user;
        });

        $users->setCollection($transformedUsers);

        return Inertia::render('Userlist/Index', [
            'users' => $users,
        ]);
    }
}