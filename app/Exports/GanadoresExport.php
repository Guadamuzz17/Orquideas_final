<?php

namespace App\Exports;

use App\Models\Ganador;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class GanadoresExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
    public function __construct(private ?string $from = null, private ?string $to = null) {}

    public function collection()
    {
        $q = Ganador::with(['inscripcion.orquidea.grupo', 'inscripcion.orquidea.clase', 'inscripcion.participante.aso']);
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
            'Grupo/Clase', 'Correlativo', 'Planta', 'Propietario', 'Asociación', '1', '2', '3', 'Mención honorífica', 'Trofeos', 'Trofeos Especiales', 'AOS'
        ];
    }

    public function map($g): array
    {
        $grupoLetter = '';
        $claseNumber = '';
        $grupo = optional(optional($g->inscripcion)->orquidea)->grupo;
        if ($grupo) {
            $grupoLetter = $grupo->Cod_Grupo ?? '';
            if (!$grupoLetter && !empty($grupo->nombre_grupo)) {
                $grupoLetter = strtoupper(substr($grupo->nombre_grupo, 0, 1));
            }
        }
        $clase = optional(optional($g->inscripcion)->orquidea)->clase;
        if ($clase) {
            $nombre = $clase->nombre_clase ?? '';
            if ($nombre && preg_match('/Clase\s+(\d+)/u', $nombre, $m)) {
                $claseNumber = $m[1];
            } else {
                $claseNumber = (string) ($clase->id_clase ?? '');
            }
        }
        $grupoClase = trim(($grupoLetter ?: '') . '/' . ($claseNumber ?: ''), '/');
        $participante = optional(optional($g->inscripcion)->participante);
        $aso = optional($participante->aso)->Clase ?? '';

        return [
            $grupoClase,
            optional($g->inscripcion)->correlativo ?? '',
            optional(optional($g->inscripcion)->orquidea)->nombre_planta ?? '',
            $participante->nombre ?? '',
            $aso,
            $g->posicion == 1 ? 'X' : '',
            $g->posicion == 2 ? 'X' : '',
            $g->posicion == 3 ? 'X' : '',
            '', // Mención honorífica (pendiente reglas)
            '', // Trofeos
            '', // Trofeos Especiales
            '', // AOS
        ];
    }

    public function title(): string
    {
        return 'Ganadores';
    }
}
