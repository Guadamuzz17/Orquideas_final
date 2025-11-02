<?php

namespace App\Exports;

use App\Models\Participante;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class ParticipantesOrquideasExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
    public function collection()
    {
        return Participante::with(['orquideas.grupo', 'orquideas.clase'])
            ->orderBy('nombre')
            ->get();
    }

    public function headings(): array
    {
        return ['Participante', 'Teléfono', 'Dirección', 'Orquídeas', 'Origen', 'Grupos', 'Clases'];
    }

    public function map($p): array
    {
        $nombres = $p->orquideas->pluck('nombre_planta')->filter()->values()->all();
        $origenes = $p->orquideas->pluck('origen')->filter()->unique()->values()->all();
        $grupos = $p->orquideas->map(function ($o) {
            $g = optional($o->grupo);
            $letter = $g->Cod_Grupo ?? '';
            if (!$letter && !empty($g->nombre_grupo)) {
                $letter = strtoupper(substr($g->nombre_grupo, 0, 1));
            }
            return $letter ?: null;
        })->filter()->unique()->values()->all();
        $clases = $p->orquideas->map(function ($o) {
            $c = optional($o->clase);
            $nombre = $c->nombre_clase ?? '';
            $num = '';
            if ($nombre && preg_match('/Clase\s+(\d+)/u', $nombre, $m)) {
                $num = $m[1];
            } elseif (!empty($c->id_clase)) {
                $num = (string) $c->id_clase;
            }
            return $num ?: null;
        })->filter()->unique()->values()->all();

        return [
            $p->nombre ?? '',
            $p->numero_telefonico ?? '',
            $p->direccion ?? '',
            implode(', ', $nombres),
            implode(', ', $origenes),
            implode(', ', $grupos),
            implode(', ', $clases),
        ];
    }

    public function title(): string
    {
        return 'Participantes y Orquídeas';
    }
}
