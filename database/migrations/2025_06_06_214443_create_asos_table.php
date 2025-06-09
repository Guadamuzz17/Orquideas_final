<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tb_aso', function (Blueprint $table) {
            $table->id('id_aso');
            $table->string('Clase', 60);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tb_aso');
    }
};