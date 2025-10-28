<?php

namespace App\Http\Controllers;

use App\Models\FotoEvento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class FotosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $fotos = FotoEvento::orderBy('fecha_evento', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('Fotos/Index', [
            'fotos' => $fotos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Fotos/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_evento' => 'nullable|date',
            'imagen' => 'required|image|mimes:jpeg,jpg,png|max:5120', // 5MB máximo
        ]);

        // Procesar la imagen
        if ($request->hasFile('imagen')) {
            $imagen = $request->file('imagen');
            $nombreArchivo = Str::uuid() . '.' . $imagen->getClientOriginalExtension();

            // Guardar en storage/app/public/fotos
            $rutaImagen = $imagen->storeAs('fotos', $nombreArchivo, 'public');

            // Crear el registro en la base de datos
            FotoEvento::create([
                'titulo' => $request->titulo,
                'descripcion' => $request->descripcion,
                'fecha_evento' => $request->fecha_evento,
                'ruta_imagen' => $rutaImagen,
            ]);

            return redirect()->route('fotos.index')
                ->with('success', 'Fotografía subida exitosamente.');
        }

        return back()->with('error', 'Error al subir la imagen.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FotoEvento $foto)
    {
        return Inertia::render('Fotos/Show', [
            'foto' => $foto,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FotoEvento $foto)
    {
        return Inertia::render('Fotos/Edit', [
            'foto' => $foto,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FotoEvento $foto)
    {
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_evento' => 'nullable|date',
            'imagen' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
        ]);

        $data = [
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'fecha_evento' => $request->fecha_evento,
        ];

        // Si se subió una nueva imagen
        if ($request->hasFile('imagen')) {
            // Eliminar la imagen anterior
            if ($foto->ruta_imagen && Storage::disk('public')->exists($foto->ruta_imagen)) {
                Storage::disk('public')->delete($foto->ruta_imagen);
            }

            // Guardar la nueva imagen
            $imagen = $request->file('imagen');
            $nombreArchivo = Str::uuid() . '.' . $imagen->getClientOriginalExtension();
            $rutaImagen = $imagen->storeAs('fotos', $nombreArchivo, 'public');
            $data['ruta_imagen'] = $rutaImagen;
        }

        $foto->update($data);

        return redirect()->route('fotos.index')
            ->with('success', 'Fotografía actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FotoEvento $foto)
    {
        $foto->delete(); // El modelo se encarga de eliminar la imagen física

        return redirect()->route('fotos.index')
            ->with('success', 'Fotografía eliminada exitosamente.');
    }

    /**
     * API público para mostrar fotos (sin autenticación)
     */
    public function indexPublic(Request $request)
    {
        $query = FotoEvento::query();

        // Filtro por fecha
        if ($request->has('fecha')) {
            $query->whereDate('fecha_evento', $request->fecha);
        }

        // Filtro por búsqueda en título o descripción
        if ($request->has('buscar')) {
            $buscar = $request->buscar;
            $query->where(function ($q) use ($buscar) {
                $q->where('titulo', 'like', "%{$buscar}%")
                  ->orWhere('descripcion', 'like', "%{$buscar}%");
            });
        }

        $fotos = $query->orderBy('fecha_evento', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($foto) {
                return [
                    'id' => $foto->id,
                    'titulo' => $foto->titulo,
                    'descripcion' => $foto->descripcion,
                    'fecha_evento' => $foto->fecha_evento?->format('Y-m-d'),
                    'url_imagen' => $foto->url_imagen,
                ];
            });

        return response()->json($fotos);
    }
}
