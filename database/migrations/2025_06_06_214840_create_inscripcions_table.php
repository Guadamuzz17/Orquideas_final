<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_inscripcion', function (Blueprint $table) {
            $table->id('id_nscr');
            $table->foreignId('id_participante')->constrained('tb_participante');
            $table->foreignId('id_orquidea')->constrained('tb_orquidea', 'id_orquidea');
            $table->string('correlativo', 150);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_inscripcion');
    }
};