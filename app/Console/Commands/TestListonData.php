<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Inscripcion;
use App\Models\Trofeo;

class TestListonData extends Command
{
    protected $signature = 'test:liston-data';
    protected $description = 'Test liston data and relationships';

    public function handle()
    {
        $this->info('=== TESTING LISTON DATA ===');

        // Test inscripciones
        $this->info('1. Testing Inscripciones...');
        $inscripciones = Inscripcion::with(['participante', 'orquidea.grupo', 'orquidea.clase'])->limit(3)->get();

        foreach ($inscripciones as $inscripcion) {
            $this->line("Correlativo: {$inscripcion->correlativo}");
            $this->line("Participante: " . ($inscripcion->participante->nombre ?? 'NULL'));
            $this->line("Orquídea: " . ($inscripcion->orquidea->nombre_planta ?? 'NULL'));
            $this->line("Grupo: " . ($inscripcion->orquidea->grupo->nombre_grupo ?? 'NULL'));
            $this->line("Clase: " . ($inscripcion->orquidea->clase->nombre_clase ?? 'NULL'));
            $this->line("---");
        }

        // Create test liston
        $this->info('2. Creating test liston...');
        $firstInscripcion = Inscripcion::first();
        if ($firstInscripcion) {
            $liston = Trofeo::create([
                'tipo_premio' => 'liston',
                'tipo_liston' => 'Primer Premio - Oro',
                'descripcion' => 'Excelente presentación de orquídea',
                'fecha_ganador' => now(),
                'id_inscripcion' => $firstInscripcion->id_nscr
            ]);
            $this->info("Listón creado con ID: {$liston->id_trofeo}");
        }

        // Test listones
        $this->info('3. Testing Listones...');
        $listones = Trofeo::listones()
            ->with(['inscripcion.participante', 'inscripcion.orquidea.grupo', 'inscripcion.orquidea.clase'])
            ->get();

        foreach ($listones as $liston) {
            $this->line("Listón ID: {$liston->id_trofeo}");
            $this->line("Tipo: {$liston->tipo_liston}");
            $this->line("Correlativo: " . ($liston->inscripcion->correlativo ?? 'NULL'));
            $this->line("Participante: " . ($liston->inscripcion->participante->nombre ?? 'NULL'));
            $this->line("Orquídea: " . ($liston->inscripcion->orquidea->nombre_planta ?? 'NULL'));
            $this->line("---");
        }

        return Command::SUCCESS;
    }
}
