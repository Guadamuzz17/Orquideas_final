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
        $inscripciones = Inscripcion::with(['participante', 'orquidea'])
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
        $participantes = Participante::select('id', 'nombre')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('inscripcion/Create', [
            'participantes' => $participantes
        ]);
    }

    /**
     * Get orquídeas by participante
     * Por ahora devolvemos todas las orquídeas disponibles
     */
    public function getOrquideasByParticipante($participanteId)
    {
        // Por ahora devolvemos todas las orquídeas ya que no hay relación directa
        // con participantes en la tabla tb_orquidea
        $orquideas = Orquidea::with(['grupo', 'clase'])
            ->get();

        return response()->json($orquideas);
    }

    /**
     * Search orquídeas by participante and name
     */
    public function searchOrquideas(Request $request)
    {
        $participanteId = $request->get('participante_id');
        $searchTerm = $request->get('search', '');

        // Por ahora buscamos en todas las orquídeas
        $query = Orquidea::with(['grupo', 'clase']);

        if ($searchTerm) {
            $query->where('nombre_planta', 'LIKE', '%' . $searchTerm . '%');
        }

        $orquideas = $query->get();

        return response()->json($orquideas);
    }

    /**
     * Check if correlativo is available
     */
    public function checkCorrelativo(Request $request)
    {
        $correlativo = $request->get('correlativo');
        
        $inscripcion = Inscripcion::where('correlativo', $correlativo)
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
     * Get último correlativo usado
     */
    public function getUltimoCorrelativo()
    {
        $ultimoCorrelativo = Inscripcion::max('correlativo') ?? 0;
        
        return response()->json([
            'ultimo_correlativo' => $ultimoCorrelativo
        ]);
    }

    /**
     * Store multiple inscripciones
     */
    public function store(Request $request)
    {
        $request->validate([
            'inscripciones' => 'required|array|min:1',
            'inscripciones.*.id_participante' => 'required|exists:tb_participante,id',
            'inscripciones.*.id_orquidea' => 'required|exists:tb_orquidea,id_orquidea',
            'inscripciones.*.correlativo' => 'required|integer|unique:tb_inscripcion,correlativo'
        ]);

        try {
            DB::beginTransaction();

            foreach ($request->inscripciones as $inscripcionData) {
                Inscripcion::create([
                    'id_participante' => $inscripcionData['id_participante'],
                    'id_orquidea' => $inscripcionData['id_orquidea'],
                    'correlativo' => $inscripcionData['correlativo']
                ]);
            }

            DB::commit();

            return redirect()->route('inscripcion.index')
                ->with('success', 'Inscripciones realizadas exitosamente');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Error al procesar las inscripciones: ' . $e->getMessage()]);
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
            return back()->withErrors(['error' => 'Error al eliminar la inscripción']);
        }
    }
}
