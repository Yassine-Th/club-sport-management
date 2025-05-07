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
