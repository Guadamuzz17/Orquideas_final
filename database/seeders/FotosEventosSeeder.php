<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FotoEvento;
use Carbon\Carbon;

class FotosEventosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fotos = [
            [
                'titulo' => 'Festival de Orquídeas 2025',
                'descripcion' => 'Celebración anual del festival de orquídeas en el parque central de Guatemala',
                'fecha_evento' => Carbon::now()->subDays(10),
                'ruta_imagen' => 'fotos/festival-2025.jpg',
            ],
            [
                'titulo' => 'Exposición de Especies Raras',
                'descripcion' => 'Muestra especial de orquídeas raras y en peligro de extinción',
                'fecha_evento' => Carbon::now()->subDays(5),
                'ruta_imagen' => 'fotos/especies-raras.jpg',
            ],
            [
                'titulo' => 'Concurso de Fotografía Botánica',
                'descripcion' => 'Participantes mostrando sus mejores capturas de orquídeas en su hábitat natural',
                'fecha_evento' => Carbon::now()->subDays(3),
                'ruta_imagen' => 'fotos/concurso-foto.jpg',
            ],
            [
                'titulo' => 'Taller de Cultivo',
                'descripcion' => 'Sesión educativa sobre técnicas de cultivo y cuidado de orquídeas para principiantes',
                'fecha_evento' => Carbon::now()->subDay(),
                'ruta_imagen' => 'fotos/taller-cultivo.jpg',
            ],
        ];

        foreach ($fotos as $foto) {
            FotoEvento::create($foto);
        }
    }
}
