<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Matches extends Model
{
    /** @use HasFactory<\Database\Factories\MatchsFactory> */
    use HasFactory;


    protected $fillable = [
        'my_club_id',
        'opponent_club_id',
        'match_date',
        'match_location',
        'my_club_goals',
        'opponent_club_goals',
        'is_home',
        'journée', 
        'aller_retour',
        'status'
    ];


    public function opponent()
    {
        return $this->belongsTo(Club::class, 'opponent_club_id');
    }
    public function myClub()
    {
        return $this->belongsTo(MyClub::class, 'my_club_id');
    }
    public function playerStats()
    {
        return $this->hasMany(MyPlayerMatchStat::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
    
    public function summary(): array
    {
        // Make sure the relation data has been eager-loaded:
        $this->loadMissing(['myClub:id,name', 'opponent:id,name', 'myClub:id,stadium_name',]);

        return [
            'id'                 => $this->id,
            'my_club_name'       => $this->myClub->name,
            'opponent_club_name' => $this->opponent->name,
            'match_date'         => $this->match_date,
            'match_location'     => $this->myClub->stadium_name,
            'journée'           => $this->journée,
        ];
    }
    public function getSummaryAttribute(): array
    {
        return $this->summary();
    }
}
