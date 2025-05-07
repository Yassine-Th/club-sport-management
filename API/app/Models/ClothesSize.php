<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClothesSize extends Model
{
    use HasFactory;
    protected $table = 'clothes_size';
    protected $fillable = [
        'clothes_id',
        'size_id',
        'stock',
    ];

    /**
     * Get the clothing item for this pivot entry.
     */
    public function clothes()
    {
        return $this->belongsTo(Clothes::class, 'clothes_id');
    }

    /**
     * Get the size for this pivot entry.
     */
    public function size()
    {
        return $this->belongsTo(Size::class, 'size_id');
    }
}
