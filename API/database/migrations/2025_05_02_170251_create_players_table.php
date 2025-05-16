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
        Schema::create('players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('my_club_id')->constrained('my_club');
            $table->string('name');
            $table->enum('position', ["Gardien","Défenseur","Milieu","Attaquant"]);
            $table->date('birth_date')->nullable();
            $table->integer('number')->nullable();
            $table->string('height')->nullable();
            $table->string('weight')->nullable();
            $table->string('foot')->nullable();
            $table->string('nationality')->nullable();
            $table->string('photo');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('players');
    }
};
