<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Agregar id_evento a tb_participante
        Schema::table('tb_participante', function (Blueprint $table) {
            $table->unsignedBigInteger('id_evento')->nullable()->after('id');
            $table->foreign('id_evento')->references('id_evento')->on('tb_evento')
                ->onUpdate('restrict')->onDelete('restrict');
        });

        // Agregar id_evento a tb_orquidea
        Schema::table('tb_orquidea', function (Blueprint $table) {
            $table->unsignedBigInteger('id_evento')->nullable()->after('id_orquidea');
            $table->foreign('id_evento')->references('id_evento')->on('tb_evento')
                ->onUpdate('restrict')->onDelete('restrict');
        });

        // Agregar id_evento a tb_inscripcion
        Schema::table('tb_inscripcion', function (Blueprint $table) {
            $table->unsignedBigInteger('id_evento')->nullable()->after('id_nscr');
            $table->foreign('id_evento')->references('id_evento')->on('tb_evento')
                ->onUpdate('restrict')->onDelete('restrict');
        });

        // Agregar id_evento a tb_ganadores
        Schema::table('tb_ganadores', function (Blueprint $table) {
            $table->unsignedBigInteger('id_evento')->nullable()->after('id_ganador');
            $table->foreign('id_evento')->references('id_evento')->on('tb_evento')
                ->onUpdate('restrict')->onDelete('restrict');
        });

        // Agregar id_evento a tb_trofeo (incluye listones)
        Schema::table('tb_trofeo', function (Blueprint $table) {
            $table->unsignedBigInteger('id_evento')->nullable()->after('id_trofeo');
            $table->foreign('id_evento')->references('id_evento')->on('tb_evento')
                ->onUpdate('restrict')->onDelete('restrict');
        });

        // Agregar id_evento a fotos_eventos
        Schema::table('fotos_eventos', function (Blueprint $table) {
            $table->unsignedBigInteger('id_evento')->nullable()->after('id');
            $table->foreign('id_evento')->references('id_evento')->on('tb_evento')
                ->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar foreign keys y columnas en orden inverso
        Schema::table('fotos_eventos', function (Blueprint $table) {
            $table->dropForeign(['id_evento']);
            $table->dropColumn('id_evento');
        });

        Schema::table('tb_trofeo', function (Blueprint $table) {
            $table->dropForeign(['id_evento']);
            $table->dropColumn('id_evento');
        });

        Schema::table('tb_ganadores', function (Blueprint $table) {
            $table->dropForeign(['id_evento']);
            $table->dropColumn('id_evento');
        });

        Schema::table('tb_inscripcion', function (Blueprint $table) {
            $table->dropForeign(['id_evento']);
            $table->dropColumn('id_evento');
        });

        Schema::table('tb_orquidea', function (Blueprint $table) {
            $table->dropForeign(['id_evento']);
            $table->dropColumn('id_evento');
        });

        Schema::table('tb_participante', function (Blueprint $table) {
            $table->dropForeign(['id_evento']);
            $table->dropColumn('id_evento');
        });
    }
};
