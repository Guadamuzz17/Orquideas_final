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
        Schema::table('tb_participante', function (Blueprint $table) {
            // Primero eliminamos la foreign key constraint
            $table->dropForeign(['id_usuario']);
            
            // Modificamos la columna para que sea nullable
            $table->unsignedBigInteger('id_usuario')->nullable()->change();
            
            // Volvemos a agregar la foreign key constraint pero ahora nullable
            $table->foreign('id_usuario')
                  ->references('id_usuario')
                  ->on('tb_usuarios')
                  ->onUpdate('restrict')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_participante', function (Blueprint $table) {
            // Eliminamos la foreign key
            $table->dropForeign(['id_usuario']);
            
            // Volvemos la columna a no nullable
            $table->unsignedBigInteger('id_usuario')->nullable(false)->change();
            
            // Restauramos la foreign key original
            $table->foreign('id_usuario')
                  ->references('id_usuario')
                  ->on('tb_usuarios')
                  ->onUpdate('restrict')
                  ->onDelete('restrict');
        });
    }
};
