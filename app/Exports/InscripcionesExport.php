<?php

namespace App\Exports;

use App\Models\Inscripcion;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class InscripcionesExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
    public function __construct(private ?string $from = null, private ?string $to = null) {}

    public function collection()
    {
        $q = Inscripcion::with(['participante', 'orquidea.grupo', 'orquidea.clase']);
        if ($this->from && $this->to) {
            $q->whereBetween('created_at', ["{$this->from} 00:00:00", "{$this->to} 23:59:59"]);
        } elseif ($this->from) {
            $q->where('created_at', '>=', "{$this->from} 00:00:00");
        } elseif ($this->to) {
            $q->where('created_at', '<=', "{$this->to} 23:59:59");
        }
        return $q->get();
    }

    public function headings(): array
    {
        return [
            'Participante', 'Orquídea', 'Grupo', 'Clase', 'Origen', 'Correlativo', 'Fecha Registro'
        ];
    }

    public function map($ins): array
    {
        $grupoLetter = '';
        if ($ins->orquidea && $ins->orquidea->grupo) {
            $grupoLetter = $ins->orquidea->grupo->Cod_Grupo ?? '';
            if (!$grupoLetter && !empty($ins->orquidea->grupo->nombre_grupo)) {
                $grupoLetter = strtoupper(substr($ins->orquidea->grupo->nombre_grupo, 0, 1));
            }
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
            $ins->participante->nombre ?? '',
            $ins->orquidea->nombre_planta ?? '',
            $grupoLetter,
            $claseNumber,
            $ins->orquidea->origen ?? '',
            $ins->correlativo ?? '',
            optional($ins->created_at)?->format('d/m/Y H:i') ?? '',
        ];
    }

    public function title(): string
    {
        return 'Inscripciones';
    }
}
