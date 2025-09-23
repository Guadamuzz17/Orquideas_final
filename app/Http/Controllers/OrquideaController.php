<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Orquidea;
use App\Models\Grupo;
use App\Models\Clase;
use App\Models\Participante;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class OrquideaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orquideas = Orquidea::with(['grupo', 'clase', 'participante'])->get();
        
        return Inertia::render('registro_orquideas/index', [
            'orquideas' => $orquideas
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $grupos = Grupo::all();
        $clases = Clase::all();
        $participantes = Participante::all();

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
        $validator = Validator::make($request->all(), [
            'nombre_planta' => 'required|string|max:255',
            'origen' => 'required|in:Especie,Híbrida',
            'id_grupo' => 'required|exists:tb_grupo,id_grupo',
            'id_clase' => 'required|exists:tb_clase,id_clase',
            'cantidad' => 'required|integer|min:1|max:99',
            'id_participante' => 'required|exists:tb_participante,id',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $request->all();

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
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $orquidea = Orquidea::with(['grupo', 'clase', 'participante'])->findOrFail($id);
        
        return Inertia::render('registro_orquideas/Show', [
            'orquidea' => $orquidea
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $orquidea = Orquidea::findOrFail($id);
        $grupos = Grupo::all();
        $clases = Clase::all();
        $participantes = Participante::all();

        return Inertia::render('registro_orquideas/Edit', [
            'orquidea' => $orquidea,
            'grupos' => $grupos,
            'clases' => $clases,
            'participantes' => $participantes
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $orquidea = Orquidea::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nombre_planta' => 'required|string|max:255',
            'origen' => 'required|in:Especie,Híbrida',
            'id_grupo' => 'required|exists:tb_grupo,id_grupo',
            'id_clase' => 'required|exists:tb_clase,id_clase',
            'cantidad' => 'required|integer|min:1|max:99',
            'id_participante' => 'required|exists:tb_participante,id',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $data = $request->all();

        // Manejar la actualización de imagen
        if ($request->hasFile('foto')) {
            // Eliminar la imagen anterior si existe
            if ($orquidea->foto && Storage::disk('public')->exists($orquidea->foto)) {
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
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $orquidea = Orquidea::findOrFail($id);

        // Eliminar la imagen si existe
        if ($orquidea->foto && Storage::disk('public')->exists($orquidea->foto)) {
            Storage::disk('public')->delete($orquidea->foto);
        }

        $orquidea->delete();

        return redirect()->route('orquideas.index')
            ->with('success', 'Orquídea eliminada exitosamente.');
    }

    /**
     * Get clases by grupo for AJAX requests
     */
    public function getClasesByGrupo($grupoId)
    {
        $clases = Clase::where('id_grupp', $grupoId)->get();
        return response()->json($clases);
    }
}
