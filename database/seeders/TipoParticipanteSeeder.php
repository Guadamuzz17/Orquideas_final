<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoParticipanteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_tipoparticipante')->insert([
            ['id_tipo' => 1, 'Clase' => 'Nacional'],
            ['id_tipo' => 2, 'Clase' => 'Extranjero'],
        ]);
    }
}