<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grupo;
use App\Models\Clase;

class GrupoController extends Controller
{
    // === GRUPOS ===

    public function index()
    {
        return response()->json(Grupo::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_grupo' => 'required|string',
            'Cod_Grupo' => 'required|string|unique:tb_grupo,Cod_Grupo'
        ]);

        $grupo = Grupo::create($request->only(['nombre_grupo', 'Cod_Grupo']));

        return response()->json(['status' => 'success', 'data' => $grupo]);
    }

    public function show($id)
    {
        $grupo = Grupo::find($id);
        if (!$grupo) {
            return response()->json(['status' => 'error', 'message' => 'Grupo no encontrado'], 404);
        }
        return response()->json($grupo);
    }

    public function update(Request $request, $id)
    {
        $grupo = Grupo::find($id);
        if (!$grupo) {
            return response()->json(['status' => 'error', 'message' => 'Grupo no encontrado'], 404);
        }

        $request->validate([
            'nombre_grupo' => 'required|string',
            'Cod_Grupo' => 'required|string|unique:tb_grupo,Cod_Grupo,' . $id . ',id_grupo'
        ]);

        $grupo->update($request->only(['nombre_grupo', 'Cod_Grupo']));

        return response()->json(['status' => 'success', 'data' => $grupo]);
    }

    public function destroy($id)
    {
        $grupo = Grupo::find($id);
        if (!$grupo) {
            return response()->json(['status' => 'error', 'message' => 'Grupo no encontrado'], 404);
        }

        $grupo->delete();
        return response()->json(['status' => 'success', 'message' => 'Grupo eliminado']);
    }

    public function todosConClases()
    {
        return response()->json(Grupo::with('clases')->get());
    }

    public function clasesPorGrupo($id)
    {
        $grupo = Grupo::with('clases')->find($id);

        if (!$grupo) {
            return response()->json(['status' => 'error', 'message' => 'Grupo no encontrado'], 404);
        }

        return response()->json([
            'status' => 'success',
            'grupo' => $grupo->nombre_grupo,
            'clases' => $grupo->clases
        ]);
    }

    public function dropdownData()
    {
        return response()->json([
            'grupos' => Grupo::all(),
            'clases' => Clase::all()
        ]);
    }

    // === CLASES ===

    public function listarClases()
    {
        return response()->json(Clase::with('grupo')->get());
    }

    public function crearClase(Request $request)
    {
        $request->validate([
            'nombre_clase' => 'required|string',
            'id_grupp' => 'required|exists:tb_grupo,id_grupo'
        ]);

        $clase = Clase::create([
            'nombre_clase' => $request->nombre_clase,
            'id_grupp' => $request->id_grupp
        ]);

        return response()->json(['status' => 'success', 'data' => $clase]);
    }

    public function editarClase(Request $request, $id)
    {
        $clase = Clase::find($id);
        if (!$clase) {
            return response()->json(['status' => 'error', 'message' => 'Clase no encontrada'], 404);
        }

        $request->validate([
            'nombre_clase' => 'required|string',
            'id_grupp' => 'required|exists:tb_grupo,id_grupo'
        ]);

        $clase->update([
            'nombre_clase' => $request->nombre_clase,
            'id_grupp' => $request->id_grupp
        ]);

        return response()->json(['status' => 'success', 'data' => $clase]);
    }

    public function eliminarClase($id)
    {
        $clase = Clase::find($id);
        if (!$clase) {
            return response()->json(['status' => 'error', 'message' => 'Clase no encontrada'], 404);
        }

        $clase->delete();
        return response()->json(['status' => 'success', 'message' => 'Clase eliminada']);
    }
}
