<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ticketCategories extends Model
{
    /** @use HasFactory<\Database\Factories\TicketCategoriesFactory> */
    use HasFactory;
    protected $fillable = [
        'category', 'gate'
    ];

    // Each category row belongs to one match
    public function match(): BelongsTo
    {
        return $this->belongsTo(Matches::class);
    }

    // A category can be used by many tickets
    public function tickets()
    {
        return $this->belongsToMany(Ticket::class, 'category_ticket', 'category_id', 'ticket_id');
    }
}
