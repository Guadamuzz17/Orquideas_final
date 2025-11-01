<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use App\Models\Permiso;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Rol::withCount('permisos', 'usuarios')->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permisos = Permiso::all()->groupBy('modulo');

        return Inertia::render('Roles/Create', [
            'permisos' => $permisos,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:roles,nombre',
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
            'permisos' => 'array',
            'permisos.*' => 'exists:permisos,id',
        ]);

        $rol = Rol::create([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => $validated['activo'] ?? true,
        ]);

        if (isset($validated['permisos'])) {
            $rol->permisos()->attach($validated['permisos']);
        }

        return redirect()->route('roles.index')->with('success', 'Rol creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rol $rol)
    {
        $rol->load('permisos');
        $permisos = Permiso::all()->groupBy('modulo');

        return Inertia::render('Roles/Edit', [
            'rol' => $rol,
            'permisos' => $permisos,
            'permisosAsignados' => $rol->permisos->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rol $rol)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:roles,nombre,' . $rol->id,
            'descripcion' => 'nullable|string|max:255',
            'activo' => 'boolean',
            'permisos' => 'array',
            'permisos.*' => 'exists:permisos,id',
        ]);

        $rol->update([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'] ?? null,
            'activo' => $validated['activo'] ?? true,
        ]);

        if (isset($validated['permisos'])) {
            $rol->permisos()->sync($validated['permisos']);
        } else {
            $rol->permisos()->detach();
        }

        return redirect()->route('roles.index')->with('success', 'Rol actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rol $rol)
    {
        // Verificar si hay usuarios con este rol
        if ($rol->usuarios()->count() > 0) {
            return back()->with('error', 'No se puede eliminar el rol porque tiene usuarios asignados.');
        }

        $rol->permisos()->detach();
        $rol->delete();

        return redirect()->route('roles.index')->with('success', 'Rol eliminado exitosamente.');
    }
}
