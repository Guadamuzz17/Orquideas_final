<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Cambiar unique de correlativo global a unique compuesto (correlativo + id_evento)
     */
    public function up(): void
    {
        Schema::table('tb_inscripcion', function (Blueprint $table) {
            // 1. Eliminar el índice unique del correlativo solo
            $table->dropUnique(['correlativo']);

            // 2. Crear índice unique compuesto: correlativo es único POR evento
            $table->unique(['correlativo', 'id_evento'], 'correlativo_evento_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_inscripcion', function (Blueprint $table) {
            // Revertir: eliminar unique compuesto y restaurar unique simple
            $table->dropUnique('correlativo_evento_unique');
            $table->unique('correlativo');
        });
    }
};
