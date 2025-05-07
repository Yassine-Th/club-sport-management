<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyPlayerMatchStat extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'player_id',
        'goals_count',
        'assists_count',
        'yellow_cards',
        'red_cards',
    ];

    public function match()
    {
        return $this->belongsTo(tabler::class);
    }

    public function player()
    {
        return $this->belongsTo(Player::class);
    }

    /** All the individual goal events for this player in this match */
    public function goals()
    {
        return $this->hasMany(PlayerMatchGoal::class, 'player_match_stat_id');
    }

    /** All assists this player made */
    public function assists()
    {
        return $this->hasMany(
            PlayerMatchGoal::class,
            'assist_player_stat_id'
        );
    }
}
