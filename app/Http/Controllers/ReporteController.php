<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Inscripcion;
use App\Models\Orquidea;
use App\Models\Ganador;
use App\Models\Participante;
use App\Models\Trofeo;

class ReporteController extends Controller
{
    public function inscripcionesPdf(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        // Volver a basar el reporte en Inscripcion y filtrar por su created_at
        $query = Inscripcion::query()
            ->with(['participante', 'orquidea.grupo', 'orquidea.clase']);

        if ($from && $to) {
            $query->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59']);
        } elseif ($from) {
            $query->where('created_at', '>=', $from . ' 00:00:00');
        } elseif ($to) {
            $query->where('created_at', '<=', $to . ' 23:59:59');
        }

        $inscripciones = $query->get();

        $rows = $inscripciones->filter(function ($ins) {
            // Validar que el participante coincida entre tb_inscripcion e orquidea
            return $ins->orquidea && $ins->participante && ($ins->orquidea->id_participante == $ins->id_participante);
        })->map(function ($ins) {
            $grupoLetter = '';
            if ($ins->orquidea && $ins->orquidea->grupo) {
                $grupoLetter = $ins->orquidea->grupo->Cod_Grupo ?? '';
                if (!$grupoLetter && !empty($ins->orquidea->grupo->nombre_grupo)) {
                    // Extraer primera letra si no existe Cod_Grupo
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

            return [
                'participante' => optional($ins->participante)->nombre,
                'orquidea' => optional($ins->orquidea)->nombre_planta,
                'grupo' => $grupoLetter,
                'clase' => $claseNumber,
                'origen' => optional($ins->orquidea)->origen,
                'correlativo' => $ins->correlativo ?? '',
            ];
        })->values()->toArray();

        $data = [
            'from' => $from,
            'to' => $to,
            'rows' => $rows,
        ];

        $pdf = Pdf::loadView('reportes.inscripciones', $data)->setPaper('letter', 'portrait');

        return $pdf->stream('reporte_inscripciones.pdf');
    }

    public function plantasPorClasesPdf(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');
        $claseId = $request->query('clase'); // puede ser 'todas' o un id

        $query = Inscripcion::query()
            ->with(['orquidea.grupo', 'orquidea.clase'])
            ->when($from || $to, function ($q) use ($from, $to) {
                if ($from && $to) {
                    $q->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59']);
                } elseif ($from) {
                    $q->where('created_at', '>=', $from . ' 00:00:00');
                } else {
                    $q->where('created_at', '<=', $to . ' 23:59:59');
                }
            })
            ->when($claseId && $claseId !== 'todas', function ($q) use ($claseId) {
                $q->whereHas('orquidea', function ($qo) use ($claseId) {
                    $qo->where('id_clase', $claseId);
                });
            });

        $inscripciones = $query->get();

        $rows = $inscripciones->map(function ($ins) {
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

            $origen = optional($ins->orquidea)->origen;

            return [
                'no' => $ins->correlativo ?? '',
                'planta' => optional($ins->orquidea)->nombre_planta ?? '',
                'grupo_clase' => trim($grupoLetter . '/' . $claseNumber, '/'),
                'es' => ($origen === 'Especie') ? 'X' : '',
                'hi' => ($origen === 'Híbrida') ? 'X' : '',
            ];
        })->values()->toArray();

        $data = [
            'from' => $from,
            'to' => $to,
            'rows' => $rows,
            'claseId' => $claseId,
        ];

        $pdf = Pdf::loadView('reportes.plantas_por_clases', $data)->setPaper('letter', 'portrait');

        return $pdf->stream('listado_plantas_por_clases.pdf');
    }

    public function ganadoresPdf(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $query = Ganador::query()
            ->with([
                'inscripcion.orquidea.grupo',
                'inscripcion.orquidea.clase',
                'inscripcion.participante.aso',
            ]);

        if ($from && $to) {
            $query->whereBetween('created_at', [$from . ' 00:00:00', $to . ' 23:59:59']);
        } elseif ($from) {
            $query->where('created_at', '>=', $from . ' 00:00:00');
        } elseif ($to) {
            $query->where('created_at', '<=', $to . ' 23:59:59');
        }

        $ganadores = $query->get();

        $rows = $ganadores->map(function ($g) {
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

            // Determinar si la orquídea asociada tiene trofeo(s)
            $idOrq = optional(optional($g->inscripcion)->orquidea)->id_orquidea;
            $hasTrophy = $idOrq ? Trofeo::where('id_orquidea', $idOrq)->exists() : false;

            return [
                'grupo_clase' => $grupoClase,
                'correlativo' => optional($g->inscripcion)->correlativo ?? '',
                'planta' => optional(optional($g->inscripcion)->orquidea)->nombre_planta ?? '',
                'propietario' => $participante->nombre ?? '',
                'asociacion' => $aso,
                'trofeo' => $hasTrophy ? 'X' : '',
                'p1' => $g->posicion == 1 ? 'X' : '',
                'p2' => $g->posicion == 2 ? 'X' : '',
                'p3' => $g->posicion == 3 ? 'X' : '',
            ];
        })->values()->toArray();

        $data = [
            'from' => $from,
            'to' => $to,
            'rows' => $rows,
        ];

        $pdf = Pdf::loadView('reportes.ganadores', $data)->setPaper('letter', 'portrait');

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
                $nombres = $p->orquideas->pluck('nombre_planta')->filter()->values()->all();
                $origenes = $p->orquideas->pluck('origen')->filter()->unique()->values()->all();
                $grupos = $p->orquideas->map(function ($o) {
                    $g = optional($o->grupo);
                    $letter = $g->Cod_Grupo ?? '';
                    if (!$letter && !empty($g->nombre_grupo)) {
                        $letter = strtoupper(substr($g->nombre_grupo, 0, 1));
                    }
                    return $letter ?: null;
                })->filter()->unique()->values()->all();
                $clases = $p->orquideas->map(function ($o) {
                    $c = optional($o->clase);
                    $nombre = $c->nombre_clase ?? '';
                    $num = '';
                    if ($nombre && preg_match('/Clase\s+(\d+)/u', $nombre, $m)) {
                        $num = $m[1];
                    } elseif (!empty($c->id_clase)) {
                        $num = (string) $c->id_clase;
                    }
                    return $num ?: null;
                })->filter()->unique()->values()->all();
                $rows[] = [
                    'participante' => $p->nombre ?? '',
                    'telefono' => $p->numero_telefonico ?? '',
                    'direccion' => $p->direccion ?? '',
                    'orquidea' => implode(', ', $nombres),
                    'origen' => implode(', ', $origenes),
                    'grupo' => implode(', ', $grupos),
                    'clase' => implode(', ', $clases),
                ];
            }
        }

        $data = [
            'rows' => $rows,
        ];

        $pdf = Pdf::loadView('reportes.participantes_orquideas', $data)->setPaper('letter', 'portrait');

        return $pdf->stream('reporte_participantes_orquideas_asignadas.pdf');
    }
}
