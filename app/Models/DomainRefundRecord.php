<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DomainRefundRecord extends Model
{
    protected $fillable = [
        'user_id',
        'seller_id',
        'domain_id',
        'custom_domain_id',
        'original_amount',
        'buyer_payment_hold',
        'sell_service_commission',
        'reject_service_commission',
        'reject_buyer_commission',
        'refund_amount',
        'total_penalty',
        'status',
        'payment_method',
        'refund_reference',
        'original_transaction_id',
        'notes'
    ];

    public function buyer()
    {
        return $this->belongsTo(Userlist::class, 'user_id');
    }

    public function seller()
    {
        return $this->belongsTo(Userlist::class, 'seller_id');
    }

    public function domain()
    {
        return $this->belongsTo(Domain::class);
    }

    public function customDomain()
    {
        return $this->belongsTo(Customdomain::class, 'custom_domain_id');
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class, 'domain_refund_id');
    }
}