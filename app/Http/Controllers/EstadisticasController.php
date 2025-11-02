<?php

namespace App\Http\Controllers;

use App\Models\Participante;
use App\Models\Orquidea;
use App\Models\Inscripcion;
use App\Models\Ganador;
use App\Models\Clase;
use App\Models\Grupo;
use App\Models\Tipoparticipante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EstadisticasController extends Controller
{
    /**
     * Display the statistics dashboard
     */
    public function index()
    {
        $eventoActual = session('evento_seleccionado');

        return Inertia::render('estadisticas/Index', [
            'eventoActual' => $eventoActual
        ]);
    }

    /**
     * Get comprehensive statistics for a specific event
     */
    public function getEstadisticas(Request $request)
    {
        $eventoId = $request->input('evento_id', session('evento_seleccionado'));

        if (!$eventoId) {
            return response()->json(['error' => 'No hay evento seleccionado'], 400);
        }

        $statistics = [
            'resumen_general' => $this->getResumenGeneral($eventoId),
            'participantes' => $this->getEstadisticasParticipantes($eventoId),
            'orquideas' => $this->getEstadisticasOrquideas($eventoId),
            'ganadores' => $this->getEstadisticasGanadores($eventoId),
            'clases_grupos' => $this->getEstadisticasClasesGrupos($eventoId),
            'tendencias' => $this->getTendencias($eventoId),
            'top_participantes' => $this->getTopParticipantes($eventoId),
            'distribucion_geografica' => $this->getDistribucionGeografica($eventoId),
        ];

        return response()->json($statistics);
    }

    /**
     * Get general summary statistics
     */
    private function getResumenGeneral($eventoId)
    {
        $totalParticipantes = Participante::where('id_evento', $eventoId)->count();

        $totalInscripciones = Inscripcion::whereHas('participante', function($query) use ($eventoId) {
            $query->where('id_evento', $eventoId);
        })->count();

        $totalOrquideas = Orquidea::whereHas('inscripciones', function($query) use ($eventoId) {
            $query->whereHas('participante', function($q) use ($eventoId) {
                $q->where('id_evento', $eventoId);
            });
        })->count();

        $totalGanadores = Ganador::where('id_evento', $eventoId)->count();

        $participantesConOrquideas = Participante::where('id_evento', $eventoId)
            ->whereHas('orquideas')
            ->count();

        return [
            'total_participantes' => $totalParticipantes,
            'total_inscripciones' => $totalInscripciones,
            'total_orquideas' => $totalOrquideas,
            'total_ganadores' => $totalGanadores,
            'participantes_con_orquideas' => $participantesConOrquideas,
            'promedio_orquideas_por_participante' => $totalParticipantes > 0
                ? round($totalInscripciones / $totalParticipantes, 2)
                : 0,
        ];
    }

    /**
     * Get participant statistics
     */
    private function getEstadisticasParticipantes($eventoId)
    {
        // Distribution by participant type
        $porTipo = Participante::where('id_evento', $eventoId)
            ->select('id_tipo_participante', DB::raw('count(*) as total'))
            ->groupBy('id_tipo_participante')
            ->with('tipo:id,nombre')
            ->get()
            ->map(function($item) {
                return [
                    'tipo' => $item->tipo->nombre ?? 'Sin tipo',
                    'total' => $item->total
                ];
            });

        // Distribution by ASO
        $porAso = Participante::where('id_evento', $eventoId)
            ->select('id_aso', DB::raw('count(*) as total'))
            ->groupBy('id_aso')
            ->with('aso:id,nombre')
            ->get()
            ->map(function($item) {
                return [
                    'aso' => $item->aso->nombre ?? 'Sin ASO',
                    'total' => $item->total
                ];
            });

        // New vs returning participants
        $nuevos = Participante::where('id_evento', $eventoId)
            ->whereDoesntHave('orquideas', function($query) use ($eventoId) {
                $query->whereHas('inscripciones.participante', function($q) use ($eventoId) {
                    $q->where('id_evento', '!=', $eventoId);
                });
            })
            ->count();

        $total = Participante::where('id_evento', $eventoId)->count();
        $recurrentes = $total - $nuevos;

        return [
            'por_tipo' => $porTipo,
            'por_aso' => $porAso,
            'nuevos_vs_recurrentes' => [
                ['categoria' => 'Nuevos', 'total' => $nuevos],
                ['categoria' => 'Recurrentes', 'total' => $recurrentes]
            ]
        ];
    }

    /**
     * Get orchid statistics
     */
    private function getEstadisticasOrquideas($eventoId)
    {
        // Most common classes
        $clasesMasComunes = Inscripcion::whereHas('participante', function($query) use ($eventoId) {
                $query->where('id_evento', $eventoId);
            })
            ->select('id_clase', DB::raw('count(*) as total'))
            ->groupBy('id_clase')
            ->with('clase:id,nombre')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(function($item) {
                return [
                    'clase' => $item->clase->nombre ?? 'Sin clase',
                    'total' => $item->total
                ];
            });

        // Most common groups
        $gruposMasComunes = Inscripcion::whereHas('participante', function($query) use ($eventoId) {
                $query->where('id_evento', $eventoId);
            })
            ->select('id_grupo', DB::raw('count(*) as total'))
            ->groupBy('id_grupo')
            ->with('grupo:id,nombre')
            ->orderByDesc('total')
            ->limit(10)
            ->get()
            ->map(function($item) {
                return [
                    'grupo' => $item->grupo->nombre ?? 'Sin grupo',
                    'total' => $item->total
                ];
            });

        // Species diversity
        $totalEspecies = Orquidea::whereHas('inscripciones', function($query) use ($eventoId) {
                $query->whereHas('participante', function($q) use ($eventoId) {
                    $q->where('id_evento', $eventoId);
                });
            })
            ->distinct('nombre_cientifico')
            ->count('nombre_cientifico');

        // Native vs hybrid
        $nativas = Inscripcion::whereHas('participante', function($query) use ($eventoId) {
                $query->where('id_evento', $eventoId);
            })
            ->whereHas('grupo', function($query) {
                $query->where('nombre', 'like', '%nativa%');
            })
            ->count();

        $hibridos = Inscripcion::whereHas('participante', function($query) use ($eventoId) {
                $query->where('id_evento', $eventoId);
            })
            ->whereHas('grupo', function($query) {
                $query->where('nombre', 'like', '%híbrido%')
                      ->orWhere('nombre', 'like', '%hibrido%');
            })
            ->count();

        return [
            'clases_mas_comunes' => $clasesMasComunes,
            'grupos_mas_comunes' => $gruposMasComunes,
            'total_especies_diferentes' => $totalEspecies,
            'nativas_vs_hibridos' => [
                ['tipo' => 'Nativas', 'total' => $nativas],
                ['tipo' => 'Híbridos', 'total' => $hibridos]
            ]
        ];
    }

    /**
     * Get winners statistics
     */
    private function getEstadisticasGanadores($eventoId)
    {
        // Winners by trophy type
        $porTrofeo = Ganador::where('id_evento', $eventoId)
            ->select('id_trofeo', DB::raw('count(*) as total'))
            ->groupBy('id_trofeo')
            ->with('trofeo:id,nombre')
            ->get()
            ->map(function($item) {
                return [
                    'trofeo' => $item->trofeo->nombre ?? 'Sin trofeo',
                    'total' => $item->total
                ];
            });

        // Winners by class
        $porClase = Ganador::where('id_evento', $eventoId)
            ->whereHas('inscripcion')
            ->with('inscripcion.clase:id,nombre')
            ->get()
            ->groupBy(function($item) {
                return $item->inscripcion->clase->nombre ?? 'Sin clase';
            })
            ->map(function($items, $key) {
                return [
                    'clase' => $key,
                    'total' => $items->count()
                ];
            })
            ->values();

        // Total awards distributed
        $totalPremios = Ganador::where('id_evento', $eventoId)->count();

        return [
            'por_trofeo' => $porTrofeo,
            'por_clase' => $porClase,
            'total_premios_otorgados' => $totalPremios
        ];
    }

    /**
     * Get class and group statistics
     */
    private function getEstadisticasClasesGrupos($eventoId)
    {
        $clasesConMasInscripciones = Inscripcion::whereHas('participante', function($query) use ($eventoId) {
                $query->where('id_evento', $eventoId);
            })
            ->select('id_clase', DB::raw('count(*) as total'))
            ->groupBy('id_clase')
            ->with('clase:id,nombre')
            ->orderByDesc('total')
            ->limit(15)
            ->get()
            ->map(function($item) {
                return [
                    'clase' => $item->clase->nombre ?? 'Sin clase',
                    'inscripciones' => $item->total
                ];
            });

        $gruposConMasInscripciones = Inscripcion::whereHas('participante', function($query) use ($eventoId) {
                $query->where('id_evento', $eventoId);
            })
            ->select('id_grupo', DB::raw('count(*) as total'))
            ->groupBy('id_grupo')
            ->with('grupo:id,nombre')
            ->orderByDesc('total')
            ->limit(15)
            ->get()
            ->map(function($item) {
                return [
                    'grupo' => $item->grupo->nombre ?? 'Sin grupo',
                    'inscripciones' => $item->total
                ];
            });

        return [
            'clases_con_mas_inscripciones' => $clasesConMasInscripciones,
            'grupos_con_mas_inscripciones' => $gruposConMasInscripciones
        ];
    }

    /**
     * Get top participants (who brought most orchids)
     */
    private function getTopParticipantes($eventoId)
    {
        $top = Participante::where('id_evento', $eventoId)
            ->withCount('orquideas')
            ->orderByDesc('orquideas_count')
            ->limit(20)
            ->get()
            ->map(function($participante) {
                return [
                    'id' => $participante->id,
                    'nombre' => $participante->nombre,
                    'total_orquideas' => $participante->orquideas_count,
                    'tipo' => $participante->tipo->nombre ?? 'Sin tipo',
                    'aso' => $participante->aso->nombre ?? 'Sin ASO'
                ];
            });

        return $top;
    }

    /**
     * Get geographic distribution
     */
    private function getDistribucionGeografica($eventoId)
    {
        $porDepartamento = Participante::where('id_evento', $eventoId)
            ->select('id_departamento', DB::raw('count(*) as total'))
            ->groupBy('id_departamento')
            ->with('departamento:id,nombre')
            ->orderByDesc('total')
            ->get()
            ->map(function($item) {
                return [
                    'departamento' => $item->departamento->nombre ?? 'Sin departamento',
                    'total' => $item->total
                ];
            });

        $porMunicipio = Participante::where('id_evento', $eventoId)
            ->select('id_municipio', DB::raw('count(*) as total'))
            ->groupBy('id_municipio')
            ->with('municipio:id,nombre')
            ->orderByDesc('total')
            ->limit(15)
            ->get()
            ->map(function($item) {
                return [
                    'municipio' => $item->municipio->nombre ?? 'Sin municipio',
                    'total' => $item->total
                ];
            });

        return [
            'por_departamento' => $porDepartamento,
            'por_municipio' => $porMunicipio
        ];
    }

    /**
     * Get trends by comparing with previous events
     */
    private function getTendencias($eventoId)
    {
        // Get all events ordered by year
        $eventos = DB::table('tb_eventos')
            ->orderBy('anho')
            ->select('id', 'anho', 'nombre')
            ->get();

        $tendenciaParticipantes = [];
        $tendenciaInscripciones = [];
        $tendenciaGanadores = [];

        foreach ($eventos as $evento) {
            $totalPart = Participante::where('id_evento', $evento->id)->count();
            $totalInsc = Inscripcion::whereHas('participante', function($query) use ($evento) {
                $query->where('id_evento', $evento->id);
            })->count();
            $totalGan = Ganador::where('id_evento', $evento->id)->count();

            $tendenciaParticipantes[] = [
                'evento' => $evento->nombre ?? 'Evento ' . $evento->anho,
                'anho' => $evento->anho,
                'total' => $totalPart
            ];

            $tendenciaInscripciones[] = [
                'evento' => $evento->nombre ?? 'Evento ' . $evento->anho,
                'anho' => $evento->anho,
                'total' => $totalInsc
            ];

            $tendenciaGanadores[] = [
                'evento' => $evento->nombre ?? 'Evento ' . $evento->anho,
                'anho' => $evento->anho,
                'total' => $totalGan
            ];
        }

        return [
            'participantes' => $tendenciaParticipantes,
            'inscripciones' => $tendenciaInscripciones,
            'ganadores' => $tendenciaGanadores
        ];
    }

    /**
     * Export statistics to CSV
     */
    public function exportar(Request $request)
    {
        $eventoId = $request->input('evento_id', session('evento_seleccionado'));
        $tipo = $request->input('tipo', 'completo'); // completo, participantes, orquideas, ganadores

        if (!$eventoId) {
            return response()->json(['error' => 'No hay evento seleccionado'], 400);
        }

        $filename = "estadisticas_{$tipo}_evento_{$eventoId}_" . now()->format('Y-m-d_His') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($eventoId, $tipo) {
            $file = fopen('php://output', 'w');

            // UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            switch ($tipo) {
                case 'participantes':
                    $this->exportarParticipantes($file, $eventoId);
                    break;
                case 'orquideas':
                    $this->exportarOrquideas($file, $eventoId);
                    break;
                case 'ganadores':
                    $this->exportarGanadores($file, $eventoId);
                    break;
                default:
                    $this->exportarCompleto($file, $eventoId);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportarParticipantes($file, $eventoId)
    {
        fputcsv($file, ['Nombre', 'Tipo', 'ASO', 'Departamento', 'Municipio', 'Total Orquídeas']);

        Participante::where('id_evento', $eventoId)
            ->with(['tipo', 'aso', 'departamento', 'municipio'])
            ->withCount('orquideas')
            ->chunk(100, function($participantes) use ($file) {
                foreach ($participantes as $p) {
                    fputcsv($file, [
                        $p->nombre,
                        $p->tipo->nombre ?? '',
                        $p->aso->nombre ?? '',
                        $p->departamento->nombre ?? '',
                        $p->municipio->nombre ?? '',
                        $p->orquideas_count
                    ]);
                }
            });
    }

    private function exportarOrquideas($file, $eventoId)
    {
        fputcsv($file, ['Nombre Científico', 'Nombre Común', 'Clase', 'Grupo', 'Participante']);

        Inscripcion::whereHas('participante', function($query) use ($eventoId) {
                $query->where('id_evento', $eventoId);
            })
            ->with(['orquidea', 'clase', 'grupo', 'participante'])
            ->chunk(100, function($inscripciones) use ($file) {
                foreach ($inscripciones as $i) {
                    fputcsv($file, [
                        $i->orquidea->nombre_cientifico ?? '',
                        $i->orquidea->nombre_comun ?? '',
                        $i->clase->nombre ?? '',
                        $i->grupo->nombre ?? '',
                        $i->participante->nombre ?? ''
                    ]);
                }
            });
    }

    private function exportarGanadores($file, $eventoId)
    {
        fputcsv($file, ['Participante', 'Orquídea', 'Trofeo', 'Clase', 'Grupo']);

        Ganador::where('id_evento', $eventoId)
            ->with(['inscripcion.participante', 'inscripcion.orquidea', 'inscripcion.clase', 'inscripcion.grupo', 'trofeo'])
            ->chunk(100, function($ganadores) use ($file) {
                foreach ($ganadores as $g) {
                    fputcsv($file, [
                        $g->inscripcion->participante->nombre ?? '',
                        $g->inscripcion->orquidea->nombre_cientifico ?? '',
                        $g->trofeo->nombre ?? '',
                        $g->inscripcion->clase->nombre ?? '',
                        $g->inscripcion->grupo->nombre ?? ''
                    ]);
                }
            });
    }

    private function exportarCompleto($file, $eventoId)
    {
        $stats = $this->getEstadisticas(new Request(['evento_id' => $eventoId]))->getData();

        fputcsv($file, ['RESUMEN GENERAL']);
        fputcsv($file, ['Métrica', 'Valor']);
        foreach ($stats->resumen_general as $key => $value) {
            fputcsv($file, [ucfirst(str_replace('_', ' ', $key)), $value]);
        }

        fputcsv($file, []);
        fputcsv($file, ['TOP 20 PARTICIPANTES']);
        fputcsv($file, ['Nombre', 'Total Orquídeas', 'Tipo', 'ASO']);
        foreach ($stats->top_participantes as $p) {
            fputcsv($file, [$p->nombre, $p->total_orquideas, $p->tipo, $p->aso]);
        }

        fputcsv($file, []);
        fputcsv($file, ['CLASES MÁS COMUNES']);
        fputcsv($file, ['Clase', 'Total']);
        foreach ($stats->orquideas->clases_mas_comunes as $c) {
            fputcsv($file, [$c->clase, $c->total]);
        }
    }

    /**
     * Compare statistics between multiple events
     */
    public function comparar(Request $request)
    {
        $eventosIds = $request->input('eventos', []);

        if (empty($eventosIds)) {
            return response()->json(['error' => 'Debe seleccionar al menos un evento'], 400);
        }

        $comparacion = [];

        foreach ($eventosIds as $eventoId) {
            $evento = DB::table('tb_eventos')->where('id', $eventoId)->first();

            if ($evento) {
                $comparacion[] = [
                    'evento' => $evento->nombre ?? 'Evento ' . $evento->anho,
                    'anho' => $evento->anho,
                    'estadisticas' => [
                        'participantes' => Participante::where('id_evento', $eventoId)->count(),
                        'inscripciones' => Inscripcion::whereHas('participante', function($q) use ($eventoId) {
                            $q->where('id_evento', $eventoId);
                        })->count(),
                        'ganadores' => Ganador::where('id_evento', $eventoId)->count(),
                        'clases_diferentes' => Inscripcion::whereHas('participante', function($q) use ($eventoId) {
                            $q->where('id_evento', $eventoId);
                        })->distinct('id_clase')->count('id_clase'),
                        'especies_diferentes' => Orquidea::whereHas('inscripciones.participante', function($q) use ($eventoId) {
                            $q->where('id_evento', $eventoId);
                        })->distinct('nombre_cientifico')->count('nombre_cientifico'),
                    ]
                ];
            }
        }

        return response()->json($comparacion);
    }
}
