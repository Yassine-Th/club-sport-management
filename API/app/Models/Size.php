<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    use HasFactory;

    protected $fillable = ['size', 'label'];

    public function clothes()
    {
        return $this->belongsToMany(Clothes::class,'clothes_size')->withPivot('stock')->withTimestamps();
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
