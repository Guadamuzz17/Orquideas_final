<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GrupoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grupos = [
            ['id_grupo' => 1, 'nombre_grupo' => 'Grupo A: Epidendrum y géneros aliados', 'Cod_Grupo' => 'A'],
            ['id_grupo' => 2, 'nombre_grupo' => 'Grupo B: Género Guarianthe especie e híbrido', 'Cod_Grupo' => 'B'],
            ['id_grupo' => 3, 'nombre_grupo' => 'Grupo C: Género Cattleya', 'Cod_Grupo' => 'C'],
            ['id_grupo' => 4, 'nombre_grupo' => 'Grupo D: Lycaste y géneros aliados', 'Cod_Grupo' => 'D'],
            ['id_grupo' => 5, 'nombre_grupo' => 'Grupo E: Oncidium y géneros aliados', 'Cod_Grupo' => 'E'],
            ['id_grupo' => 6, 'nombre_grupo' => 'Grupo F: Cypripedium y géneros aliados', 'Cod_Grupo' => 'F'],
            ['id_grupo' => 7, 'nombre_grupo' => 'Grupo G: Vanda, Phalaenopsis y géneros aliados', 'Cod_Grupo' => 'G'],
            ['id_grupo' => 8, 'nombre_grupo' => 'Grupo H: Géneros asiáticos especie e híbrido', 'Cod_Grupo' => 'H'],
            ['id_grupo' => 9, 'nombre_grupo' => 'Grupo I: Pleurothallidinae', 'Cod_Grupo' => 'I'],
            ['id_grupo' => 10, 'nombre_grupo' => 'Grupo J: Miniaturas no Pleurothallidinae, no terrestres', 'Cod_Grupo' => 'J'],
            ['id_grupo' => 11, 'nombre_grupo' => 'Grupo K: Géneros americanos terrestres', 'Cod_Grupo' => 'K'],
            ['id_grupo' => 12, 'nombre_grupo' => 'Grupo L: Arreglos florales', 'Cod_Grupo' => 'L'],
            ['id_grupo' => 13, 'nombre_grupo' => 'Grupo M: Exhibiciones educacionales', 'Cod_Grupo' => 'M'],
            ['id_grupo' => 14, 'nombre_grupo' => 'Grupo Otros', 'Cod_Grupo' => 'O'],
        ];

        foreach ($grupos as $grupo) {
            DB::table('tb_grupo')->updateOrInsert(
                ['id_grupo' => $grupo['id_grupo']],
                $grupo
            );
        }
    }
}
