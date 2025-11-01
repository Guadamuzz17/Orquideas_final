<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Evento;
use Carbon\Carbon;

class EventoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $eventos = [
            [
                'nombre_evento' => 'Exposición Nacional de Orquídeas 2024',
                'descripcion' => 'Evento anual de exposición y concurso de orquídeas a nivel nacional',
                'fecha_inicio' => Carbon::create(2024, 11, 15),
                'fecha_fin' => Carbon::create(2024, 11, 17),
                'estado' => 'finalizado',
            ],
            [
                'nombre_evento' => 'Exposición Nacional de Orquídeas 2025',
                'descripcion' => 'Exposición y concurso de orquídeas - Edición 2025',
                'fecha_inicio' => Carbon::create(2025, 10, 31),
                'fecha_fin' => Carbon::create(2025, 11, 2),
                'estado' => 'en curso',
            ],
            [
                'nombre_evento' => 'Exposición Internacional de Orquídeas 2026',
                'descripcion' => 'Gran evento internacional de orquídeas con participantes de toda Latinoamérica',
                'fecha_inicio' => Carbon::create(2026, 3, 10),
                'fecha_fin' => Carbon::create(2026, 3, 15),
                'estado' => 'programado',
            ],
        ];

        foreach ($eventos as $evento) {
            Evento::create($evento);
        }
    }
}
