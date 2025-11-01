<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Trofeo;
use App\Models\Orquidea;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrofeoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $eventoActivo = session('evento_activo');

        return Inertia::render('Trofeos/index', [
            'trofeos' => Trofeo::with(['orquidea', 'clase', 'grupo'])
                ->where('id_evento', $eventoActivo)
                ->orderBy('fecha_ganador', 'desc')
                ->get()
                ->map(function ($trofeo) {
                    return [
                        'id_trofeo' => $trofeo->id_trofeo,
                        'nombre_orquidea' => $trofeo->orquidea->nombre_orquidea ?? 'Sin orquídea',
                        'nombre_clase' => $trofeo->clase->nombre_clase ?? 'Sin clase',
                        'nombre_grupo' => $trofeo->grupo->nombre_grupo ?? 'Sin grupo',
                        'categoria' => $trofeo->categoria,
                        'fecha_ganador' => $trofeo->fecha_ganador->format('d/m/Y'),
                    ];
                })
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Trofeos/Create', [
            'orquideas' => Orquidea::with(['clase', 'grupo'])
                ->whereNotIn('id_orquidea', function($query) {
                    $query->select('id_orquidea')->from('tb_trofeo');
                })
                ->get()
                ->map(function ($orquidea) {
                    return [
                        'id_orquidea' => $orquidea->id_orquidea,
                        'nombre_orquidea' => $orquidea->nombre_orquidea,
                        'clase' => $orquidea->clase->nombre_clase ?? 'Sin clase',
                        'grupo' => $orquidea->grupo->nombre_grupo ?? 'Sin grupo',
                    ];
                })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'id_orquidea' => 'required|exists:tb_orquidea,id_orquidea',
            'categoria' => 'required|string'
        ]);

        try {
            DB::beginTransaction();

            $orquidea = Orquidea::with(['clase', 'grupo'])->find($request->id_orquidea);

            Trofeo::create([
                'id_orquidea' => $request->id_orquidea,
                'id_clase' => $orquidea->id_clase,
                'id_grupp' => $orquidea->id_grupo,
                'categoria' => $request->categoria,
                'fecha_ganador' => now(),
                'id_evento' => session('evento_activo')
            ]);

            DB::commit();

            return redirect()
                ->route('trofeos.index')
                ->with('success', 'Trofeo asignado correctamente');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withInput()
                ->with('error', 'Error al asignar trofeo: '.$e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $trofeo = Trofeo::with(['orquidea', 'clase', 'grupo'])->find($id);

        if (!$trofeo) {
            return redirect()
                ->route('trofeos.index')
                ->with('error', 'Trofeo no encontrado');
        }

        return Inertia::render('Trofeos/Show', [
            'trofeo' => [
                'id_trofeo' => $trofeo->id_trofeo,
                'nombre_orquidea' => $trofeo->orquidea->nombre_orquidea ?? 'Sin orquídea',
                'nombre_clase' => $trofeo->clase->nombre_clase ?? 'Sin clase',
                'nombre_grupo' => $trofeo->grupo->nombre_grupo ?? 'Sin grupo',
                'categoria' => $trofeo->categoria,
                'fecha_ganador' => $trofeo->fecha_ganador->format('d/m/Y'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $trofeo = Trofeo::with(['orquidea'])->find($id);

        if (!$trofeo) {
            return redirect()
                ->route('trofeos.index')
                ->with('error', 'Trofeo no encontrado');
        }

        return Inertia::render('Trofeos/Edit', [
            'trofeo' => [
                'id_trofeo' => $trofeo->id_trofeo,
                'id_orquidea' => $trofeo->id_orquidea,
                'nombre_orquidea' => $trofeo->orquidea->nombre_orquidea ?? 'Sin orquídea',
                'categoria' => $trofeo->categoria,
            ],
            'orquideas' => Orquidea::all()->map(function ($orquidea) {
                return [
                    'id_orquidea' => $orquidea->id_orquidea,
                    'nombre_orquidea' => $orquidea->nombre_orquidea,
                ];
            })
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $request->validate([
                'categoria' => 'required|string'
            ]);

            $trofeo = Trofeo::find($id);

            if (!$trofeo) {
                return redirect()
                    ->route('trofeos.index')
                    ->with('error', 'Trofeo no encontrado');
            }

            $trofeo->update([
                'categoria' => $request->categoria
            ]);

            return redirect()
                ->route('trofeos.index')
                ->with('success', 'Trofeo actualizado correctamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar el trofeo: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $trofeo = Trofeo::find($id);

            if (!$trofeo) {
                return redirect()
                    ->route('trofeos.index')
                    ->with('error', 'Trofeo no encontrado');
            }

            $trofeo->delete();

            return redirect()
                ->route('trofeos.index')
                ->with('success', 'Trofeo eliminado correctamente');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al eliminar el trofeo: ' . $e->getMessage());
        }
    }
}
