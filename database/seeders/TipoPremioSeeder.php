<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TipoPremio;

class TipoPremioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $premios = [
            [
                'nombre_premio' => 'Primer Lugar',
                'descripcion' => 'Listón de primer lugar',
                'posicion' => 1,
                'color' => '#fbbf24', // Dorado
                'activo' => true,
            ],
            [
                'nombre_premio' => 'Segundo Lugar',
                'descripcion' => 'Listón de segundo lugar',
                'posicion' => 2,
                'color' => '#9ca3af', // Plateado
                'activo' => true,
            ],
            [
                'nombre_premio' => 'Tercer Lugar',
                'descripcion' => 'Listón de tercer lugar',
                'posicion' => 3,
                'color' => '#cd7f32', // Bronce
                'activo' => true,
            ],
            [
                'nombre_premio' => 'Mención Honorífica',
                'descripcion' => 'Reconocimiento especial',
                'posicion' => 4,
                'color' => '#3b82f6', // Azul
                'activo' => true,
            ],
        ];

        foreach ($premios as $premio) {
            TipoPremio::create($premio);
        }
    }
}
