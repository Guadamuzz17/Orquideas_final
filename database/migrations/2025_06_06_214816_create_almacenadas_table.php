<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_almacenadas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_orquidea')->constrained('tb_orquidea', 'id_orquidea')->onUpdate('restrict')->onDelete('restrict');
            $table->string('estado', 50);
            $table->string('motivo', 225)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_almacenadas');
    }
};