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
        // Tabla de roles
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100)->unique();
            $table->string('descripcion', 255)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // Tabla de permisos
        Schema::create('permisos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100)->unique(); // Nombre único del permiso
            $table->string('modulo', 100); // Módulo al que pertenece (ej: participantes, inscripciones)
            $table->string('descripcion', 255)->nullable();
            $table->string('ruta', 255)->nullable(); // Ruta base del módulo
            $table->timestamps();
        });

        // Tabla pivote: roles_permisos
        Schema::create('roles_permisos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rol_id')->constrained('roles')->onDelete('cascade');
            $table->foreignId('permiso_id')->constrained('permisos')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['rol_id', 'permiso_id']);
        });

        // Agregar columna rol_id a la tabla users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('rol_id')->nullable()->after('email')->constrained('roles')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['rol_id']);
            $table->dropColumn('rol_id');
        });

        Schema::dropIfExists('roles_permisos');
        Schema::dropIfExists('permisos');
        Schema::dropIfExists('roles');
    }
};
