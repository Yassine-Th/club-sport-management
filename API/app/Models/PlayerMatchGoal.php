<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerMatchGoal  extends Model
{
    use HasFactory;

    protected $fillable = [
        'player_match_stat_id',
        'minute',
        'assist_player_stat_id',
    ];

    /** The scorer’s aggregate stats row */
    public function scorerStat()
    {
        return $this->belongsTo(MyPlayerMatchStat::class,'player_match_stat_id'
        );
    }

    /** The assisting player’s stats row, if any */
    public function assister()
    {
        return $this->belongsTo(Player::class,'assist_player_id');
    }
    
}
