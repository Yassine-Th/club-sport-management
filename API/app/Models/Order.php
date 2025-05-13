<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    /** @use HasFactory<\Database\Factories\OrderFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'total_price',
        'status',
        'ship_full_name',
        'ship_email',
        'ship_phone',
        'ship_address',
        'ship_city',
        'ship_postal_code',
        'payment_method',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function orderTickets()
    {
        return $this->hasMany(OrderTicket::class);
    }

    public function tickets()
    {
        return $this->belongsToMany(Ticket::class, 'order_tickets')
            ->withPivot(['quantity', 'purchase_price'])
            ->withTimestamps();
    }
}
