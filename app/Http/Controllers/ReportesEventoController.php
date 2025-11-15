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
        $eventoActivo = session('evento_activo');
        $evento = Evento::find($eventoActivo);

        $from = $request->query('from');
        $to = $request->query('to');

        $query = Inscripcion::query()
            ->with(['participante', 'orquidea.grupo', 'orquidea.clase'])
            ->where('id_evento', $eventoActivo);

        if ($from && $to) {
            $query->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59']);
        } elseif ($from) {
            $query->where('created_at', '>=', $from . ' 00:00:00');
        } elseif ($to) {
            $query->where('created_at', '<=', $to . ' 23:59:59');
        }

        $inscripciones = $query->get();

        $rows = $inscripciones->filter(function ($ins) {
            return $ins->orquidea && $ins->participante && ($ins->orquidea->id_participante == $ins->id_participante);
        })->map(function ($ins) {
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
                }
            }

            return [
                'correlativo' => $ins->correlativo,
                'grupo' => $grupoLetter,
                'clase' => $claseNumber,
                'nombre_planta' => $ins->orquidea->nombre_planta ?? '',
                'nombre_participante' => $ins->participante->nombre ?? '',
            ];
        })->sortBy('correlativo')->values();

        $pdf = Pdf::loadView('reportes.inscripciones', [
            'inscripciones' => $rows,
            'evento' => $evento,
            'fechaInicio' => $from,
            'fechaFin' => $to,
        ]);

        $pdf->setPaper('letter', 'portrait');
        return $pdf->stream('Inscripciones_' . $evento->nombre_evento . '.pdf');
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
     * PDF: Participantes y sus orquídeas del evento activo
     */
    public function participantesOrquideasPdf(Request $request)
    {
        $eventoActivo = session('evento_activo');
        $evento = Evento::find($eventoActivo);

        $participantes = Participante::with(['orquideas.grupo', 'orquideas.clase'])
            ->where('id_evento', $eventoActivo)
            ->get();

        $data = $participantes->map(function ($participante) {
            $orquideas = $participante->orquideas->map(function ($orq) {
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
                    'nombre_planta' => $orq->nombre_planta,
                    'grupo' => $grupoLetter,
                    'clase' => $claseNumber,
                ];
            });

            return [
                'nombre_participante' => $participante->nombre,
                'orquideas' => $orquideas,
            ];
        });

        $pdf = Pdf::loadView('reportes.participantes_orquideas', [
            'participantes' => $data,
            'evento' => $evento,
        ]);

        $pdf->setPaper('letter', 'portrait');
        return $pdf->stream('Participantes_Orquideas_' . $evento->nombre_evento . '.pdf');
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
