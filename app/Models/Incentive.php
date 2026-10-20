<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Incentive extends Model
{
    use HasFactory;
	
	protected $primaryKey = 'incentive_id';

    protected $fillable = [
        'user_id',
        'amount',
        'incentive_type',
        'description',
        'status'
    ];

    public function user()
	{
		return $this->belongsTo(Userlist::class, 'user_id');
	}
}