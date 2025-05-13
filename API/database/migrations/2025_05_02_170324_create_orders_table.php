<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->decimal('total_price', 10, 2);
            $table->enum('status', [
                'pending',
                'paid',
                'shipped',
                'cancelled',
                'processing',
                'completed',
            ])->default('pending');           
             $table->string('ship_full_name');
            $table->string('ship_email');
            $table->string('ship_phone');
            $table->string('ship_address');
            $table->string('ship_city');
            $table->string('ship_postal_code');
            // Payment
            $table->string('payment_method')->default('cash');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
