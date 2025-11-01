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
            $table->unsignedBigInteger('id_tipo_premio')->nullable()->after('tipo_liston');
            $table->foreign('id_tipo_premio')->references('id_tipo_premio')->on('tb_tipo_premio')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tb_trofeo', function (Blueprint $table) {
            $table->dropForeign(['id_tipo_premio']);
            $table->dropColumn('id_tipo_premio');
        });
    }
};
