<?php

namespace App\Exports;

use App\Models\Trofeo;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ListonesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithTitle
{
    protected $dateFrom;
    protected $dateTo;
    protected $tipoListon;
    protected $idGrupo;
    protected $idClase;

    public function __construct($dateFrom = null, $dateTo = null, $tipoListon = null, $idGrupo = null, $idClase = null)
    {
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
        $this->tipoListon = $tipoListon;
        $this->idGrupo = $idGrupo;
        $this->idClase = $idClase;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $query = Trofeo::listones()
            ->with(['inscripcion.participante', 'inscripcion.orquidea.grupo', 'inscripcion.orquidea.clase'])
            ->orderBy('fecha_ganador', 'desc')
            ->orderBy('tipo_liston', 'asc');

        // Filtros opcionales
        if ($this->dateFrom) {
            $query->whereDate('fecha_ganador', '>=', $this->dateFrom);
        }

        if ($this->dateTo) {
            $query->whereDate('fecha_ganador', '<=', $this->dateTo);
        }

        if ($this->tipoListon) {
            $query->where('tipo_liston', 'LIKE', '%' . $this->tipoListon . '%');
        }

        // Filtros por grupo y clase a través de la relación con orquídea
        if ($this->idGrupo) {
            $query->whereHas('inscripcion.orquidea', function($q) {
                $q->where('id_grupo', $this->idGrupo);
            });
        }

        if ($this->idClase) {
            $query->whereHas('inscripcion.orquidea', function($q) {
                $q->where('id_clase', $this->idClase);
            });
        }

        return $query->get();
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        return [
            'No. Correlativo',
            'Participante',
            'Orquídea',
            'Grupo',
            'Clase',
            'Tipo de Listón',
            'Descripción',
            'Fecha Otorgado',
        ];
    }

    /**
     * @param mixed $liston
     * @return array
     */
    public function map($liston): array
    {
        return [
            $liston->inscripcion->correlativo ?? 'N/A',
            $liston->inscripcion->participante->nombre ?? 'Sin participante',
            $liston->inscripcion->orquidea->nombre_planta ?? 'Sin orquídea',
            $liston->inscripcion->orquidea->grupo->nombre_grupo ?? 'Sin grupo',
            $liston->inscripcion->orquidea->clase->nombre_clase ?? 'Sin clase',
            $liston->tipo_liston,
            $liston->descripcion ?? '',
            $liston->fecha_ganador->format('d/m/Y'),
        ];
    }

    /**
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo para encabezados
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size' => 12,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '2D5A27'], // Verde oscuro
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
            ],
            // Estilo para todas las celdas con datos
            'A:H' => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CCCCCC'],
                    ],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }

    /**
     * @return array
     */
    public function columnWidths(): array
    {
        return [
            'A' => 15, // Correlativo
            'B' => 25, // Participante
            'C' => 30, // Orquídea
            'D' => 25, // Grupo
            'E' => 25, // Clase
            'F' => 20, // Tipo Listón
            'G' => 35, // Descripción
            'H' => 15, // Fecha
        ];
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Listones y Menciones';
    }
}
