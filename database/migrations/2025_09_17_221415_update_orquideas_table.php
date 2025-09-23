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
        Schema::table('tb_orquidea', function (Blueprint $table) {
            // Primero eliminar las claves foráneas
            $table->dropForeign(['id_case']);
            $table->dropForeign(['a']);
            
            // Eliminar columnas innecesarias
            $table->dropColumn(['id_case', 'gr_code', 'codigo_orquide', 'a', 'fecha_crescion', 'fecha_actualizacion']);
            
            // Agregar nuevas columnas
            $table->foreignId('id_clase')->after('id_grupo')->constrained('tb_clase', 'id_clase');
            $table->integer('cantidad')->default(1)->after('foto');
            $table->foreignId('id_participante')->after('cantidad')->constrained('tb_participante');
            
            // Cambiar tipo de columna foto
            $table->string('foto', 500)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_orquidea', function (Blueprint $table) {
            // Revertir cambios
            $table->dropForeign(['id_clase']);
            $table->dropForeign(['id_participante']);
            $table->dropColumn(['id_clase', 'cantidad', 'id_participante']);
            
            // Restaurar columnas originales
            $table->foreignId('id_case')->constrained('tb_clase', 'id_clase');
            $table->binary('gr_code')->nullable();
            $table->string('codigo_orquide', 255)->nullable();
            $table->foreignId('a')->nullable()->constrained('tb_participante');
            $table->timestamp('fecha_crescion')->useCurrent();
            $table->timestamp('fecha_actualizacion')->useCurrent()->useCurrentOnUpdate();
            
            $table->binary('foto')->nullable()->change();
        });
    }
};
