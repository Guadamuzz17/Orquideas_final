<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\Orquidea;
use Illuminate\Support\Facades\DB;

class InscripcionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $eventoActivo = session('evento_activo');

        $inscripciones = Inscripcion::with(['participante', 'orquidea'])
            ->where('id_evento', $eventoActivo)
            ->orderBy('correlativo')
            ->get();

        return Inertia::render('inscripcion/index', [
            'inscripciones' => $inscripciones
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $eventoActivo = session('evento_activo');

        $participantes = Participante::select('id', 'nombre')
            ->where('id_evento', $eventoActivo)
            ->orderBy('nombre')
            ->get();

        return Inertia::render('inscripcion/Create', [
            'participantes' => $participantes
        ]);
    }

    /**
     * Get orquídeas disponibles de un participante EN EL EVENTO ACTIVO
     */
    public function getOrquideasByParticipante($participanteId)
    {
        $eventoActivo = session('evento_activo');

        // Obtener orquídeas del participante con la cantidad de inscripciones DEL EVENTO ACTIVO
        $orquideas = Orquidea::with(['grupo', 'clase', 'participante'])
            ->where('id_participante', $participanteId)
            ->where('id_evento', $eventoActivo)
            ->withCount(['inscripciones' => function ($query) use ($eventoActivo) {
                $query->where('id_evento', $eventoActivo);
            }])
            ->get()
            ->filter(function ($orquidea) {
                // Solo incluir orquídeas que aún tengan cupos disponibles
                return $orquidea->inscripciones_count < $orquidea->cantidad;
            })
            ->map(function ($orquidea) {
                // Agregar información de disponibilidad
                $orquidea->disponibles = $orquidea->cantidad - $orquidea->inscripciones_count;
                return $orquidea;
            })
            ->values(); // Re-indexar el array

        return response()->json($orquideas);
    }

    /**
     * Search orquídeas by participante and name EN EL EVENTO ACTIVO
     */
    public function searchOrquideas(Request $request)
    {
        $participanteId = $request->get('participante_id');
        $searchTerm = $request->get('search', '');
        $eventoActivo = session('evento_activo');

        // Filtrar orquídeas por participante específico Y evento activo con conteo de inscripciones
        $query = Orquidea::with(['grupo', 'clase', 'participante'])
            ->where('id_participante', $participanteId)
            ->where('id_evento', $eventoActivo)
            ->withCount(['inscripciones' => function ($query) use ($eventoActivo) {
                $query->where('id_evento', $eventoActivo);
            }]);

        if ($searchTerm) {
            $query->where('nombre_planta', 'LIKE', '%' . $searchTerm . '%');
        }

        // Obtener resultados y filtrar por disponibilidad
        $orquideas = $query->get()
            ->filter(function ($orquidea) {
                // Solo incluir orquídeas que aún tengan cupos disponibles
                return $orquidea->inscripciones_count < $orquidea->cantidad;
            })
            ->map(function ($orquidea) {
                // Agregar información de disponibilidad
                $orquidea->disponibles = $orquidea->cantidad - $orquidea->inscripciones_count;
                return $orquidea;
            })
            ->take(10) // Limitar resultados para autocompletado
            ->values(); // Re-indexar el array

        return response()->json($orquideas);
    }

    /**
     * Check if correlativo is available EN EL EVENTO ACTIVO
     * Permite duplicados entre eventos diferentes
     */
    public function checkCorrelativo(Request $request)
    {
        $correlativo = $request->get('correlativo');
        $eventoActivo = session('evento_activo');

        // Buscar solo en el evento activo
        $inscripcion = Inscripcion::where('correlativo', $correlativo)
            ->where('id_evento', $eventoActivo)
            ->with(['participante', 'orquidea'])
            ->first();

        if ($inscripcion) {
            return response()->json([
                'available' => false,
                'message' => "Este correlativo le pertenece a {$inscripcion->participante->nombre} - {$inscripcion->orquidea->nombre_planta}",
                'owner' => $inscripcion->participante->nombre,
                'orquidea' => $inscripcion->orquidea->nombre_planta
            ]);
        }

        return response()->json([
            'available' => true,
            'message' => 'Correlativo disponible'
        ]);
    }

    /**
     * Get último correlativo usado POR EVENTO
     * Cada evento empieza desde 1
     */
    public function getUltimoCorrelativo()
    {
        $eventoActivo = session('evento_activo');

        // Obtener el último correlativo solo del evento activo
        $ultimoCorrelativo = Inscripcion::where('id_evento', $eventoActivo)
            ->max('correlativo') ?? 0;

        return response()->json([
            'ultimo_correlativo' => $ultimoCorrelativo,
            'evento_id' => $eventoActivo
        ]);
    }

    /**
     * Store multiple inscripciones
     */
    public function store(Request $request)
    {
        $eventoActivo = session('evento_activo');

        // Validar con regla unique que considera el evento
        $request->validate([
            'inscripciones' => 'required|array|min:1',
            'inscripciones.*.id_participante' => 'required|exists:tb_participante,id',
            'inscripciones.*.id_orquidea' => 'required|exists:tb_orquidea,id_orquidea',
            'inscripciones.*.correlativo' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($eventoActivo) {
                    $existe = Inscripcion::where('correlativo', $value)
                        ->where('id_evento', $eventoActivo)
                        ->exists();

                    if ($existe) {
                        $fail("El correlativo $value ya está en uso en este evento.");
                    }
                }
            ]
        ]);

        try {
            DB::beginTransaction();

            foreach ($request->inscripciones as $inscripcionData) {
                Inscripcion::create([
                    'id_participante' => $inscripcionData['id_participante'],
                    'id_orquidea' => $inscripcionData['id_orquidea'],
                    'correlativo' => $inscripcionData['correlativo'],
                    'id_evento' => $eventoActivo
                ]);
            }

            DB::commit();

            return redirect()->route('inscripcion.index')
                ->with('success', 'Inscripciones realizadas exitosamente');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Error al procesar las inscripciones: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $inscripcion = Inscripcion::with(['participante', 'orquidea.grupo', 'orquidea.clase'])
            ->findOrFail($id);

        return Inertia::render('inscripcion/Show', [
            'inscripcion' => $inscripcion
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $inscripcion = Inscripcion::findOrFail($id);
            $inscripcion->delete();

            return back()->with('success', 'Inscripción eliminada exitosamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar la inscripción: ' . $e->getMessage());
        }
    }
}
