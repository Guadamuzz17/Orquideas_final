<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Inscripcion;
use App\Models\Orquidea;
use App\Models\Ganador;
use App\Models\Participante;
use App\Models\TipoPremio;
use App\Models\Trofeo;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\InscripcionesExport;
use App\Exports\PlantasPorClasesExport;
use App\Exports\GanadoresExport;
use App\Exports\ParticipantesOrquideasExport;
use App\Models\Evento;

class ReporteController extends Controller
{
    public function inscripcionesPdf(Request $request)
    {
        $eventId = $request->query('event_id') ?? session('evento_activo');

        // Basar el reporte en Inscripcion y filtrar solo por id_evento
        $query = Inscripcion::query()
            ->with(['participante', 'orquidea.grupo', 'orquidea.clase'])
            ->when($eventId, function ($q) use ($eventId) {
                $q->where('id_evento', $eventId);
            })
            ->orderBy('correlativo');

        $inscripciones = $query->get();

        $rows = $inscripciones->map(function ($ins) {
            $grupoCod = '';
            if ($ins->orquidea && $ins->orquidea->grupo) {
                $grupoCod = $ins->orquidea->grupo->Cod_Grupo ?? '';
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

            return [
                'participante' => optional($ins->participante)->nombre,
                'orquidea' => optional($ins->orquidea)->nombre_planta,
                'grupo' => $grupoCod,
                'clase' => $claseNumber,
                'origen' => optional($ins->orquidea)->origen,
                'correlativo' => $ins->correlativo ?? '',
            ];
        })->values()->toArray();

        $data = [
            'from' => null,
            'to' => null,
            'rows' => $rows,
        ];

        $pdf = Pdf::loadView('reportes.inscripciones', $data)->setPaper('letter', 'portrait');

        return $pdf->stream('reporte_inscripciones.pdf');
    }

    public function plantasPorClasesPdf(Request $request)
    {
        $claseId = $request->query('clase'); // puede ser 'todas' o un id
        $eventId = $request->query('event_id') ?? session('evento_activo');

        // Basado en Inscripcion: filtrar por evento y opcionalmente por clase de la orquídea
        $query = Inscripcion::query()
            ->with(['orquidea.grupo', 'orquidea.clase'])
            ->when($eventId, function ($q) use ($eventId) {
                $q->where('id_evento', $eventId);
            })
            ->when($claseId && $claseId !== 'todas', function ($q) use ($claseId) {
                $q->whereHas('orquidea', function ($qo) use ($claseId) {
                    $qo->where('id_clase', $claseId);
                });
            })
            ->orderBy('correlativo');

        $inscripciones = $query->get();

        $rows = $inscripciones->map(function ($ins) {
            $grupoCod = '';
            $claseNumber = '';
            $orq = $ins->orquidea;
            if ($orq && $orq->grupo) {
                $grupoCod = $orq->grupo->Cod_Grupo ?? '';
            }
            if ($orq && $orq->clase) {
                $nombre = $orq->clase->nombre_clase ?? '';
                if ($nombre && preg_match('/Clase\s+(\d+)/u', $nombre, $m)) {
                    $claseNumber = $m[1];
                } else {
                    $claseNumber = (string) ($orq->clase->id_clase ?? '');
                }
            }
            $grupoClase = trim(($grupoCod ?: '') . '/' . ($claseNumber ?: ''), '/');
            $origen = $orq->origen ?? null;

            return [
                'no' => $ins->correlativo ?? '',
                'planta' => $orq->nombre_planta ?? '',
                'grupo_clase' => $grupoClase,
                'es' => ($origen === 'Especie') ? 'X' : '',
                'hi' => (in_array($origen, ['Híbrida','Hibrida'])) ? 'X' : '',
            ];
        })->values()->toArray();

        $data = [
            'rows' => $rows,
            'claseId' => $claseId,
        ];

        $pdf = Pdf::loadView('reportes.plantas_por_clases', $data)->setPaper('letter', 'portrait');

        return $pdf->stream('listado_plantas_por_clases.pdf');
    }

    public function orquideasAsignadasPdf(Request $request)
    {
        $eventoId = $request->query('event_id') ?? session('evento_activo');
        $evento = Evento::find($eventoId);

        if (!$evento) {
            return back()->with('error', 'No se encontró el evento especificado');
        }

        // Obtener orquídeas con sus relaciones
        $orquideas = Orquidea::with(['grupo', 'clase', 'participante'])
            ->where('id_evento', $eventoId)
            ->whereNotNull('id_participante')
            ->orderBy('nombre_planta')
            ->get();

        // Procesar los datos para la vista
        $rows = $orquideas->map(function ($orquidea) {
            $grupoLetter = '';
            if ($orquidea->grupo) {
                $grupoLetter = $orquidea->grupo->Cod_Grupo ?? '';
                if (!$grupoLetter && !empty($orquidea->grupo->nombre_grupo)) {
                    $grupoLetter = strtoupper(substr($orquidea->grupo->nombre_grupo, 0, 1));
                }
            }

            $claseNumber = '';
            if ($orquidea->clase) {
                $nombre = $orquidea->clase->nombre_clase ?? '';
                if ($nombre && preg_match('/Clase\s+(\d+)/u', $nombre, $m)) {
                    $claseNumber = $m[1];
                } elseif (!empty($orquidea->clase->id_clase)) {
                    $claseNumber = (string) $orquidea->clase->id_clase;
                }
            }

            return [
                'participante' => $orquidea->participante->nombre ?? 'Sin asignar',
                'telefono' => $orquidea->participante->numero_telefonico ?? '',
                'orquidea' => $orquidea->nombre_planta ?? '',
                'origen' => $orquidea->origen ?? '',
                'grupo' => $grupoLetter,
                'clase' => $claseNumber,
            ];
        });

        $pdf = Pdf::loadView('reportes.orquideas_asignadas', [
            'rows' => $rows,
            'evento' => $evento
        ]);

        return $pdf->stream('Orquideas_Asignadas_' . $evento->nombre_evento . '.pdf');
    }

    public function ganadoresPdf(Request $request)
    {
        $eventId = $request->query('event_id') ?? session('evento_activo');

        $query = Ganador::query()
            ->with([
                'inscripcion.orquidea.grupo',
                'inscripcion.orquidea.clase',
                'inscripcion.participante.aso',
            ])
            ->when($eventId, function ($q) use ($eventId) {
                $q->where(function ($inner) use ($eventId) {
                    $inner->where('id_evento', $eventId)
                          ->orWhereHas('inscripcion', function ($qi) use ($eventId) {
                              $qi->where('id_evento', $eventId);
                          });
                });
            });

        $ganadores = $query->get();

        // Obtener únicamente TE, MH, AOS (en ese orden) para las columnas dinámicas
        $todosPremios = TipoPremio::activos()->get(['id_tipo_premio','nombre_premio']);
        $orden = ['TE','MH','AOS'];
        $premios = $todosPremios
            ->filter(function ($p) use ($orden) {
                return in_array(strtoupper(trim($p->nombre_premio)), $orden, true);
            })
            ->sortBy(function ($p) use ($orden) {
                return array_search(strtoupper(trim($p->nombre_premio)), $orden, true);
            })
            ->values();

        $rows = $ganadores->map(function ($g) use ($premios, $eventId) {
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

            $grupoClase = trim($grupoLetter . '/' . $claseNumber, '/');

            $participante = optional(optional($g->inscripcion)->participante);
            $aso = optional($participante->aso)->Clase ?? '';

            // Determinar premios otorgados (listones/trofeos) a la inscripción en este evento
            $trofeos = Trofeo::query()
                ->where('id_inscripcion', optional($g->inscripcion)->id_nscr)
                ->when($eventId, function ($q) use ($eventId) {
                    $q->where('id_evento', $eventId);
                })
                ->get(['id_tipo_premio']);
            $idsOtorgados = $trofeos->pluck('id_tipo_premio')->filter()->all();

            $row = [
                'grupo_clase' => $grupoClase,
                'correlativo' => optional($g->inscripcion)->correlativo ?? '',
                'planta' => optional(optional($g->inscripcion)->orquidea)->nombre_planta ?? '',
                'propietario' => $participante->nombre ?? '',
                'asociacion' => $aso,
                'p1' => $g->posicion == 1 ? 'X' : '',
                'p2' => $g->posicion == 2 ? 'X' : '',
                'p3' => $g->posicion == 3 ? 'X' : '',
                // Columna fija "T": X si es primer lugar
                't' => $g->posicion == 1 ? 'X' : '',
            ];

            foreach ($premios as $premio) {
                $row['premio_' . $premio->id_tipo_premio] = in_array($premio->id_tipo_premio, $idsOtorgados, true) ? 'X' : '';
            }

            return $row;
        })->values()->toArray();

        $data = [
            'rows' => $rows,
            'premios' => $premios->map(function ($p) {
                return [
                    'id' => $p->id_tipo_premio,
                    'nombre' => $p->nombre_premio,
                ];
            })->values()->all(),
        ];

        $pdf = Pdf::loadView('reportes.ganadores', $data)->setPaper('letter', 'landscape');

        return $pdf->stream('listado_orquideas_ganadoras.pdf');
    }

    public function participantesOrquideasPdf(Request $request)
    {
        $participantes = Participante::with(['orquideas.grupo', 'orquideas.clase'])
            ->orderBy('nombre')
            ->get();

        $rows = [];
        foreach ($participantes as $p) {
            if ($p->orquideas && $p->orquideas->count() > 0) {
                foreach ($p->orquideas as $o) {
                    $grupoLetter = '';
                    $claseNumber = '';

                    $g = optional($o->grupo);
                    if ($g) {
                        $grupoLetter = $g->Cod_Grupo ?? '';
                        if (!$grupoLetter && !empty($g->nombre_grupo)) {
                            $grupoLetter = strtoupper(substr($g->nombre_grupo, 0, 1));
                        }
                    }

                    $c = optional($o->clase);
                    if ($c) {
                        $nombre = $c->nombre_clase ?? '';
                        if ($nombre && preg_match('/Clase\s+(\d+)/u', $nombre, $m)) {
                            $claseNumber = $m[1];
                        } elseif (!empty($c->id_clase)) {
                            $claseNumber = (string) $c->id_clase;
                        }
                    }

                    $rows[] = [
                        'participante' => $p->nombre ?? '',
                        'telefono' => $p->numero_telefonico ?? '',
                        'direccion' => $p->direccion ?? '',
                        'orquidea' => $o->nombre_planta ?? '',
                        'origen' => $o->origen ?? '',
                        'grupo' => $grupoLetter,
                        'clase' => $claseNumber,
                    ];
                }
            }
        }

        $data = [
            'rows' => $rows,
        ];

        $pdf = Pdf::loadView('reportes.participantes_orquideas', $data)->setPaper('letter', 'portrait');

        return $pdf->stream('reporte_participantes_orquideas_asignadas.pdf');
    }

    // Excel: Inscripciones
    public function inscripcionesExcel(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');
        $eventId = $request->query('event_id') ?? session('evento_activo');
        $export = new InscripcionesExport($from, $to, $eventId);
        $filename = 'reporte_inscripciones_' . now()->format('Y-m-d_H-i-s') . '.xlsx';
        return Excel::download($export, $filename);
    }

    // Excel: Plantas por Clases
    public function plantasPorClasesExcel(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');
        $clase = $request->query('clase');
        $export = new PlantasPorClasesExport($from, $to, $clase);
        $filename = 'listado_plantas_por_clases_' . now()->format('Y-m-d_H-i-s') . '.xlsx';
        return Excel::download($export, $filename);
    }

    // Excel: Ganadores
    public function ganadoresExcel(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');
        $export = new GanadoresExport($from, $to);
        $filename = 'listado_ganadores_' . now()->format('Y-m-d_H-i-s') . '.xlsx';
        return Excel::download($export, $filename);
    }

    // Excel: Participantes y Orquídeas Asignadas
    public function participantesOrquideasExcel(Request $request)
    {
        $id_evento = $request->input('id_evento');
        $export = new ParticipantesOrquideasExport($id_evento);
        
        $sufijo = $id_evento ? '_evento_' . $id_evento : '';
        $filename = 'reporte_participantes_orquideas_asignadas' . $sufijo . '_' . now()->format('Y-m-d_H-i-s') . '.xlsx';
        
        return Excel::download($export, $filename);
    }
}
