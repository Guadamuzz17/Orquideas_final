<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Datos geográficos (deben ir primero)
            DepartamentoSeeder::class,
            MunicipioSeeder::class,

            // 2. Clasificación de orquídeas
            GrupoSeeder::class,
            ClaseSeeder::class,

            // 3. Tipos y organizaciones
            TipoParticipanteSeeder::class,
            AsoSeeder::class,

            // 4. Eventos
            EventoSeeder::class,

            // 5. Tipos de premio
            TipoPremioSeeder::class,

            // 6. Sistema de usuarios y permisos
            RolesPermisosSeeder::class,
            SuperAdminSeeder::class,

            // 7. Fotos de eventos (opcional, datos de ejemplo)
            FotosEventosSeeder::class,

            // NOTA: Los siguientes seeders son para migración de datos del evento 2024
            // Descomentar solo si necesitas migrar datos históricos:
            // Evento2024Seeder::class,
            // MigracionEvento2024::class,
        ]);
    }
}
