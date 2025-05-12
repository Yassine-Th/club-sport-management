<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Clothes extends Model
{
    use HasFactory;

    protected $fillable = ['product_id','gender', 'type'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function sizes()
    {
        return $this->belongsToMany(Size::class,'clothes_size')->withPivot('stock')
            ->withTimestamps();
    }
}
