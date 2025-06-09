<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('nom_usuarios', function (Blueprint $table) {
            $table->id('Id_usuario');
            $table->string('nombre_usuario', 50);
            $table->enum('tipo_usuario', ['Admin general', 'Corroborado', 'Asignador', 'Juez', 'Usuario']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('nom_usuarios');
    }
};