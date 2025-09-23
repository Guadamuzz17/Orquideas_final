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
        Schema::table('tb_inscripcion', function (Blueprint $table) {
            // Renombrar la columna de id_orgudea a id_orquidea
            $table->renameColumn('id_orgudea', 'id_orquidea');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_inscripcion', function (Blueprint $table) {
            // Revertir el cambio
            $table->renameColumn('id_orquidea', 'id_orgudea');
        });
    }
};
