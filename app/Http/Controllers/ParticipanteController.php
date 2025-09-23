<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Participante;
use App\Models\TipoParticipante;
use App\Models\Departamento;
use App\Models\Municipio;
use App\Models\Aso;
use Illuminate\Support\Facades\Validator;

class ParticipanteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $participantes = Participante::with(['tipo', 'departamento', 'municipio', 'aso'])->get();
        
        return Inertia::render('participantes/index', [
            'participantes' => $participantes
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tiposParticipante = TipoParticipante::all();
        $departamentos = Departamento::all();
        $municipios = Municipio::all();
        $asociaciones = Aso::all();

        return Inertia::render('participantes/Create', [
            'tiposParticipante' => $tiposParticipante,
            'departamentos' => $departamentos,
            'municipios' => $municipios,
            'asociaciones' => $asociaciones
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'numero_telefonico' => 'required|string|max:20',
            'direccion' => 'required|string|max:500',
            'id_tipo' => 'required|exists:tb_tipoparticipante,id_tipo',
            'id_departamento' => 'required|exists:tb_departamento,id_departamento',
            'id_municipio' => 'required|exists:tb_municipio,id_municipio',
            'id_aso' => 'required|exists:tb_aso,id_aso',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = $request->all();
        // Asignar null para id_usuario ya que ahora es nullable
        $data['id_usuario'] = null;

        Participante::create($data);

        return redirect()->route('participantes.index')
            ->with('success', 'Participante creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $participante = Participante::with(['tipo', 'departamento', 'municipio', 'aso'])->findOrFail($id);
        
        return response()->json($participante);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $participante = Participante::findOrFail($id);
        $tiposParticipante = TipoParticipante::all();
        $departamentos = Departamento::all();
        $municipios = Municipio::all();
        $asociaciones = Aso::all();

        return Inertia::render('participantes/Edit', [
            'participante' => $participante,
            'tiposParticipante' => $tiposParticipante,
            'departamentos' => $departamentos,
            'municipios' => $municipios,
            'asociaciones' => $asociaciones
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $participante = Participante::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'numero_telefonico' => 'required|string|max:20',
            'direccion' => 'required|string|max:500',
            'id_tipo' => 'required|exists:tb_tipoparticipante,id_tipo',
            'id_departamento' => 'required|exists:tb_departamento,id_departamento',
            'id_municipio' => 'required|exists:tb_municipio,id_municipio',
            'id_aso' => 'required|exists:tb_aso,id_aso',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $data = $request->all();
        // Mantener el usuario original o asignar null si no existe
        if (!isset($data['id_usuario'])) {
            $data['id_usuario'] = $participante->id_usuario ?? null;
        }

        $participante->update($data);

        return redirect()->route('participantes.index')
            ->with('success', 'Participante actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $participante = Participante::findOrFail($id);
        $participante->delete();

        return redirect()->route('participantes.index')
            ->with('success', 'Participante eliminado exitosamente.');
    }

    /**
     * Get municipios by departamento
     */
    public function getMunicipiosByDepartamento($departamentoId)
    {
        $municipios = Municipio::where('id_departamento', $departamentoId)->get();
        return response()->json($municipios);
    }

    /**
     * Show the formato page
     */
    public function formato()
    {
        return Inertia::render('participantes/Formato');
    }
}
