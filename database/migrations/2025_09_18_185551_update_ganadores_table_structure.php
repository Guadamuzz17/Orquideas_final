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
        Schema::table('tb_ganadores', function (Blueprint $table) {
            // Eliminar foreign keys primero, luego las columnas
            if (Schema::hasColumn('tb_ganadores', 'id_proudsa')) {
                $table->dropForeign(['id_proudsa']);
                $table->dropColumn('id_proudsa');
            }
            if (Schema::hasColumn('tb_ganadores', 'id_grupo')) {
                $table->dropForeign(['id_grupo']);
                $table->dropColumn('id_grupo');
            }
            if (Schema::hasColumn('tb_ganadores', 'id_case')) {
                $table->dropForeign(['id_case']);
                $table->dropColumn('id_case');
            }

            // Agregar nueva estructura
            if (!Schema::hasColumn('tb_ganadores', 'id_inscripcion')) {
                $table->foreignId('id_inscripcion')->constrained('tb_inscripcion', 'id_nscr')->onDelete('cascade');
            }
            // No agregar posicion, empate y fecha_ganador si ya existen (según la tabla original ya las tiene)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_ganadores', function (Blueprint $table) {
            // Revertir cambios
            $table->dropForeign(['id_inscripcion']);
            $table->dropColumn(['id_inscripcion']);

            // Restaurar columnas antiguas
            $table->foreignId('id_proudsa')->constrained('tb_participante');
            $table->foreignId('id_grupo')->constrained('tb_grupo', 'id_grupo');
            $table->foreignId('id_case')->constrained('tb_clase', 'id_clase');
        });
    }
};
