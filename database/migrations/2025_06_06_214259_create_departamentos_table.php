<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_departamento', function (Blueprint $table) {
            $table->bigIncrements('id_departamento'); // Cambiado de id() a bigIncrements()
            $table->string('nombre_departamento', 100);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_departamento');
    }
};