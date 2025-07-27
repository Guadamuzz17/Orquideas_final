<?php

namespace App\Http\Controllers;

use App\Models\Clase;
use App\Models\Grupo;
use App\Models\Orquidea;
use App\Models\Participante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class OrquideaController extends Controller
{
    /**
     * Obtener todas las orquídeas con sus relaciones
     */
    public function index()
    {
        if (request()->wantsJson()) {
            return Orquidea::with(['grupo', 'clase', 'participante'])->get();
        }

        $orquideas = Orquidea::with(['grupo', 'clase', 'participante'])->paginate(10);
        return Inertia::render('orquideas/index', [
            'orquideas' => $orquideas,
        ]);
    }

    public function create()
    {
        return Inertia::render('orquideas/form', [
            'grupos' => Grupo::select('id_grupo', 'nombre_grupo')->get(),
            'clases' => Clase::select('id_case', 'nombre_clase', 'id_grupp')->get(),
            'participantes' => Participante::select('id', 'nombre')->get(),
        ]);
    }

    /**
     * Obtener una orquídea específica por ID
     */
    public function show(Orquidea $orquidea)
    {
        $orquidea->load(['grupo', 'clase', 'participante']);

        if (request()->wantsJson()) {
            return response()->json($orquidea);
        }

        return Inertia::render('orquideas/show', [
            'orquidea' => $orquidea,
        ]);
    }

    public function edit(Orquidea $orquidea)
    {
        $orquidea->load(['grupo', 'clase', 'participante']);
        return Inertia::render('orquideas/form', [
            'orquidea' => $orquidea,
            'grupos' => Grupo::select('id_grupo', 'nombre_grupo')->get(),
            'clases' => Clase::select('id_case', 'nombre_clase', 'id_grupp')->get(),
            'participantes' => Participante::select('id', 'nombre')->get(),
        ]);
    }

    /**
     * Crear una nueva orquídea
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre_planta' => 'required|string',
            'origen'       => 'required|string',
            'id_grupo'     => 'required|integer',
            'id_case'       => 'required|integer',
            'a'            => 'required|integer',
            'foto'         => 'nullable|image|mimes:jpeg,png,jpg',
        ]);

        // Generar código único para la orquídea
        $codigo = now()->format('YmdHis');

        // Guardar foto si se sube
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->storeAs(
                'public/orquideas',
                "{$codigo}." . $request->file('foto')->getClientOriginalExtension()
            );
        }

        // Crear orquídea en BD
        $orquidea = Orquidea::create([
            'nombre_planta'  => $request->nombre_planta,
            'origen'         => $request->origen,
            'foto'           => $fotoPath ? basename($fotoPath) : null,
            'id_grupo'       => $request->id_grupo,
            'id_case'        => $request->id_case,
            'a'             => $request->a,
            'codigo_orquide' => $codigo,
            'gr_code'       => null, // Columna para QR (ahora null)
        ]);

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'data' => $orquidea]);
        }

        return redirect()->route('orquideas.index');
    }

    /**
     * Actualizar una orquídea existente
     */
    public function update(Request $request, Orquidea $orquidea)
    {
        if (!$orquidea) {
            return response()->json([
                'status' => 'error',
                'message' => 'Orquídea no encontrada'
            ], 404);
        }

        $request->validate([
            'nombre_planta' => 'required|string',
            'origen'        => 'required|string',
            'id_grupo'      => 'required|integer',
            'id_case'       => 'required|integer',
            'a'             => 'required|integer',
            'foto'         => 'nullable|image|mimes:jpeg,png,jpg',
        ]);

        if ($request->hasFile('foto')) {
            $newName = now()->format('YmdHis') . '.' . $request->file('foto')->getClientOriginalExtension();
            $fotoPath = $request->file('foto')->storeAs('public/orquideas', $newName);
            $orquidea->foto = basename($fotoPath);
        }

        $orquidea->update([
            'nombre_planta' => $request->nombre_planta,
            'origen'       => $request->origen,
            'id_grupo'      => $request->id_grupo,
            'id_case'       => $request->id_case,
            'a'            => $request->a,
        ]);

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'data' => $orquidea]);
        }

        return redirect()->route('orquideas.index');
    }

    /**
     * Eliminar una orquídea
     */
    public function destroy(Orquidea $orquidea)
    {
        if (!$orquidea) {
            return response()->json([
                'status' => 'error',
                'message' => 'Orquídea no encontrada'
            ], 404);
        }

        $orquidea->delete();

        if (request()->wantsJson()) {
            return response()->json(['status' => 'success']);
        }

        return redirect()->route('orquideas.index');
    }
}
