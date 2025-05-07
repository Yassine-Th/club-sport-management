<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Club extends Model
{
    use HasFactory;
    protected $table = 'clubs';

    protected $fillable = [
        'name',
        'logo',
        'founded',
        'coach_name',
    ];

    // tabler where this club was the opponent
    public function Matches()
    {
        return $this->hasMany(Matches::class, 'opponent_club_id');
    }
}
