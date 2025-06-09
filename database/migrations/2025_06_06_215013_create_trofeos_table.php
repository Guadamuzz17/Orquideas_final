<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_trofeo', function (Blueprint $table) {
            $table->id('id_trofeo');
            $table->foreignId('id_orquidea')->nullable()->constrained('tb_orquidea', 'id_orquidea')->onUpdate('restrict')->onDelete('restrict');
            $table->foreignId('id_clase')->nullable()->constrained('tb_clase', 'id_clase')->onUpdate('restrict')->onDelete('restrict');
            $table->foreignId('id_grupp')->nullable()->constrained('tb_grupo', 'id_grupo')->onUpdate('restrict')->onDelete('restrict');
            $table->string('categoria', 50)->nullable();
            $table->date('fecha_ganador')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_trofeo');
    }
};