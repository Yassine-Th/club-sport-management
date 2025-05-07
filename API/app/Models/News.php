<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    /** @use HasFactory<\Database\Factories\NewsFactory> */
    use HasFactory;

    protected $fillable = [
        'journalist_id',
        'title',
        'content',
        'image',
        'category',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'journalist_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
