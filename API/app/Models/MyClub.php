<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyClub extends Model
{
    protected $table = 'my_club';
    use HasFactory;
    protected $fillable = [
        'name',
        'logo',
        'city',
        'founded',
        'stadium_name',
        'stadium_capacity',
        'president',
        'coach_name',
        'description',
    ];
    /*public function matches()
    {
        return $this->hasMany(Matches::class, 'my_club_id');
    }
    public function players()
    {
        return $this->hasMany(Player::class, 'my_club_id');
    }*/
}
