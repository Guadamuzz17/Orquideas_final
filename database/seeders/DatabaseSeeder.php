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
            OrganizacionSeeder::class,
            GrupoSeeder::class,
            TipoParticipanteSeeder::class,
            AsoSeeder::class,
            ClaseSeeder::class,
        ]);
    }
}
