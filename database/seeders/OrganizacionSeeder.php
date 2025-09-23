<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrganizacionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_aso')->insert([
            ['id_aso' => 1, 'Clase' => 'Asociación Guatemalteca de Orquideología AGO'],
            ['id_aso' => 2, 'Clase' => 'Asociación Bajaverapacense de Orquideología ABO'],
            ['id_aso' => 3, 'Clase' => 'Asociación de Orquideología La Antigua Guatemala AOAG'],
            ['id_aso' => 4, 'Clase' => 'Asociación Altaverapacense de Orquideología AAO'],
            ['id_aso' => 5, 'Clase' => 'Asociación de Orquideología Carcha Alta Verapaz AOCAV'],
            ['id_aso' => 6, 'Clase' => 'Independiente'],
        ]);
    }
}