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
            // Eliminar columnas antiguas si existen
            if (Schema::hasColumn('tb_ganadores', 'id_proudsa')) {
                $table->dropColumn('id_proudsa');
            }
            if (Schema::hasColumn('tb_ganadores', 'id_grupo')) {
                $table->dropColumn('id_grupo');
            }
            if (Schema::hasColumn('tb_ganadores', 'id_case')) {
                $table->dropColumn('id_case');
            }
            
            // Agregar nueva estructura
            if (!Schema::hasColumn('tb_ganadores', 'id_inscripcion')) {
                $table->foreignId('id_inscripcion')->constrained('tb_inscripcion', 'id_nscr')->onDelete('cascade');
            }
            if (!Schema::hasColumn('tb_ganadores', 'posicion')) {
                $table->integer('posicion'); // 1, 2, 3 para 1°, 2°, 3° lugar
            }
            if (!Schema::hasColumn('tb_ganadores', 'empate')) {
                $table->boolean('empate')->default(false);
            }
            if (!Schema::hasColumn('tb_ganadores', 'fecha_ganador')) {
                $table->timestamp('fecha_ganador')->useCurrent();
            }
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
            $table->dropColumn(['id_inscripcion', 'posicion', 'empate', 'fecha_ganador']);
            
            // Restaurar columnas antiguas
            $table->bigInteger('id_proudsa')->unsigned();
            $table->bigInteger('id_grupo')->unsigned();
            $table->bigInteger('id_case')->unsigned();
        });
    }
};
