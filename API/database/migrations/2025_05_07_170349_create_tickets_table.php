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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string("type")->default("match");
            $table->unsignedBigInteger('matches_id')->nullable();
            $table->dateTime('date')->nullable();
            $table->string("description")->nullable();
            $table->enum('status', ['available', 'sold out'])->default('available');
            $table->timestamps();

            $table->foreign('matches_id')->references('id')->on('matches')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
