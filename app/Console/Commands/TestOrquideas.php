<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Orquidea;

class TestOrquideas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:orquideas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test orquideas data';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== Verificando Orquídeas ===');

        $orquideas = Orquidea::with(['grupo', 'clase', 'participante'])->get();

        $this->info("Total de orquídeas: " . $orquideas->count());
        $this->line('');

        foreach ($orquideas as $orquidea) {
            $this->info("ID: " . $orquidea->id_orquidea);
            $this->info("Nombre: " . $orquidea->nombre_planta);
            $this->info("Origen: " . $orquidea->origen);
            $this->info("Foto: " . ($orquidea->foto ?? 'Sin foto'));
            $this->info("Cantidad: " . $orquidea->cantidad);
            $this->info("Grupo: " . ($orquidea->grupo ? $orquidea->grupo->nombre_grupo : 'Sin grupo'));
            $this->info("Clase: " . ($orquidea->clase ? $orquidea->clase->nombre_clase : 'Sin clase'));
            $this->info("Participante: " . ($orquidea->participante ? $orquidea->participante->nombre : 'Sin participante'));
            $this->line('---');
        }
    }
}
