<?php

namespace App\Http\Controllers;

use App\Models\Orquidea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrquideaController extends Controller
{
    /**
     * Obtener todas las orquídeas con sus relaciones
     */
    public function index()
    {
        return response()->json(Orquidea::with(['grupo', 'clase', 'participante'])->get());
    }

    /**
     * Obtener una orquídea específica por ID
     */
    public function show($id)
    {
        $orquidea = Orquidea::with(['grupo', 'clase', 'participante'])->find($id);
        if (!$orquidea) {
            return response()->json(['status' => 'error', 'message' => 'Orquídea no encontrada'], 404);
        }
        return response()->json($orquidea);
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

        return response()->json([
            'status' => 'success',
            'data' => $orquidea
        ]);
    }

    /**
     * Actualizar una orquídea existente
     */
    public function update(Request $request, $id)
    {
        $orquidea = Orquidea::find($id);
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

        return response()->json([
            'status' => 'success',
            'data' => $orquidea
        ]);
    }

    /**
     * Eliminar una orquídea
     */
    public function destroy($id)
    {
        $orquidea = Orquidea::find($id);
        if (!$orquidea) {
            return response()->json([
                'status' => 'error',
                'message' => 'Orquídea no encontrada'
            ], 404);
        }

        $orquidea->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Orquídea eliminada'
        ]);
    }
}
