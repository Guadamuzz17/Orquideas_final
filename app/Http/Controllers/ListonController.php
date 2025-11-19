<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Trofeo;
use App\Models\Inscripcion;
use App\Models\TipoPremio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ListonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $listones = Trofeo::listones()
                ->with(['inscripcion.participante', 'inscripcion.orquidea.grupo', 'inscripcion.orquidea.clase', 'tipoPremio'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($liston) {
                    return [
                        'id_liston' => $liston->id_trofeo ?? null,
                        'correlativo' => optional($liston->inscripcion)->correlativo ?? 'N/A',
                        'participante' => optional(optional($liston->inscripcion)->participante)->nombre ?? 'Sin participante',
                        'orquidea' => optional(optional(optional($liston->inscripcion)->orquidea))->nombre_planta ?? 'Sin orquídea',
                        'grupo' => optional(optional(optional(optional($liston->inscripcion)->orquidea)->grupo))->nombre_grupo ?? 'Sin grupo',
                        'clase' => optional(optional(optional(optional($liston->inscripcion)->orquidea)->clase))->nombre_clase ?? 'Sin clase',
                        'tipo_liston' => $liston->tipo_liston ?? null,
                        'tipo_premio' => $liston->tipoPremio ?? null,
                        'descripcion' => $liston->descripcion ?? null,
                        'fecha_otorgado' => $liston->fecha_ganador ? $liston->fecha_ganador->format('d/m/Y') : 'N/A',
                    ];
                })
                ->filter(function ($item) {
                    return $item['id_liston'] !== null;
                })
                ->values();

            $tiposPremio = TipoPremio::activos()->ordenadosPorPosicion()->get();

            Log::info('Listones index cargado correctamente', [
                'total_listones' => $listones->count(),
                'total_tipos_premio' => $tiposPremio->count()
            ]);

            return Inertia::render('Listones/index', [
                'listones' => $listones,
                'tiposPremio' => $tiposPremio
            ]);
        } catch (\Exception $e) {
            Log::error('Error en ListonController@index: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return Inertia::render('Listones/index', [
                'listones' => collect([]),
                'tiposPremio' => collect([]),
                'error' => 'Error al cargar los listones: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Listones/Create', [
            'inscripciones' => Inscripcion::with(['participante', 'orquidea.grupo', 'orquidea.clase'])
                ->whereNotIn('id_nscr', function($query) {
                    $query->select('id_inscripcion')->from('tb_trofeo')->where('tipo_premio', 'liston');
                })
                ->get()
                ->map(function ($inscripcion) {
                    return [
                        'id_inscripcion' => $inscripcion->id_nscr,
                        'correlativo' => $inscripcion->correlativo,
                        'participante_nombre' => $inscripcion->participante->nombre ?? 'Sin participante',
                        'orquidea_nombre' => $inscripcion->orquidea->nombre_planta ?? 'Sin orquídea',
                        'grupo_nombre' => $inscripcion->orquidea->grupo->nombre_grupo ?? 'Sin grupo',
                        'clase_nombre' => $inscripcion->orquidea->clase->nombre_clase ?? 'Sin clase',
                    ];
                }),
            'tiposPremio' => TipoPremio::activos()->ordenadosPorPosicion()->get()
        ]);
    }

    /**
     * Search inscripciones for listones assignment
     */
    public function searchInscripciones(Request $request)
    {
        $searchTerm = $request->get('search', '');
        $participanteId = $request->get('participante_id');
        $grupo = $request->get('grupo');
        $clase = $request->get('clase');

        $query = Inscripcion::with(['participante', 'orquidea.grupo', 'orquidea.clase'])
            ->whereNotIn('id_nscr', function($subQuery) {
                $subQuery->select('id_inscripcion')->from('tb_trofeo')->where('tipo_premio', 'liston');
            });

        if ($searchTerm) {
            $query->where(function($q) use ($searchTerm) {
                $q->where('correlativo', 'LIKE', '%' . $searchTerm . '%')
                  ->orWhereHas('participante', function($pq) use ($searchTerm) {
                      $pq->where('nombre', 'LIKE', '%' . $searchTerm . '%');
                  })
                  ->orWhereHas('orquidea', function($oq) use ($searchTerm) {
                      $oq->where('nombre_planta', 'LIKE', '%' . $searchTerm . '%');
                  });
            });
        }

        if ($participanteId) {
            $query->where('id_participante', $participanteId);
        }

        if ($grupo) {
            $query->whereHas('orquidea.grupo', function($gq) use ($grupo) {
                $gq->where('nombre_grupo', 'LIKE', '%' . $grupo . '%');
            });
        }

        if ($clase) {
            $query->whereHas('orquidea.clase', function($cq) use ($clase) {
                $cq->where('nombre_clase', 'LIKE', '%' . $clase . '%');
            });
        }

        $inscripciones = $query->limit(20)->get()
            ->map(function ($inscripcion) {
                return [
                    'id_inscripcion' => $inscripcion->id_nscr,
                    'correlativo' => $inscripcion->correlativo,
                    'participante_nombre' => $inscripcion->participante->nombre ?? 'Sin participante',
                    'orquidea_nombre' => $inscripcion->orquidea->nombre_planta ?? 'Sin orquídea',
                    'grupo_nombre' => $inscripcion->orquidea->grupo->nombre_grupo ?? 'Sin grupo',
                    'clase_nombre' => $inscripcion->orquidea->clase->nombre_clase ?? 'Sin clase',
                ];
            });

        return response()->json($inscripciones);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'inscripcion_id' => 'required|exists:tb_inscripcion,id_nscr',
            'id_tipo_premio' => 'required|exists:tb_tipo_premio,id_tipo_premio',
            'descripcion' => 'nullable|string|max:500'
        ]);

        try {
            DB::beginTransaction();

            Trofeo::create([
                'id_inscripcion' => $request->inscripcion_id,
                'tipo_premio' => 'liston',
                'id_tipo_premio' => $request->id_tipo_premio,
                'descripcion' => $request->descripcion,
                'fecha_ganador' => now()
            ]);

            DB::commit();

            return redirect()->route('listones.index')
                ->with('success', 'Listón otorgado exitosamente');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Error al otorgar el listón: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $liston = Trofeo::listones()
            ->with(['inscripcion.participante', 'inscripcion.orquidea.grupo', 'inscripcion.orquidea.clase'])
            ->findOrFail($id);

        return Inertia::render('Listones/Show', [
            'liston' => [
                'id_liston' => $liston->id_trofeo,
                'correlativo' => $liston->inscripcion->correlativo,
                'participante' => $liston->inscripcion->participante->nombre,
                'orquidea' => $liston->inscripcion->orquidea->nombre_planta,
                'grupo' => $liston->inscripcion->orquidea->grupo->nombre_grupo,
                'clase' => $liston->inscripcion->orquidea->clase->nombre_clase,
                'tipo_liston' => $liston->tipo_liston,
                'descripcion' => $liston->descripcion,
                'fecha_otorgado' => $liston->fecha_otorgado->format('d/m/Y H:i'),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $liston = Trofeo::listones()->findOrFail($id);
            $liston->delete();

            return back()->with('success', 'Listón eliminado exitosamente');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al eliminar el listón']);
        }
    }
}
