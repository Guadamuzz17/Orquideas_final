<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Clase;
use App\Models\Grupo;
use Inertia\Inertia;

class ClaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (request()->wantsJson()) {
            return Clase::with('grupo')->get();
        }

        $clases = Clase::with('grupo')->paginate(10);
        $grupos = Grupo::all();

        return Inertia::render('clases/index', [
            'clases' => $clases,
            'grupos' => $grupos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $grupos = Grupo::all();
        return Inertia::render('clases/Create', [
            'grupos' => $grupos
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre_clase' => 'required|string|max:255',
            'id_grupo' => 'required|exists:tb_grupo,id_grupo'
        ]);

        $clase = Clase::create([
            'nombre_clase' => $request->nombre_clase,
            'id_grupp' => $request->id_grupo  // Note: using id_grupp (database column) for id_grupo (form field)
        ]);

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'data' => $clase]);
        }

        return redirect()->route('clases.index')->with('success', 'Clase creada exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $clase = Clase::with('grupo')->findOrFail($id);

        if (request()->wantsJson()) {
            return response()->json($clase);
        }

        return Inertia::render('clases/Show', [
            'clase' => $clase
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $clase = Clase::with('grupo')->findOrFail($id);
        $grupos = Grupo::all();

        return Inertia::render('clases/Edit', [
            'clase' => $clase,
            'grupos' => $grupos
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $clase = Clase::findOrFail($id);

        $request->validate([
            'nombre_clase' => 'required|string|max:255',
            'id_grupo' => 'required|exists:tb_grupo,id_grupo'
        ]);

        $clase->update([
            'nombre_clase' => $request->nombre_clase,
            'id_grupp' => $request->id_grupo  // Note: using id_grupp (database column) for id_grupo (form field)
        ]);

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'data' => $clase]);
        }

        return redirect()->route('clases.index')->with('success', 'Clase actualizada exitosamente');
    }    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $clase = Clase::findOrFail($id);
        $clase->delete();

        if (request()->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Clase eliminada exitosamente']);
        }

        return redirect()->route('clases.index')->with('success', 'Clase eliminada exitosamente');
    }
}
