<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_ganadores', function (Blueprint $table) {
            $table->id('id_ganador');
            $table->foreignId('id_proudsa')->constrained('tb_participante');
            $table->foreignId('id_grupo')->constrained('tb_grupo', 'id_grupo');
            $table->foreignId('id_case')->constrained('tb_clase', 'id_clase');
            $table->integer('posicion');
            $table->boolean('empate')->default(false);
            $table->dateTime('fecha_ganador');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_ganadores');
    }
};