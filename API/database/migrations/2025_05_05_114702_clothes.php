<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clothes', function (Blueprint $table) {
            $table->id();
            // Points to the base product entry
            $table->foreignId('product_id')
                ->constrained('products')
                ->onDelete('cascade');

            // Any clothes-specific fields:
            $table->enum('gender', ['men', 'women',"children" ,'unisex'])->default('unisex');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clothes');
    }
};
