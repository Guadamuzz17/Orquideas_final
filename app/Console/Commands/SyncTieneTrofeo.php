<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Trofeo;
use App\Models\TipoPremio;

class SyncTieneTrofeo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orquideas:sync-tiene-trofeo {--create-trofeo : Create missing trofeo records for primer lugar}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync the tiene_trofeo flag on listón records and optionally create missing trofeo records for primer lugar';

    public function handle()
    {
        $this->info('Starting sync of tiene_trofeo...');

        $listones = Trofeo::where('tipo_premio', 'liston')->get();
        $count = 0;

        foreach ($listones as $liston) {
            $inscripcionId = $liston->id_inscripcion;

            $trofeoExists = Trofeo::where('id_inscripcion', $inscripcionId)
                ->where('tipo_premio', 'trofeo')
                ->exists();

            $tipo = null;
            if ($liston->id_tipo_premio) {
                $tipo = TipoPremio::find($liston->id_tipo_premio);
            }

            $shouldHaveTrofeo = $trofeoExists || ($tipo && $tipo->posicion == 1);

            if ($shouldHaveTrofeo && !$liston->tiene_trofeo) {
                $liston->tiene_trofeo = true;
                $liston->save();
                $count++;
            }

            // Optionally create a trofeo record when primer lugar and not exists
            if ($this->option('create-trofeo') && $tipo && $tipo->posicion == 1 && ! $trofeoExists) {
                Trofeo::create([
                    'id_inscripcion' => $inscripcionId,
                    'tipo_premio' => 'trofeo',
                    'id_tipo_premio' => $liston->id_tipo_premio,
                    'descripcion' => $liston->descripcion ? $liston->descripcion . ' (Trofeo sync)' : 'Trofeo por primer lugar (sync)',
                    'fecha_ganador' => $liston->fecha_ganador ?? now(),
                ]);
                $this->info('Created trofeo for inscripcion ' . $inscripcionId);
            }
        }

        $this->info("Sync complete. Updated {$count} listón records.");

        return 0;
    }
}
