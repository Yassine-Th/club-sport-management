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
        'founded',
        'coach_name',
    ];
}
