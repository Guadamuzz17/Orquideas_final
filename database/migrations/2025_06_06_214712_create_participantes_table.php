<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_participante', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 255);
            $table->string('numero_telefonico', 15)->nullable();
            $table->string('direccion', 255)->nullable();
            
            // Relación con tb_tipoparticipante
            $table->unsignedBigInteger('id_tipo');
            $table->foreign('id_tipo')
                  ->references('id_tipo')
                  ->on('tb_tipoparticipante')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            // Relación con tb_departamento (nullable)
            $table->unsignedBigInteger('id_departamento')->nullable();
            $table->foreign('id_departamento')
                  ->references('id_departamento')
                  ->on('tb_departamento')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            // Relación con tb_municipio (nullable)
            $table->unsignedBigInteger('id_municipio')->nullable();
            $table->foreign('id_municipio')
                  ->references('id_municipio')
                  ->on('tb_municipio')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            $table->string('pais', 100)->nullable();
            
            // Relación con tb_aso
            $table->unsignedBigInteger('id_aso');
            $table->foreign('id_aso')
                  ->references('id_aso')
                  ->on('tb_aso')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            $table->timestamp('fecha_creadon')->useCurrent();
            $table->timestamp('fecha_actualizacion')->useCurrent()->useCurrentOnUpdate();
            
            // Relación con tb_usuarios
            $table->unsignedBigInteger('id_usuario');
            $table->foreign('id_usuario')
                  ->references('id_usuario')
                  ->on('tb_usuarios')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_participante');
    }
};