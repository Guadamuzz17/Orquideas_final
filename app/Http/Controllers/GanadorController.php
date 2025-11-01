<?php

namespace App\Http\Controllers;

use App\Models\Ganador;
use App\Models\Inscripcion;
use App\Models\Participante;
use App\Models\Grupo;
use App\Models\Clase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class GanadorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $eventoActivo = session('evento_activo');

        $ganadores = Ganador::with([
            'inscripcion.participante',
            'inscripcion.orquidea.grupo',
            'inscripcion.orquidea.clase'
        ])
        ->where('id_evento', $eventoActivo)
        ->orderBy('created_at', 'desc')
        ->get();

        return Inertia::render('Ganadores/index', [
            'ganadores' => $ganadores
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $participantes = Participante::orderBy('nombre')->get();
        $grupos = Grupo::orderBy('nombre_grupo')->get();
        $clases = Clase::orderBy('nombre_clase')->get();
        $inscripciones = Inscripcion::with(['participante', 'orquidea.grupo', 'orquidea.clase'])
            ->orderBy('correlativo')
            ->get();

        return Inertia::render('Ganadores/Create', [
            'participantes' => $participantes,
            'grupos' => $grupos,
            'clases' => $clases,
            'inscripciones' => $inscripciones
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_inscripcion' => 'required|exists:tb_inscripcion,id_nscr',
            'posicion' => 'required|integer|min:1|max:3',
            'empate' => 'boolean'
        ]);

        // Verificar que la inscripción no tenga ya un ganador
        $existeGanador = Ganador::where('id_inscripcion', $request->id_inscripcion)->first();
        if ($existeGanador) {
            return back()->withErrors(['id_inscripcion' => 'Esta inscripción ya tiene un ganador asignado.']);
        }

        Ganador::create([
            'id_inscripcion' => $request->id_inscripcion,
            'posicion' => $request->posicion,
            'empate' => $request->empate ?? false,
            'fecha_ganador' => now(),
            'id_evento' => session('evento_activo')
        ]);

        return redirect()->route('ganadores.index')
            ->with('success', 'Ganador asignado correctamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ganador $ganador)
    {
        $ganador->load([
            'inscripcion.participante',
            'inscripcion.orquidea.grupo',
            'inscripcion.orquidea.clase'
        ]);

        return Inertia::render('Ganadores/Show', [
            'ganador' => $ganador
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ganador $ganador)
    {
        $ganador->load([
            'inscripcion.participante',
            'inscripcion.orquidea.grupo',
            'inscripcion.orquidea.clase'
        ]);

        return Inertia::render('Ganadores/Edit', [
            'ganador' => $ganador
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ganador $ganador)
    {
        $request->validate([
            'posicion' => 'required|integer|min:1|max:3',
            'empate' => 'boolean'
        ]);

        $ganador->update([
            'posicion' => $request->posicion,
            'empate' => $request->empate ?? false
        ]);

        return redirect()->route('ganadores.index')
            ->with('success', 'Ganador actualizado correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ganador $ganador)
    {
        $ganador->delete();

        return redirect()->route('ganadores.index')
            ->with('success', 'Ganador eliminado correctamente.');
    }

    /**
     * Search inscripciones for ganadores form
     */
    public function searchInscripciones(Request $request)
    {
        $query = Inscripcion::with(['participante', 'orquidea.grupo', 'orquidea.clase'])
            ->whereDoesntHave('ganador'); // Solo inscripciones sin ganador

        // Filtros
        if ($request->participante) {
            $query->whereHas('participante', function($q) use ($request) {
                $q->where('nombre', 'LIKE', '%' . $request->participante . '%');
            });
        }

        if ($request->grupo) {
            $query->whereHas('orquidea.grupo', function($q) use ($request) {
                $q->where('nombre_grupo', 'LIKE', '%' . $request->grupo . '%');
            });
        }

        if ($request->correlativo) {
            $query->where('correlativo', 'LIKE', '%' . $request->correlativo . '%');
        }

        if ($request->orquidea) {
            $query->whereHas('orquidea', function($q) use ($request) {
                $q->where('nombre_planta', 'LIKE', '%' . $request->orquidea . '%');
            });
        }

        $inscripciones = $query->orderBy('correlativo')->get();

        return response()->json($inscripciones);
    }
}
