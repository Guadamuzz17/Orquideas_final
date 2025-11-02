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
use Illuminate\Support\Facades\Log;

class ParticipanteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $eventoActivo = session('evento_activo');

        $participantes = Participante::with(['tipo', 'departamento', 'municipio', 'aso'])
            ->where('id_evento', $eventoActivo)
            ->get();

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
     * Buscar participantes de eventos anteriores para reciclaje
     */
    public function searchForRecycle(Request $request)
    {
        $search = $request->input('query');
        $eventoActivo = session('evento_activo');

        // Log para debugging
        Log::info('Búsqueda de reciclaje', [
            'query' => $search,
            'evento_activo' => $eventoActivo,
            'length' => strlen($search)
        ]);

        // Validar mínimo 2 caracteres (reducido de 3)
        if (strlen($search) < 2) {
            return response()->json([]);
        }

        // Normalizar búsqueda: quitar acentos y convertir a minúsculas
        $searchNormalized = strtolower($search);

        // Buscar participantes en TODOS los eventos o solo otros eventos si hay evento activo
        $query = Participante::with(['tipo', 'departamento', 'municipio', 'aso', 'evento']);

        // Si hay evento activo, excluir participantes de ese evento
        if ($eventoActivo) {
            $query->where('id_evento', '!=', $eventoActivo);
        }

        $participantes = $query->where(function($q) use ($search, $searchNormalized) {
                // Búsqueda flexible: acepta coincidencias parciales
                $q->where('nombre', 'LIKE', "%{$search}%")
                  ->orWhere('numero_telefonico', 'LIKE', "%{$search}%")
                  // Búsqueda insensible a mayúsculas
                  ->orWhereRaw('LOWER(nombre) LIKE ?', ["%{$searchNormalized}%"])
                  // Búsqueda por palabras individuales
                  ->orWhere(function($subQ) use ($search) {
                      $palabras = explode(' ', $search);
                      foreach ($palabras as $palabra) {
                          if (strlen(trim($palabra)) >= 2) {
                              $subQ->orWhere('nombre', 'LIKE', "%{$palabra}%");
                          }
                      }
                  });
            })
            ->select('id', 'nombre', 'numero_telefonico', 'direccion',
                     'id_tipo', 'id_departamento', 'id_municipio', 'id_aso', 'id_evento')
            ->distinct()
            ->limit(15) // Aumentado de 10 a 15
            ->get();

        Log::info('Resultados encontrados', [
            'count' => $participantes->count(),
            'participantes' => $participantes->pluck('nombre')
        ]);

        // Agrupar por participante único (mismo nombre)
        $uniqueParticipantes = $participantes->groupBy('nombre')->map(function($group) {
            $first = $group->first();
            return [
                'id_participante' => $first->id, // Usar 'id' en lugar de 'id_participante'
                'nombre' => $first->nombre,
                'numero_telefonico' => $first->numero_telefonico,
                'direccion' => $first->direccion,
                'id_tipo' => $first->id_tipo,
                'id_departamento' => $first->id_departamento,
                'id_municipio' => $first->id_municipio,
                'id_aso' => $first->id_aso,
                'tipo' => $first->tipo,
                'departamento' => $first->departamento,
                'municipio' => $first->municipio,
                'aso' => $first->aso,
                'evento_previo' => $first->evento ? $first->evento->nombre : 'N/A',
                'eventos_participados' => $group->count()
            ];
        })->values();

        return response()->json($uniqueParticipantes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
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
            $data['id_evento'] = session('evento_activo'); // Asociar al evento activo

            Participante::create($data);

            return redirect()->route('participantes.index')
                ->with('success', 'Participante creado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al crear el participante: ' . $e->getMessage())
                ->withInput();
        }
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
        try {
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
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al actualizar el participante: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $participante = Participante::findOrFail($id);
            $participante->delete();

            return redirect()->route('participantes.index')
                ->with('success', 'Participante eliminado exitosamente.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Error al eliminar el participante: ' . $e->getMessage());
        }
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
