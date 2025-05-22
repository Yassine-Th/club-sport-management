<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trophy extends Model
{
    use HasFactory;

    protected $fillable = [
        'my_club_id',
        'title',
        'year',
        'times_won',
        'competition',
        'description',
        'photo'
    ];

    public function club()
    {
        return $this->belongsTo(MyClub::class, 'my_club_id');
    }
}
