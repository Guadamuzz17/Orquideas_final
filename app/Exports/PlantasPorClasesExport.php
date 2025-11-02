<?php

namespace App\Exports;

use App\Models\Inscripcion;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;

class PlantasPorClasesExport implements FromCollection, WithHeadings, WithMapping, WithTitle
{
    public function __construct(private ?string $from = null, private ?string $to = null, private ?string $clase = null) {}

    public function collection(): Collection
    {
        $q = Inscripcion::with(['orquidea.grupo', 'orquidea.clase']);
        if ($this->from && $this->to) {
            $q->whereBetween('created_at', ["{$this->from} 00:00:00", "{$this->to} 23:59:59"]);
        } elseif ($this->from) {
            $q->where('created_at', '>=', "{$this->from} 00:00:00");
        } elseif ($this->to) {
            $q->where('created_at', '<=', "{$this->to} 23:59:59");
        }
        if ($this->clase && $this->clase !== 'todas') {
            $q->whereHas('orquidea', function($qo) { $qo->where('id_clase', $this->clase); });
        }
        return $q->get();
    }

    public function headings(): array
    {
        return ['No', 'Planta', 'Grupo/Clase', 'ES', 'HI'];
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
        $origen = $ins->orquidea->origen ?? null;
        return [
            $ins->correlativo ?? '',
            $ins->orquidea->nombre_planta ?? '',
            trim(($grupoLetter ?: '') . '/' . ($claseNumber ?: ''), '/'),
            $origen === 'Especie' ? 'X' : '',
            $origen === 'Híbrida' ? 'X' : '',
        ];
    }

    public function title(): string
    {
        return 'Plantas por Clases';
    }
}
