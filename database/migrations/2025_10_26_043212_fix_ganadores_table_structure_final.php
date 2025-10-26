<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Eliminar registros con id_inscripcion inválido
        DB::statement('DELETE FROM tb_ganadores WHERE id_inscripcion = 0 OR id_inscripcion IS NULL');

        // Verificar si la foreign key ya existe y agregarla si no
        $foreignKeyExists = DB::select("
            SELECT COUNT(*) as count
            FROM information_schema.KEY_COLUMN_USAGE
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'tb_ganadores'
            AND COLUMN_NAME = 'id_inscripcion'
            AND REFERENCED_TABLE_NAME IS NOT NULL
        ");

        if ($foreignKeyExists[0]->count == 0) {
            Schema::table('tb_ganadores', function (Blueprint $table) {
                $table->foreign('id_inscripcion')->references('id_nscr')->on('tb_inscripcion')->onDelete('cascade');
            });
        }
    }    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_ganadores', function (Blueprint $table) {
            // Revertir cambios
            if (Schema::hasColumn('tb_ganadores', 'id_inscripcion')) {
                $table->dropForeign(['id_inscripcion']);
                $table->dropColumn('id_inscripcion');
            }

            // Restaurar columnas antiguas
            $table->unsignedBigInteger('id_proudsa')->nullable();
            $table->unsignedBigInteger('id_grupo')->nullable();
            $table->unsignedBigInteger('id_case')->nullable();
        });
    }
};
