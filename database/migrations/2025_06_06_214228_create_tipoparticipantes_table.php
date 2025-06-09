<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_tipoparticipante', function (Blueprint $table) {
            $table->id('id_tipo');
            $table->string('Clase', 10);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_tipoparticipante');
    }
};