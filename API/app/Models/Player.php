<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'my_club_id',
        'name',
        'position',
        'number',
        'nationality',
        'photo',
    ];

    public function club()
    {
        return $this->belongsTo(MyClub::class, 'my_club_id');
    }
    public function matchStats()
    {
        return $this->hasMany(MyPlayerMatchStat::class);
    }
}
