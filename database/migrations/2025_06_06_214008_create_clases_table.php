<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_clase', function (Blueprint $table) {
            $table->id('id_clase');
            $table->string('nombre_clase', 255);
            $table->foreignId('id_grupp')->constrained('tb_grupo', 'id_grupo')->onUpdate('restrict')->onDelete('restrict');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_clase');
    }
};