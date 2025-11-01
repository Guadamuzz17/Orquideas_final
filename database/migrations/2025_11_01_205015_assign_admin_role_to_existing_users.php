<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;
use App\Models\Rol;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Obtener el rol de Admin General
        $adminRole = Rol::where('nombre', 'Admin General')->first();

        if ($adminRole) {
            // Asignar el rol de Admin General a todos los usuarios existentes que no tienen rol
            User::whereNull('rol_id')->update(['rol_id' => $adminRole->id]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Obtener el rol de Admin General
        $adminRole = Rol::where('nombre', 'Admin General')->first();

        if ($adminRole) {
            // Remover el rol de Admin General de los usuarios
            User::where('rol_id', $adminRole->id)->update(['rol_id' => null]);
        }
    }
};
