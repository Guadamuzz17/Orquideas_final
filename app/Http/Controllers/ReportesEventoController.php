<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Inscripcion;
use App\Models\Orquidea;
use App\Models\Ganador;
use App\Models\Participante;
use App\Models\Evento;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ReportesEventoController extends Controller
{
    /**
     * Mostrar la interfaz de reportes por eventos
     */
    public function index()
    {
        $eventoActivo = session('evento_activo');
        $evento = Evento::find($eventoActivo);

        // Obtener estadísticas del evento
        $totalInscripciones = Inscripcion::where('id_evento', $eventoActivo)->count();
        $totalParticipantes = Participante::where('id_evento', $eventoActivo)->count();
        $totalOrquideas = Orquidea::where('id_evento', $eventoActivo)->count();
        $totalGanadores = Ganador::where('id_evento', $eventoActivo)->count();

        return Inertia::render('ReportesEvento/index', [
            'evento' => $evento,
            'estadisticas' => [
                'total_inscripciones' => $totalInscripciones,
                'total_participantes' => $totalParticipantes,
                'total_orquideas' => $totalOrquideas,
                'total_ganadores' => $totalGanadores,
            ]
        ]);
    }

    /**
     * PDF: Inscripciones del evento activo
     */
    public function inscripcionesPdf(Request $request)
    {
        try {
            // Obtener el ID del evento activo de la sesión
            $eventoActivo = session('evento_activo');
            if (!$eventoActivo) {
                throw new \Exception('No hay un evento activo seleccionado');
            }

            // Obtener los datos del evento
            $evento = Evento::findOrFail($eventoActivo);

            // Obtener filtros de fecha
            $from = $request->query('from');
            $to = $request->query('to');

            // Iniciar la consulta con Eloquent
            $query = Inscripcion::with([
                    'participante',
                    'orquidea.grupo',
                    'orquidea.clase'
                ])
                ->where('id_evento', $eventoActivo);

            // Aplicar filtros de fecha si existen
            if ($from && $to) {
                $query->whereBetween('created_at', [
                    \Carbon\Carbon::parse($from)->startOfDay(),
                    \Carbon\Carbon::parse($to)->endOfDay()
                ]);
            } elseif ($from) {
                $query->where('created_at', '>=', \Carbon\Carbon::parse($from)->startOfDay());
            } elseif ($to) {
                $query->where('created_at', '<=', \Carbon\Carbon::parse($to)->endOfDay());
            }

            // Obtener las inscripciones ordenadas por correlativo
            $inscripciones = $query->orderBy('correlativo')->get();

            if ($inscripciones->isEmpty()) {
                throw new \Exception('No se encontraron inscripciones para el evento ' . $evento->nombre_evento);
            }

            // Procesar los datos para el reporte
            $datosReporte = $inscripciones->map(function($inscripcion) {
                $orquidea = $inscripcion->orquidea;
                $participante = $inscripcion->participante;

                $grupo = $orquidea ? ($orquidea->grupo ?? null) : null;
                $clase = $orquidea ? ($orquidea->clase ?? null) : null;

                // Obtener el código del grupo
                $codigoGrupo = $grupo ? ($grupo->Cod_Grupo ?? '') : '';

                // Obtener el número de clase
                $numeroClase = '';
                if ($clase && !empty($clase->nombre_clase) && preg_match('/Clase\s+(\d+)/', $clase->nombre_clase, $matches)) {
                    $numeroClase = $matches[1];
                }

                return [
                    'participante' => $participante ? ($participante->nombre ?? 'Sin nombre') : 'Participante no encontrado',
                    'orquidea' => $orquidea ? ($orquidea->nombre_planta ?? 'Sin nombre') : 'Orquídea no encontrada',
                    'grupo' => $codigoGrupo,
                    'clase' => $numeroClase,
                    'origen' => $orquidea ? ($orquidea->origen ?? 'No especificado') : 'N/A',
                    'correlativo' => $inscripcion->correlativo ?? 'N/A'
                ];
            });

            // Cargar la vista con los datos
            $pdf = Pdf::loadView('reportes.inscripciones', [
                'inscripciones' => $datosReporte,
                'evento' => $evento,
                'fechaInicio' => $from,
                'fechaFin' => $to,
                'titulo' => 'REPORTE DE INSCRIPCIONES'
            ]);

            $pdf->setPaper('letter', 'portrait');
            return $pdf->stream('Inscripciones_' . $evento->nombre_evento . '.pdf');

        } catch (\Exception $e) {
            Log::error('Error al generar el reporte: ' . $e->getMessage());
            Log::error($e->getTraceAsString());            // Crear un PDF de error para diagnóstico
            $pdf = Pdf::loadView('reportes.error', [
                'error' => $e->getMessage(),
                'detalles' => 'Revise los logs para más información.'
            ]);

            return $pdf->stream('Error_Reporte.pdf');
        }
    }

    /**
     * PDF: Listado de plantas por clases del evento activo
     */
    public function plantasPorClasesPdf(Request $request)
    {
        $eventoActivo = session('evento_activo');
        $evento = Evento::find($eventoActivo);

        $orquideas = Orquidea::with(['grupo', 'clase', 'participante'])
            ->where('id_evento', $eventoActivo)
            ->take(30)
            ->get();

        $data = $orquideas->map(function ($orq) {
            $grupoLetter = '';
            if ($orq->grupo) {
                $grupoLetter = $orq->grupo->Cod_Grupo ?? '';
                if (!$grupoLetter && !empty($orq->grupo->nombre_grupo)) {
                    $grupoLetter = strtoupper(substr($orq->grupo->nombre_grupo, 0, 1));
                }
            }

            $claseNumber = '';
            if ($orq->clase) {
                $nombre = $orq->clase->nombre_clase ?? '';
                if ($nombre && preg_match('/Clase\s+(\d+)/u', $nombre, $m)) {
                    $claseNumber = $m[1];
                }
            }

            return [
                'grupo' => $grupoLetter,
                'clase' => $claseNumber,
                'nombre_planta' => $orq->nombre_planta ?? '',
                'nombre_participante' => $orq->participante->nombre ?? '',
            ];
        })->sortBy(function ($item) {
            return [$item['grupo'], $item['clase']];
        })->values();

        $pdf = Pdf::loadView('reportes.plantas_por_clases', [
            'orquideas' => $data,
            'evento' => $evento,
        ]);

        $pdf->setPaper('letter', 'portrait');
        return $pdf->stream('Plantas_Por_Clases_' . $evento->nombre_evento . '.pdf');
    }

    /**
     * PDF: Ganadores del evento activo
     */
    public function ganadoresPdf(Request $request)
    {
        $eventoActivo = session('evento_activo');
        $evento = Evento::find($eventoActivo);

        $ganadores = Ganador::with([
            'inscripcion.participante',
            'inscripcion.orquidea.grupo',
            'inscripcion.orquidea.clase'
        ])
        ->where('id_evento', $eventoActivo)
        ->orderBy('posicion')
        ->take(30)
        ->get();

        $data = $ganadores->map(function ($ganador) {
            $grupoLetter = '';
            $claseNumber = '';

            if ($ganador->inscripcion && $ganador->inscripcion->orquidea) {
                $orq = $ganador->inscripcion->orquidea;

                if ($orq->grupo) {
                    $grupoLetter = $orq->grupo->Cod_Grupo ?? '';
                    if (!$grupoLetter && !empty($orq->grupo->nombre_grupo)) {
                        $grupoLetter = strtoupper(substr($orq->grupo->nombre_grupo, 0, 1));
                    }
                }

                if ($orq->clase) {
                    $nombre = $orq->clase->nombre_clase ?? '';
                    if ($nombre && preg_match('/Clase\s+(\d+)/u', $nombre, $m)) {
                        $claseNumber = $m[1];
                    }
                }
            }

            return [
                'posicion' => $ganador->posicion,
                'correlativo' => $ganador->inscripcion->correlativo ?? '',
                'grupo' => $grupoLetter,
                'clase' => $claseNumber,
                'nombre_planta' => $ganador->inscripcion->orquidea->nombre_planta ?? '',
                'nombre_participante' => $ganador->inscripcion->participante->nombre ?? '',
                'empate' => $ganador->empate,
            ];
        });

        $pdf = Pdf::loadView('reportes.ganadores', [
            'ganadores' => $data,
            'evento' => $evento,
        ]);

        $pdf->setPaper('letter', 'landscape');
        return $pdf->stream('Ganadores_' . $evento->nombre_evento . '.pdf');
    }

    /**
     * PDF: Orquídeas asignadas a participantes
     */
    public function participantesOrquideasPdf(Request $request)
    {
        $eventoActivo = session('evento_activo');
        $evento = Evento::find($eventoActivo);

        if (!$evento) {
            return back()->with('error', 'No se encontró el evento especificado');
        }

        $orquideas = Orquidea::with(['grupo', 'clase', 'participante'])
            ->where('id_evento', $eventoActivo)
            ->whereNotNull('id_participante')
            ->orderBy('nombre_planta')
            ->get();

        $pdf = Pdf::loadView('reportes.participantes_orquideas', [
            'orquideas' => $orquideas,
            'evento' => $evento
        ]);

        return $pdf->stream('Orquideas_Asignadas_' . $evento->nombre_evento . '.pdf');
    }

    /**
     * Vista previa de inscripciones (primeros 10 registros)
     */
    public function previewInscripciones(Request $request)
    {
        $eventoActivo = session('evento_activo');

        $inscripciones = Inscripcion::with(['participante', 'orquidea.grupo', 'orquidea.clase'])
            ->where('id_evento', $eventoActivo)
            ->orderBy('correlativo')
            ->take(10)
            ->get()
            ->map(function ($ins) {
                return [
                    'correlativo' => $ins->correlativo,
                    'grupo' => $ins->orquidea?->grupo?->Cod_Grupo ?? '',
                    'clase' => $ins->orquidea?->clase?->nombre_clase ?? '',
                    'nombre_planta' => $ins->orquidea?->nombre_planta ?? '',
                    'participante' => $ins->participante?->nombre ?? '',
                ];
            });

        return response()->json($inscripciones);
    }

    /**
     * Vista previa de ganadores (primeros 10 registros)
     */
    public function previewGanadores(Request $request)
    {
        $eventoActivo = session('evento_activo');

        $ganadores = Ganador::with(['inscripcion.participante', 'inscripcion.orquidea.grupo', 'inscripcion.orquidea.clase'])
            ->where('id_evento', $eventoActivo)
            ->orderBy('posicion')
            ->take(10)
            ->get()
            ->map(function ($g) {
                return [
                    'posicion' => $g->posicion,
                    'correlativo' => $g->inscripcion?->correlativo ?? '',
                    'nombre_planta' => $g->inscripcion?->orquidea?->nombre_planta ?? '',
                    'participante' => $g->inscripcion?->participante?->nombre ?? '',
                    'empate' => $g->empate ? 'Sí' : 'No',
                ];
            });

        return response()->json($ganadores);
    }

    /**
     * Vista previa de plantas por clases (primeros 10 registros)
     */
    public function previewPlantasPorClases(Request $request)
    {
        $eventoActivo = session('evento_activo');

        $orquideas = Orquidea::with(['grupo', 'clase', 'participante'])
            ->where('id_evento', $eventoActivo)
            ->orderBy('id_grupo')
            ->take(10)
            ->get()
            ->map(function ($orq) {
                return [
                    'grupo' => $orq->grupo?->Cod_Grupo ?? '',
                    'clase' => $orq->clase?->nombre_clase ?? '',
                    'nombre_planta' => $orq->nombre_planta ?? '',
                    'participante' => $orq->participante?->nombre ?? '',
                ];
            });

        return response()->json($orquideas);
    }

    /**
     * Vista previa de participantes y orquídeas (primeros 5 participantes)
     */
    public function previewParticipantesOrquideas(Request $request)
    {
        $eventoActivo = session('evento_activo');

        $participantes = Participante::with(['orquideas.grupo', 'orquideas.clase'])
            ->where('id_evento', $eventoActivo)
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'participante' => $p->nombre,
                    'total_orquideas' => $p->orquideas->count(),
                    'orquideas' => $p->orquideas->take(3)->map(function ($orq) {
                        return [
                            'nombre_planta' => $orq->nombre_planta,
                            'grupo' => $orq->grupo?->nombre_grupo ?? '',
                            'clase' => $orq->clase?->nombre_clase ?? '',
                        ];
                    })
                ];
            });

        return response()->json($participantes);
    }

    /**
     * PDF: Inscripciones por participante específico
     */
    public function inscripcionesPorParticipantePdf(Request $request)
    {
        $eventoActivo = session('evento_activo');
        $evento = Evento::find($eventoActivo);
        $participanteId = $request->query('participante_id');

        $participante = Participante::find($participanteId);

        $inscripciones = Inscripcion::with(['orquidea.grupo', 'orquidea.clase'])
            ->where('id_evento', $eventoActivo)
            ->where('id_participante', $participanteId)
            ->orderBy('correlativo')
            ->get()
            ->map(function ($ins) {
                return [
                    'correlativo' => $ins->correlativo,
                    'grupo' => $ins->orquidea?->grupo?->Cod_Grupo ?? '',
                    'clase' => $ins->orquidea?->clase?->nombre_clase ?? '',
                    'nombre_planta' => $ins->orquidea?->nombre_planta ?? '',
                    'origen' => $ins->orquidea?->origen ?? '',
                ];
            });

        $pdf = Pdf::loadView('reportes.inscripciones_participante', [
            'inscripciones' => $inscripciones,
            'evento' => $evento,
            'participante' => $participante,
        ]);

        $pdf->setPaper('letter', 'portrait');
        return $pdf->stream('Inscripciones_' . $participante->nombre . '_' . $evento->nombre_evento . '.pdf');
    }
}
