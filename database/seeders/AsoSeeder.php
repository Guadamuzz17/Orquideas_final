<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AsoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $asos = [
            ['id_aso' => 1, 'Clase' => 'Asociación Nacional de Orquideología'],
            ['id_aso' => 2, 'Clase' => 'Asociación Regional de Guatemala'],
            ['id_aso' => 3, 'Clase' => 'Asociación de Orquídeas de Alta Verapaz'],
            ['id_aso' => 4, 'Clase' => 'Asociación de Orquídeas de Quetzaltenango'],
            ['id_aso' => 5, 'Clase' => 'Asociación Independiente'],
        ];

        foreach ($asos as $aso) {
            DB::table('tb_aso')->updateOrInsert(
                ['id_aso' => $aso['id_aso']],
                $aso
            );
        }
    }
}
