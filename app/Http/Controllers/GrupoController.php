<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Grupo;
use App\Models\Clase;
use Inertia\Inertia;

class GrupoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (request()->wantsJson()) {
            return Grupo::with('clases')->get();
        }

        $grupos = Grupo::with('clases')->paginate(10);
        return Inertia::render('grupos/index', [
            'grupos' => $grupos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('grupos/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre_grupo' => 'required|string|max:255',
            'Cod_Grupo' => 'required|string|max:50|unique:tb_grupo,Cod_Grupo'
        ]);

        $grupo = Grupo::create($request->only(['nombre_grupo', 'Cod_Grupo']));

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'data' => $grupo]);
        }

        return redirect()->route('grupos.index')->with('success', 'Grupo creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $grupo = Grupo::with('clases')->findOrFail($id);

        if (request()->wantsJson()) {
            return response()->json($grupo);
        }

        return Inertia::render('grupos/Show', [
            'grupo' => $grupo
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $grupo = Grupo::findOrFail($id);
        return Inertia::render('grupos/Edit', [
            'grupo' => $grupo
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $grupo = Grupo::findOrFail($id);

        $request->validate([
            'nombre_grupo' => 'required|string|max:255',
            'Cod_Grupo' => 'required|string|max:50|unique:tb_grupo,Cod_Grupo,' . $id . ',id_grupo'
        ]);

        $grupo->update($request->only(['nombre_grupo', 'Cod_Grupo']));

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'data' => $grupo]);
        }

        return redirect()->route('grupos.index')->with('success', 'Grupo actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $grupo = Grupo::findOrFail($id);

        // Check if grupo has clases
        if ($grupo->clases()->count() > 0) {
            if (request()->wantsJson()) {
                return response()->json(['status' => 'error', 'message' => 'No se puede eliminar un grupo que tiene clases asociadas'], 400);
            }
            return redirect()->route('grupos.index')->with('error', 'No se puede eliminar un grupo que tiene clases asociadas');
        }

        $grupo->delete();

        if (request()->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Grupo eliminado exitosamente']);
        }

        return redirect()->route('grupos.index')->with('success', 'Grupo eliminado exitosamente');
    }

    // Additional API methods for compatibility
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
            'grupos' => Grupo::select('id_grupo', 'nombre_grupo', 'Cod_Grupo')->get(),
            'clases' => Clase::select('id_clase', 'nombre_clase', 'id_grupp')->get()
        ]);
    }
}
