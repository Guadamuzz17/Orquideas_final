<?php

namespace App\Exports;

use App\Models\Inscripcion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class InscripcionesExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
    public function __construct(private ?string $from = null, private ?string $to = null, private ?int $eventId = null) {}

    public function collection()
    {
        $effectiveEventId = $this->eventId ?? session('evento_activo');

        $q = Inscripcion::query()
            ->with(['participante', 'orquidea.grupo', 'orquidea.clase'])
            ->when($effectiveEventId, function ($q) use ($effectiveEventId) {
                $q->where('id_evento', $effectiveEventId);
            })
            ->orderBy('correlativo');

        return $q->get();
    }

    public function headings(): array
    {
        return [
            'Participante', 'Orquídea', 'Grupo', 'Clase', 'Origen', 'Correlativo'
        ];
    }

    public function map($ins): array
    {
        $grupoCod = '';
        if ($ins->orquidea && $ins->orquidea->grupo) {
            $grupoCod = $ins->orquidea->grupo->Cod_Grupo ?? '';
        }
        $claseNumber = '';
        if ($ins->orquidea && $ins->orquidea->clase) {
            $nombre = $ins->orquidea->clase->nombre_clase ?? '';
            if ($nombre && preg_match('/Clase\s+(\d+)/u', $nombre, $m)) {
                $claseNumber = $m[1];
            } else {
                $claseNumber = (string) ($ins->orquidea->clase->id_clase ?? '');
            }
        }

        return [
            optional($ins->participante)->nombre ?? '',
            optional($ins->orquidea)->nombre_planta ?? '',
            $grupoCod,
            $claseNumber,
            optional($ins->orquidea)->origen ?? '',
            $ins->correlativo ?? '',
        ];
    }

    public function title(): string
    {
        return 'Inscripciones';
    }
}
