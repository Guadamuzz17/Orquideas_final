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
            // Eliminar claves foráneas existentes
            $table->dropForeign(['id_proudsa']);
            $table->dropForeign(['id_grupo']);
            $table->dropForeign(['id_case']);
            
            // Eliminar columnas antiguas
            $table->dropColumn(['id_proudsa', 'id_grupo', 'id_case']);
            
            // Agregar nueva columna de relación con inscripción
            $table->foreignId('id_inscripcion')->constrained('tb_inscripcion', 'id_nscr')->onDelete('cascade');
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
            $table->dropColumn('id_inscripcion');
            
            // Restaurar columnas antiguas
            $table->foreignId('id_proudsa')->constrained('tb_participante');
            $table->foreignId('id_grupo')->constrained('tb_grupo');
            $table->foreignId('id_case')->constrained('tb_clase');
        });
    }
};
