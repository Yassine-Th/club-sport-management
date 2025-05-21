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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('my_club_id')->constrained('my_club');
            $table->foreignId('opponent_club_id')->constrained('clubs')->onDelete('cascade');
            $table->dateTime('match_date')->nullable();
            $table->string('match_location')->nullable();
            $table->boolean('is_home')->default(true)->nullable();
            $table->unsignedBigInteger('my_club_goals')->nullable();
            $table->unsignedBigInteger('opponent_club_goals')->nullable();
            $table->integer('journée')->nullable()->unique();
            $table->enum('aller_retour', ['aller', 'retour'])->default('aller')->nullable();
            $table->enum('status', ['venir', 'terminée', 'reportée'])->default('venir')->nullable();           
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tabler');
    }
};
