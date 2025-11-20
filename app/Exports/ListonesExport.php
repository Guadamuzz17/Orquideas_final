<?php

namespace App\Exports;

use App\Models\Trofeo;
use App\Models\TipoPremio;
use App\Models\Inscripcion;
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
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;

class ListonesExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithTitle
{
    protected $dateFrom;
    protected $dateTo;
    protected $tipoListon;
    protected $idGrupo;
    protected $idClase;
    protected $tiposPremio;

    public function __construct($dateFrom = null, $dateTo = null, $tipoListon = null, $idGrupo = null, $idClase = null)
    {
        $this->dateFrom = $dateFrom;
        $this->dateTo = $dateTo;
        $this->tipoListon = $tipoListon;
        $this->idGrupo = $idGrupo;
        $this->idClase = $idClase;

        // Load prize types for dynamic columns
        $this->tiposPremio = TipoPremio::activos()->ordenadosPorPosicion()->get();
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        // We want one row per inscripción/orquídea with dynamic columns for each TipoPremio.
        $trofeoQuery = Trofeo::query();

        // Apply date filters to trofeos
        if ($this->dateFrom) {
            $trofeoQuery->whereDate('fecha_ganador', '>=', $this->dateFrom);
        }

        if ($this->dateTo) {
            $trofeoQuery->whereDate('fecha_ganador', '<=', $this->dateTo);
        }

        // Apply group/class filters via inscription->orquidea relation
        if ($this->idGrupo) {
            $trofeoQuery->whereHas('inscripcion.orquidea', function($q) {
                $q->where('id_grupo', $this->idGrupo);
            });
        }

        if ($this->idClase) {
            $trofeoQuery->whereHas('inscripcion.orquidea', function($q) {
                $q->where('id_clase', $this->idClase);
            });
        }

        // Get distinct inscription ids that have trofeos in the filtered set
        $inscripcionIds = $trofeoQuery->pluck('id_inscripcion')->unique()->filter()->values()->all();

        // Load inscripciones with related participant, association and orquidea data
        $inscripciones = Inscripcion::with(['participante.aso', 'orquidea.grupo', 'orquidea.clase'])
            ->whereIn('id_nscr', $inscripcionIds)
            ->get();

        return $inscripciones;
    }

    /**
     * @return array
     */
    public function headings(): array
    {
        $headings = [
            'Participante',
            'Orquídea',
            'Clase/Grupo',
            'Asociación',
        ];

        foreach ($this->tiposPremio as $tipo) {
            $headings[] = $tipo->nombre_premio;
        }

        // Add a general Listón column
        $headings[] = 'Listón';

        return $headings;
    }

    /**
     * @param mixed $liston
     * @return array
     */
    public function map($inscripcion): array
    {
        $participant = optional($inscripcion->participante)->nombre ?? 'Sin participante';
        $orquidea = optional($inscripcion->orquidea)->nombre_planta ?? 'Sin orquídea';
        $clase = optional(optional($inscripcion->orquidea)->clase)->nombre_clase ?? '';
        $grupo = optional(optional($inscripcion->orquidea)->grupo)->nombre_grupo ?? '';
        $claseGrupo = trim(($clase ? $clase : '') . ($clase && $grupo ? ' / ' : '') . ($grupo ? $grupo : '')) ?: 'N/A';
        $aso = optional(optional($inscripcion->participante)->aso)->nombre ?? 'N/A';

        $row = [
            $participant,
            $orquidea,
            $claseGrupo,
            $aso,
        ];

        // For each prize type, mark X if there is a trofeo/liston with that tipo_premio
        foreach ($this->tiposPremio as $tipo) {
            $has = Trofeo::where('id_inscripcion', $inscripcion->id_nscr)
                ->where('id_tipo_premio', $tipo->id_tipo_premio)
                ->exists();

            $row[] = $has ? 'X' : '';
        }

        // General Listón column: check if any record with tipo_premio='liston' exists
        $listonExists = Trofeo::where('id_inscripcion', $inscripcion->id_nscr)
            ->where('tipo_premio', 'liston')
            ->exists();

        $row[] = $listonExists ? 'X' : '';

        return $row;
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
            // Apply border/alignment styles to a broad range; concrete range will vary with dynamic columns
            'A:Z' => [
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
        // Base widths for first columns
        $widths = [
            'A' => 25, // Participante
            'B' => 35, // Orquídea
            'C' => 25, // Clase/Grupo
            'D' => 20, // Asociación
        ];

        // Add widths for dynamic prize columns
        $colIndex = 5; // starting at E
        foreach ($this->tiposPremio as $tipo) {
            $colLetter = Coordinate::stringFromColumnIndex($colIndex);
            $widths[$colLetter] = 8; // narrow column for X
            $colIndex++;
        }

        // Final Listón column
        $finalLetter = Coordinate::stringFromColumnIndex($colIndex);
        $widths[$finalLetter] = 8;

        return $widths;
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return 'Listones y Menciones';
    }
}
