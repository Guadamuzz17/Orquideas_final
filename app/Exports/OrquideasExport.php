<?php

namespace App\Exports;

use App\Models\Orquidea;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class OrquideasExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithTitle
{
    protected $eventoActivo;

    public function __construct($eventoActivo)
    {
        $this->eventoActivo = $eventoActivo;
    }

    /**
     * Obtener la colección de datos
     */
    public function collection()
    {
        return Orquidea::with(['grupo', 'clase', 'participante', 'inscripcion'])
            ->where('id_evento', $this->eventoActivo)
            ->orderBy('id_grupo')
            ->orderBy('id_clase')
            ->get();
    }

    /**
     * Encabezados de la tabla
     */
    public function headings(): array
    {
        return [
            'ID',
            'Correlativo',
            'Nombre de la Planta',
            'Origen',
            'Grupo',
            'Clase',
            'Cantidad',
            'Participante',
            'Fecha de Registro'
        ];
    }

    /**
     * Mapear cada fila
     */
    public function map($orquidea): array
    {
        return [
            $orquidea->id_orquidea,
            $orquidea->inscripcion->correlativo ?? 'N/A',
            $orquidea->nombre_planta,
            $orquidea->origen,
            $orquidea->grupo->nombre_grupo ?? 'N/A',
            $orquidea->clase->nombre_clase ?? 'N/A',
            $orquidea->cantidad,
            $orquidea->participante->nombre ?? 'N/A',
            $orquidea->created_at ? $orquidea->created_at->format('d/m/Y H:i') : 'N/A'
        ];
    }

    /**
     * Estilos de la hoja
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo del encabezado
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 12,
                    'color' => ['rgb' => 'FFFFFF']
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4']
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],
        ];
    }

    /**
     * Ancho de columnas
     */
    public function columnWidths(): array
    {
        return [
            'A' => 8,   // ID
            'B' => 12,  // Correlativo
            'C' => 40,  // Nombre Planta
            'D' => 15,  // Origen
            'E' => 20,  // Grupo
            'F' => 30,  // Clase
            'G' => 10,  // Cantidad
            'H' => 35,  // Participante
            'I' => 20,  // Fecha
        ];
    }

    /**
     * Título de la hoja
     */
    public function title(): string
    {
        return 'Orquídeas Inscritas';
    }
}
