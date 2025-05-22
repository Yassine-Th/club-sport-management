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
        Schema::create('trophies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('my_club_id')->constrained('my_club');
            $table->string('title');
            $table->integer('year');
            $table->integer('times_won')->default(1); // 🏆 عدد مرات الفوز
            $table->string('competition');
            $table->text('description');
            $table->string('photo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trophies');
    }
};
