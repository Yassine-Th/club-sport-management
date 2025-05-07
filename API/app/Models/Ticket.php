<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    /** @use HasFactory<\Database\Factories\TicketFactory> */
    use HasFactory;

    protected $fillable = [
        'match_id',
        'category',
        'gate',
        'price',
        'stock',
    ];

    public function match()
    {
        return $this->belongsTo(tabler::class);
    }

    public function orderTickets()
    {
        return $this->hasMany(OrderTicket::class);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_tickets')
            ->withPivot(['quantity', 'purchase_price'])
            ->withTimestamps();
    }
}
