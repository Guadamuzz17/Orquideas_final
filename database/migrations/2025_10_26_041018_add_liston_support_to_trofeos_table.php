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
        Schema::table('tb_trofeo', function (Blueprint $table) {
            // Agregar campos para soportar listones
            $table->enum('tipo_premio', ['trofeo', 'liston'])->default('trofeo')->after('categoria');
            $table->string('tipo_liston', 100)->nullable()->after('tipo_premio');
            $table->text('descripcion')->nullable()->after('tipo_liston');
            $table->unsignedBigInteger('id_inscripcion')->nullable()->after('id_grupp');

            // Agregar foreign key para inscripción
            $table->foreign('id_inscripcion')->references('id_nscr')->on('tb_inscripcion');

            // Índice para mejorar consultas
            $table->index(['tipo_premio', 'fecha_ganador']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_trofeo', function (Blueprint $table) {
            $table->dropForeign(['id_inscripcion']);
            $table->dropIndex(['tipo_premio', 'fecha_ganador']);
            $table->dropColumn(['tipo_premio', 'tipo_liston', 'descripcion', 'id_inscripcion']);
        });
    }
};
