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

        return Inertia::render('ReportesEvento/index', [
            'evento' => $evento
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
}
