<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartamentoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tb_departamento')->insert([
            ['id_departamento' => 1, 'nombre_departamento' => 'Guatemala'],
            ['id_departamento' => 2, 'nombre_departamento' => 'El Progreso'],
            ['id_departamento' => 3, 'nombre_departamento' => 'Sacatepéquez'],
            ['id_departamento' => 4, 'nombre_departamento' => 'Chimaltenango'],
            ['id_departamento' => 5, 'nombre_departamento' => 'Escuintla'],
            ['id_departamento' => 6, 'nombre_departamento' => 'Santa Rosa'],
            ['id_departamento' => 7, 'nombre_departamento' => 'Sololá'],
            ['id_departamento' => 8, 'nombre_departamento' => 'Totonicapán'],
            ['id_departamento' => 9, 'nombre_departamento' => 'Quetzaltenango'],
            ['id_departamento' => 10, 'nombre_departamento' => 'Suchitepéquez'],
            ['id_departamento' => 11, 'nombre_departamento' => 'Retalhuleu'],
            ['id_departamento' => 12, 'nombre_departamento' => 'San Marcos'],
            ['id_departamento' => 13, 'nombre_departamento' => 'Huehuetenango'],
            ['id_departamento' => 14, 'nombre_departamento' => 'El Quiché'],
            ['id_departamento' => 15, 'nombre_departamento' => 'Baja Verapaz'],
            ['id_departamento' => 16, 'nombre_departamento' => 'Alta Verapaz'],
            ['id_departamento' => 17, 'nombre_departamento' => 'Petén'],
            ['id_departamento' => 18, 'nombre_departamento' => 'Izabal'],
            ['id_departamento' => 19, 'nombre_departamento' => 'Zacapa'],
            ['id_departamento' => 20, 'nombre_departamento' => 'Chiquimula'],
            ['id_departamento' => 21, 'nombre_departamento' => 'Jalapa'],
            ['id_departamento' => 22, 'nombre_departamento' => 'Jutiapa'],
        ]);
    }
}