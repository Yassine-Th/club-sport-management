<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    /** @use HasFactory<\Database\Factories\TicketFactory> */
    use HasFactory;

    protected $fillable = [
        'type', 'matches_id', 'date', 'description', 'status', 'image', 'location',
    ];

    // If this ticket is for a particular match
    public function match(): BelongsTo
    {
        return $this->belongsTo(Matches::class, 'matches_id');
    }

    // Link back to the category for pricing/stock/etc.
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ticketCategories::class, 'category_ticket', 'ticket_id', 'category_id')->withPivot('price', 'stock');
    }

    // All orders (sales) of this ticket
    public function orders(): HasMany
    {
        return $this->hasMany(OrderTicket::class);
    }
}
