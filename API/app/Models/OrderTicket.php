<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTicket extends Model
{
    /** @use HasFactory<\Database\Factories\OrderTicketFactory> */
    use HasFactory;

    protected $table = 'order_tickets';

    protected $fillable = [
        'user_id',
        'ticket_id',
        'quantity',
        'total_price'
    ];

    // Which user made this purchase
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Which ticket was bought
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
