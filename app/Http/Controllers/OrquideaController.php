<?php

namespace App\Http\Controllers;

use App\Models\Clase;
use App\Models\Grupo;
use App\Models\Orquidea;
use App\Models\Participante;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class OrquideaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $eventoActivo = session('evento_activo');

        if (request()->wantsJson()) {
            return Orquidea::with(['grupo', 'clase', 'participante'])
                ->where('id_evento', $eventoActivo)
                ->get();
        }

        $orquideas = Orquidea::with(['grupo', 'clase', 'participante'])
            ->where('id_evento', $eventoActivo)
            ->get();

        return Inertia::render('registro_orquideas/index', [
            'orquideas' => $orquideas,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $eventoActivo = session('evento_activo');

        $grupos = Grupo::all();
        $clases = Clase::all();
        $participantes = Participante::where('id_evento', $eventoActivo)->get();

        return Inertia::render('registro_orquideas/Create', [
            'grupos' => $grupos,
            'clases' => $clases,
            'participantes' => $participantes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre_planta' => 'required|string|max:255',
                'origen' => 'required|string|max:255',
                'id_grupo' => 'required|exists:tb_grupo,id_grupo',
                'id_clase' => 'required|exists:tb_clase,id_clase',
                'cantidad' => 'required|integer|min:1',
                'id_participante' => 'required|exists:tb_participante,id',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            $data = $request->all();
            $data['id_evento'] = session('evento_activo'); // Asociar al evento activo

            // Manejar la subida de imagen
            if ($request->hasFile('foto')) {
                $foto = $request->file('foto');
                $nombreFoto = time() . '_' . $foto->getClientOriginalName();
                $rutaFoto = $foto->storeAs('orquideas', $nombreFoto, 'public');
                $data['foto'] = $rutaFoto;
            }

            Orquidea::create($data);

            return redirect()->route('orquideas.index')
                ->with('success', 'Orquídea registrada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al registrar la orquídea: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
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

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Orquidea $orquidea)
    {
        $orquidea->load(['grupo', 'clase', 'participante']);
        return Inertia::render('orquideas/form', [
            'orquidea' => $orquidea,
            'grupos' => Grupo::select('id_grupo', 'nombre_grupo')->get(),
            'clases' => Clase::select('id_clase', 'nombre_clase', 'id_grupp')->get(),
            'participantes' => Participante::select('id', 'nombre')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Orquidea $orquidea)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nombre_planta' => 'required|string|max:255',
                'origen' => 'required|string|max:255',
                'id_grupo' => 'required|exists:tb_grupo,id_grupo',
                'id_clase' => 'required|exists:tb_clase,id_clase',
                'cantidad' => 'required|integer|min:1',
                'id_participante' => 'required|exists:tb_participante,id',
                'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return back()->withErrors($validator)->withInput();
            }

            $data = $request->all();

            // Manejar la subida de imagen
            if ($request->hasFile('foto')) {
                // Eliminar imagen anterior si existe
                if ($orquidea->foto) {
                    Storage::disk('public')->delete($orquidea->foto);
                }

                $foto = $request->file('foto');
                $nombreFoto = time() . '_' . $foto->getClientOriginalName();
                $rutaFoto = $foto->storeAs('orquideas', $nombreFoto, 'public');
                $data['foto'] = $rutaFoto;
            }

            $orquidea->update($data);

            return redirect()->route('orquideas.index')
                ->with('success', 'Orquídea actualizada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al actualizar la orquídea: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Orquidea $orquidea)
    {
        try {
            // Eliminar imagen si existe
            if ($orquidea->foto) {
                Storage::disk('public')->delete($orquidea->foto);
            }

            $orquidea->delete();

            return redirect()->route('orquideas.index')
                ->with('success', 'Orquídea eliminada exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al eliminar la orquídea: ' . $e->getMessage());
        }
    }

    /**
     * Get image URL for display
     */
    public function getImageUrl($orquidea)
    {
        if ($orquidea->foto) {
            return Storage::url($orquidea->foto);
        }
        return null;
    }

    /**
     * Buscar sugerencias de nombres de orquídeas
     */
    public function buscarSugerencias(Request $request)
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        // Buscar nombres únicos de orquídeas que coincidan con la búsqueda
        $sugerencias = Orquidea::select('nombre_planta')
            ->where('nombre_planta', 'LIKE', '%' . $query . '%')
            ->distinct()
            ->limit(10)
            ->pluck('nombre_planta');

        return response()->json($sugerencias);
    }
}
