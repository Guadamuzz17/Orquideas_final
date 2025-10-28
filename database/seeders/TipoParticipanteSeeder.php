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
        $tipos = [
            ['id_tipo' => 1, 'Clase' => 'Nacional'],
            ['id_tipo' => 2, 'Clase' => 'Extranjero'],
        ];

        foreach ($tipos as $tipo) {
            DB::table('tb_tipoparticipante')->updateOrInsert(
                ['id_tipo' => $tipo['id_tipo']],
                $tipo
            );
        }
    }
}
