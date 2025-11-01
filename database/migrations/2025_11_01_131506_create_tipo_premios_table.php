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
        Schema::create('tb_tipo_premio', function (Blueprint $table) {
            $table->id('id_tipo_premio');
            $table->string('nombre_premio', 100);
            $table->string('descripcion', 255)->nullable();
            $table->integer('posicion')->comment('1=Primer lugar, 2=Segundo lugar, 3=Tercer lugar, etc.');
            $table->string('color', 20)->default('#3b82f6')->comment('Color para identificar el premio en la UI');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_tipo_premio');
    }
};
