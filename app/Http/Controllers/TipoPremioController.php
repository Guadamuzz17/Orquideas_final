<?php

namespace App\Http\Controllers;

use App\Models\TipoPremio;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TipoPremioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tiposPremio = TipoPremio::ordenadosPorPosicion()->get();

        return Inertia::render('TipoPremios/Index', [
            'tiposPremio' => $tiposPremio
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('TipoPremios/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre_premio' => 'required|string|max:100',
                'descripcion' => 'nullable|string|max:255',
                'posicion' => 'required|integer|min:1',
                'color' => 'required|string|max:20',
                'activo' => 'boolean',
            ]);

            TipoPremio::create($validated);

            return redirect()->route('tipo-premios.index')
                ->with('success', 'Tipo de premio creado exitosamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al crear el tipo de premio: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(TipoPremio $tipoPremio)
    {
        return Inertia::render('TipoPremios/Show', [
            'tipoPremio' => $tipoPremio
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TipoPremio $tipoPremio)
    {
        return Inertia::render('TipoPremios/Edit', [
            'tipoPremio' => $tipoPremio
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TipoPremio $tipoPremio)
    {
        try {
            $validated = $request->validate([
                'nombre_premio' => 'required|string|max:100',
                'descripcion' => 'nullable|string|max:255',
                'posicion' => 'required|integer|min:1',
                'color' => 'required|string|max:20',
                'activo' => 'boolean',
            ]);

            $tipoPremio->update($validated);

            return redirect()->route('tipo-premios.index')
                ->with('success', 'Tipo de premio actualizado exitosamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar el tipo de premio: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TipoPremio $tipoPremio)
    {
        try {
            $tipoPremio->delete();

            return redirect()->route('tipo-premios.index')
                ->with('success', 'Tipo de premio eliminado exitosamente.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el tipo de premio: ' . $e->getMessage());
        }
    }

    /**
     * Toggle el estado activo del tipo de premio
     */
    public function toggleActivo(TipoPremio $tipoPremio)
    {
        try {
            $tipoPremio->update(['activo' => !$tipoPremio->activo]);

            $estado = $tipoPremio->activo ? 'activado' : 'desactivado';
            return back()->with('success', "Tipo de premio {$estado} exitosamente.");
        } catch (\Exception $e) {
            return back()->with('error', 'Error al cambiar el estado: ' . $e->getMessage());
        }
    }
}
