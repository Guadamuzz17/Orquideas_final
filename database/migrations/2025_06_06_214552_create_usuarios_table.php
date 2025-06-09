<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_usuarios', function (Blueprint $table) {
            $table->id('id_usuario');
            $table->binary('nombre_usuario');
            $table->binary('correo');
            $table->binary('contrasena');
            
            // Cambios en las claves foráneas:
            $table->unsignedBigInteger('id_departamento');
            $table->foreign('id_departamento')
                  ->references('id_departamento')
                  ->on('tb_departamento')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            $table->unsignedBigInteger('id_municipio');
            $table->foreign('id_municipio')
                  ->references('id_municipio')
                  ->on('tb_municipio')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            $table->unsignedBigInteger('id_tipo_usu');
            $table->foreign('id_tipo_usu')
                  ->references('Id_usuario')
                  ->on('nom_usuarios')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            $table->unsignedBigInteger('id_aso');
            $table->foreign('id_aso')
                  ->references('id_aso')
                  ->on('tb_aso')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            $table->timestamp('fecha_registro')->useCurrent();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_usuarios');
    }
};