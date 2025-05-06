<?php

// database/migrations/2025_05_06_000003_create_clothes_size_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clothes_size', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clothes_id')
                ->constrained('clothes')
                ->onDelete('cascade');
            $table->foreignId('size_id')
                ->constrained('sizes')
                ->onDelete('cascade');

            // Stock specific to this size of this clothing item
            $table->integer('stock')->default(0);
            // Optional override price:
            // $table->decimal('price',10,2)->nullable();

            $table->timestamps();
            $table->unique(['clothes_id', 'size_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clothes_size');
    }
};
