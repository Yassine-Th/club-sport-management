<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    /** @use HasFactory<\Database\Factories\MatchsFactory> */
    use HasFactory;


    protected $fillable = [
        //'my_club_id',
        'opponent_club_id',
        'match_date',
        'is_home',
    ];

    /*public function myClub()
    {
        return $this->belongsTo(MyClub::class, 'my_club_id');
    }*/

    public function opponent()
    {
        return $this->belongsTo(Club::class, 'opponent_club_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
    public function playerStats()
    {
        return $this->hasMany(MyPlayerMatchStat::class);
    }
}
