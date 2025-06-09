<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_orquidea', function (Blueprint $table) {
            $table->id('id_orquidea');
            $table->string('nombre_planta', 255)->nullable();
            $table->string('origen', 255)->nullable();
            $table->binary('foto')->nullable();
            $table->foreignId('id_grupo')->constrained('tb_grupo', 'id_grupo');
            $table->foreignId('id_case')->constrained('tb_clase', 'id_clase');
            $table->binary('gr_code')->nullable();
            $table->string('codigo_orquide', 255)->nullable();
            $table->foreignId('a')->nullable()->constrained('tb_participante');
            $table->timestamp('fecha_crescion')->useCurrent();
            $table->timestamp('fecha_actualizacion')->useCurrent()->useCurrentOnUpdate();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_orquidea');
    }
};