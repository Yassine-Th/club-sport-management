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
        Schema::create('player_match_goals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_match_stat_id')->constrained('my_player_match_stats')->onDelete('cascade');
            $table->unsignedInteger('minute');
            $table->foreignId('assist_player_stat_id')->nullable()->constrained('my_player_match_stats')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('player_match_goals');
    }
};
