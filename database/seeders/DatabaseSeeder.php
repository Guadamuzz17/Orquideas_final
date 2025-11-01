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
            DepartamentoSeeder::class,
            MunicipioSeeder::class,
            // OrganizacionSeeder::class, // Comentado para evitar conflictos con AsoSeeder
            GrupoSeeder::class,
            ClaseSeeder::class,
            TipoParticipanteSeeder::class,
            AsoSeeder::class,
            EventoSeeder::class,
        ]);
    }
}
