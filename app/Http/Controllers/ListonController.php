<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Trofeo;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListonController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Listones/index', [
            'listones' => Trofeo::listones()
                ->with(['inscripcion.participante', 'inscripcion.orquidea.grupo', 'inscripcion.orquidea.clase'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($liston) {
                    return [
                        'id_liston' => $liston->id_trofeo,
                        'correlativo' => $liston->inscripcion->correlativo ?? 'N/A',
                        'participante' => $liston->inscripcion->participante->nombre ?? 'Sin participante',
                        'orquidea' => $liston->inscripcion->orquidea->nombre_planta ?? 'Sin orquídea',
                        'grupo' => $liston->inscripcion->orquidea->grupo->nombre_grupo ?? 'Sin grupo',
                        'clase' => $liston->inscripcion->orquidea->clase->nombre_clase ?? 'Sin clase',
                        'tipo_liston' => $liston->tipo_liston,
                        'descripcion' => $liston->descripcion,
                        'fecha_otorgado' => $liston->fecha_ganador->format('d/m/Y'),
                    ];
                })
        ]);
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
                })
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
            'tipo_liston' => 'required|string|max:100',
            'descripcion' => 'nullable|string|max:500'
        ]);

        try {
            DB::beginTransaction();

            Trofeo::create([
                'id_inscripcion' => $request->inscripcion_id,
                'tipo_premio' => 'liston',
                'tipo_liston' => $request->tipo_liston,
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
