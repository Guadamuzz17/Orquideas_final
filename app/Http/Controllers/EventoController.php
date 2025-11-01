<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $eventos = Evento::orderBy('fecha_inicio', 'desc')->paginate(10);

        return Inertia::render('eventos/index', [
            'eventos' => $eventos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('eventos/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre_evento' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'estado' => 'required|in:en curso,finalizado,programado',
        ]);

        $evento = Evento::create($request->all());

        return redirect()->route('eventos.index')
            ->with('success', 'Evento creado exitosamente');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $evento = Evento::with(['participantes', 'orquideas', 'inscripciones', 'ganadores'])
            ->findOrFail($id);

        return Inertia::render('eventos/Show', [
            'evento' => $evento
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $evento = Evento::findOrFail($id);

        return Inertia::render('eventos/Edit', [
            'evento' => $evento
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $evento = Evento::findOrFail($id);

        $request->validate([
            'nombre_evento' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'estado' => 'required|in:en curso,finalizado,programado',
        ]);

        $evento->update($request->all());

        return redirect()->route('eventos.index')
            ->with('success', 'Evento actualizado exitosamente');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $evento = Evento::findOrFail($id);

        // Verificar si tiene registros asociados
        if ($evento->participantes()->count() > 0 ||
            $evento->orquideas()->count() > 0 ||
            $evento->inscripciones()->count() > 0) {

            return redirect()->route('eventos.index')
                ->with('error', 'No se puede eliminar un evento con registros asociados');
        }

        $evento->delete();

        return redirect()->route('eventos.index')
            ->with('success', 'Evento eliminado exitosamente');
    }

    /**
     * Seleccionar evento activo y guardarlo en sesión
     */
    public function seleccionar($id)
    {
        $evento = Evento::findOrFail($id);

        session(['evento_activo' => $evento->id_evento]);
        session(['evento_nombre' => $evento->nombre_evento]);

        return redirect()->route('dashboard')
            ->with('success', "Evento '{$evento->nombre_evento}' seleccionado");
    }

    /**
     * Cerrar evento activo
     */
    public function cerrarEvento()
    {
        session()->forget(['evento_activo', 'evento_nombre']);

        return redirect()->route('eventos.index')
            ->with('info', 'Evento cerrado. Seleccione un evento para continuar.');
    }
}

