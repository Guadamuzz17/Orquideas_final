<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_municipio', function (Blueprint $table) {
            $table->bigIncrements('id_municipio');
            
            // Versión explícita que funciona seguro
            $table->unsignedBigInteger('id_departamento');
            $table->foreign('id_departamento')
                  ->references('id_departamento')
                  ->on('tb_departamento')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
            
            $table->string('nombre_municipio', 100);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_municipio');
    }
};