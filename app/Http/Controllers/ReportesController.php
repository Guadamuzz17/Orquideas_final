<?php

namespace App\Http\Controllers;

use App\Models\Trofeo;
use App\Models\TipoPremio;
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

            // Obtener datos para los filtros (usar los nombres de columna reales)
            $grupos = \App\Models\Grupo::orderBy('nombre_grupo')->get(['id_grupo', 'nombre_grupo'])
                ->map(function($g) {
                    return [
                        'id_grupo' => $g->id_grupo,
                        'nom_grupo' => $g->nombre_grupo,
                    ];
                });

            $clases = \App\Models\Clase::orderBy('nombre_clase')->get(['id_clase', 'nombre_clase'])
                ->map(function($c) {
                    return [
                        'id_clase' => $c->id_clase,
                        'nom_clase' => $c->nombre_clase,
                    ];
                });

            // Obtener tipos de premios activos
            $tiposPremio = TipoPremio::activos()->ordenadosPorPosicion()->get();

            return Inertia::render('Reportes/ListonesSimple', [
                'estadisticas' => [
                    'total_listones' => $totalListones,
                    'listones_por_tipo' => [],
                ],
                'listones_recientes' => [],
                'grupos' => $grupos,
                'clases' => $clases,
                'tiposPremio' => $tiposPremio,
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
                'tiposPremio' => [],
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

        // We'll build a dataset of inscripciones that have trofeos in the requested filters
        $trofeoQuery = Trofeo::query();

        if ($request->fecha_desde) {
            $trofeoQuery->whereDate('fecha_ganador', '>=', $request->fecha_desde);
        }

        if ($request->fecha_hasta) {
            $trofeoQuery->whereDate('fecha_ganador', '<=', $request->fecha_hasta);
        }

        if ($request->tipo_liston) {
            $trofeoQuery->where('tipo_liston', 'LIKE', '%' . $request->tipo_liston . '%');
        }

        $inscripcionIds = $trofeoQuery->pluck('id_inscripcion')->unique()->filter()->values()->all();

        $inscripciones = \App\Models\Inscripcion::with(['participante.aso', 'orquidea.grupo', 'orquidea.clase'])
            ->whereIn('id_nscr', $inscripcionIds)
            ->get();

        // Load tipos de premio (to build dynamic columns)
        $tiposPremio = TipoPremio::activos()->ordenadosPorPosicion()->get();

        // Prepare statistics
        $total = count($inscripciones);
        $estadisticas = [
            'total_listones' => $total,
            'fecha_generacion' => now()->format('d/m/Y H:i:s'),
            'periodo' => $this->getPeriodoTexto($request->fecha_desde, $request->fecha_hasta),
            'filtro_tipo' => $request->tipo_liston,
            'tipos_distribucion' => collect([]),
        ];

        // Build rows for the PDF view: each inscripcion with flags per tipo
        $rows = $inscripciones->map(function($ins) use ($tiposPremio) {
            $participant = optional($ins->participante)->nombre ?? 'Sin participante';
            $orquidea = optional($ins->orquidea)->nombre_planta ?? 'Sin orquídea';
            $clase = optional(optional($ins->orquidea)->clase)->nombre_clase ?? '';
            $grupo = optional(optional($ins->orquidea)->grupo)->nombre_grupo ?? '';
            $claseGrupo = trim(($clase ? $clase : '') . ($clase && $grupo ? ' / ' : '') . ($grupo ? $grupo : '')) ?: 'N/A';
            $aso = optional(optional($ins->participante)->aso)->nombre ?? 'N/A';

            $flags = [];
            foreach ($tiposPremio as $tipo) {
                $has = Trofeo::where('id_inscripcion', $ins->id_nscr)
                    ->where('id_tipo_premio', $tipo->id_tipo_premio)
                    ->exists();
                $flags[] = $has ? 'X' : '';
            }

            $listonExists = Trofeo::where('id_inscripcion', $ins->id_nscr)
                ->where('tipo_premio', 'liston')
                ->exists();

            return [
                'correlativo' => $ins->correlativo,
                'participante' => $participant,
                'orquidea' => $orquidea,
                'clase_grupo' => $claseGrupo,
                'aso' => $aso,
                'flags' => $flags,
                'liston' => $listonExists ? 'X' : '',
            ];
        });

        $pdf = Pdf::loadView('reportes.listones-pdf', compact('rows', 'estadisticas', 'tiposPremio'))
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
