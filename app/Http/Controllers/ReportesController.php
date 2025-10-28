<?php

namespace App\Http\Controllers;

use App\Models\Trofeo;
use App\Exports\ListonesExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class ReportesController extends Controller
{
    /**
     * Display the reports index page
     */
    public function index()
    {
        // Prueba simple sin consultas complejas
        try {
            $totalListones = Trofeo::where('tipo_premio', 'liston')->count();

            // Obtener datos para los filtros
            $grupos = \App\Models\Grupo::orderBy('nom_grupo')->get(['id_grupo', 'nom_grupo']);
            $clases = \App\Models\Clase::orderBy('nom_clase')->get(['id_clase', 'nom_clase']);

            return Inertia::render('Reportes/ListonesSimple', [
                'estadisticas' => [
                    'total_listones' => $totalListones,
                    'listones_por_tipo' => [],
                ],
                'listones_recientes' => [],
                'grupos' => $grupos,
                'clases' => $clases,
            ]);
        } catch (\Exception $e) {
            Log::error('Error en reportes/listones: ' . $e->getMessage());

            return Inertia::render('Reportes/ListonesSimple', [
                'estadisticas' => [
                    'total_listones' => 0,
                    'listones_por_tipo' => [],
                ],
                'listones_recientes' => [],
                'grupos' => [],
                'clases' => [],
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Export listones to Excel
     */
    public function exportExcel(Request $request)
    {
        try {
            // Log para debugging
            Log::info('Iniciando exportación Excel', ['request' => $request->all()]);

            $request->validate([
                'fecha_desde' => 'nullable|date',
                'fecha_hasta' => 'nullable|date|after_or_equal:fecha_desde',
                'tipo_liston' => 'nullable|string',
                'id_grupo' => 'nullable|integer',
                'id_clase' => 'nullable|integer',
            ]);

            $fechaDesde = $request->fecha_desde;
            $fechaHasta = $request->fecha_hasta;
            $tipoListon = $request->tipo_liston;
            $idGrupo = $request->id_grupo;
            $idClase = $request->id_clase;

            Log::info('Filtros aplicados', [
                'fecha_desde' => $fechaDesde,
                'fecha_hasta' => $fechaHasta,
                'tipo_liston' => $tipoListon,
                'id_grupo' => $idGrupo,
                'id_clase' => $idClase
            ]);

            $filename = 'listones_menciones_' . now()->format('Y-m-d_H-i-s') . '.xlsx';

            $export = new ListonesExport($fechaDesde, $fechaHasta, $tipoListon, $idGrupo, $idClase);

            Log::info('Export creado, iniciando descarga');

            return Excel::download($export, $filename);

        } catch (\Exception $e) {
            Log::error('Error en exportExcel: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            // Return JSON response instead of redirect for AJAX requests
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'error' => 'Error al generar el archivo Excel: ' . $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Error al generar el archivo Excel: ' . $e->getMessage());
        }
    }

    /**
     * Export listones to PDF
     */
    public function exportPdf(Request $request)
    {
        $request->validate([
            'fecha_desde' => 'nullable|date',
            'fecha_hasta' => 'nullable|date|after_or_equal:fecha_desde',
            'tipo_liston' => 'nullable|string',
        ]);

        $query = Trofeo::listones()
            ->with(['inscripcion.participante', 'inscripcion.orquidea.grupo', 'inscripcion.orquidea.clase'])
            ->orderBy('fecha_ganador', 'desc')
            ->orderBy('tipo_liston', 'asc');

        // Aplicar filtros
        if ($request->fecha_desde) {
            $query->whereDate('fecha_ganador', '>=', $request->fecha_desde);
        }

        if ($request->fecha_hasta) {
            $query->whereDate('fecha_ganador', '<=', $request->fecha_hasta);
        }

        if ($request->tipo_liston) {
            $query->where('tipo_liston', 'LIKE', '%' . $request->tipo_liston . '%');
        }

        $listones = $query->get();

        // Estadísticas para el reporte
        $estadisticas = [
            'total_listones' => $listones->count(),
            'fecha_generacion' => now()->format('d/m/Y H:i:s'),
            'periodo' => $this->getPeriodoTexto($request->fecha_desde, $request->fecha_hasta),
            'filtro_tipo' => $request->tipo_liston,
            'tipos_distribucion' => $listones->groupBy('tipo_liston')->map->count(),
        ];

        $pdf = Pdf::loadView('reportes.listones-pdf', compact('listones', 'estadisticas'))
            ->setPaper('a4', 'landscape')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isPhpEnabled' => true,
                'defaultFont' => 'Arial',
            ]);

        $filename = 'reporte_listones_' . now()->format('Y-m-d_H-i-s') . '.pdf';

        return $pdf->download($filename);
    }

    /**
     * Get data for charts and statistics
     */
    public function getEstadisticas(Request $request)
    {
        $fechaDesde = $request->fecha_desde;
        $fechaHasta = $request->fecha_hasta;

        $query = Trofeo::listones();

        if ($fechaDesde) {
            $query->whereDate('fecha_ganador', '>=', $fechaDesde);
        }

        if ($fechaHasta) {
            $query->whereDate('fecha_ganador', '<=', $fechaHasta);
        }

        // Listones por tipo
        $listonesPorTipo = $query->clone()
            ->selectRaw('tipo_liston, COUNT(*) as total')
            ->groupBy('tipo_liston')
            ->pluck('total', 'tipo_liston');

        // Listones por mes
        $listonesPorMes = $query->clone()
            ->selectRaw('YEAR(fecha_ganador) as año, MONTH(fecha_ganador) as mes, COUNT(*) as total')
            ->groupBy('año', 'mes')
            ->orderBy('año', 'desc')
            ->orderBy('mes', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'periodo' => Carbon::create($item->año, $item->mes)->format('M Y'),
                    'total' => $item->total,
                ];
            });

        return response()->json([
            'listones_por_tipo' => $listonesPorTipo,
            'listones_por_mes' => $listonesPorMes,
            'total_general' => $query->count(),
        ]);
    }

    /**
     * Helper method to generate period text
     */
    private function getPeriodoTexto($fechaDesde, $fechaHasta)
    {
        if (!$fechaDesde && !$fechaHasta) {
            return 'Todos los períodos';
        }

        if ($fechaDesde && !$fechaHasta) {
            return 'Desde ' . Carbon::parse($fechaDesde)->format('d/m/Y');
        }

        if (!$fechaDesde && $fechaHasta) {
            return 'Hasta ' . Carbon::parse($fechaHasta)->format('d/m/Y');
        }

        return Carbon::parse($fechaDesde)->format('d/m/Y') . ' - ' . Carbon::parse($fechaHasta)->format('d/m/Y');
    }
}
