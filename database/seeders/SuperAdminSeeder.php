<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Rol;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buscar el rol de Admin General
        $rolAdmin = Rol::where('nombre', 'Admin General')->first();

        if (!$rolAdmin) {
            $this->command->error('❌ No se encontró el rol "Admin General". Ejecuta RolesPermisosSeeder primero.');
            return;
        }

        // Crear usuario SuperAdmin
        $superAdmin = User::create([
            'name' => 'Super Administrador',
            'email' => 'admin@orquideas.com',
            'password' => Hash::make('admin123'), // Cambiar en producción
            'email_verified_at' => now(),
            'rol_id' => $rolAdmin->id_rol, // Asignar rol directamente
        ]);

        $this->command->info("✅ SuperAdmin creado exitosamente");
        $this->command->info("   Email: admin@orquideas.com");
        $this->command->info("   Password: admin123");
        $this->command->warn("⚠️  IMPORTANTE: Cambia la contraseña en producción");
    }
}
