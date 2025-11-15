<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Evento;
use Inertia\Inertia;

class ValidarEventoActivo
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Rutas que no requieren evento activo
        $rutasExcluidas = [
            'eventos.*',
            'login',
            'register',
            'logout',
            'password.*',
        ];

        // Verificar si la ruta actual está excluida
        foreach ($rutasExcluidas as $patron) {
            if ($request->routeIs($patron)) {
                return $next($request);
            }
        }

        // Verificar si hay un evento activo en sesión
        if (!session()->has('evento_activo')) {
            return redirect()->route('eventos.index')
                ->with('warning', 'Debe seleccionar un evento para continuar.');
        }

        // Obtener información del evento activo
        $eventoActivo = Evento::find(session('evento_activo'));

        if (!$eventoActivo) {
            return redirect()->route('eventos.index')
                ->with('error', 'El evento seleccionado no existe.');
        }

        // Compartir información del evento con todas las vistas de Inertia
        Inertia::share([
            'eventoActivo' => [
                'id' => $eventoActivo->id_evento,
                'nombre' => $eventoActivo->nombre_evento,
                'estado' => $eventoActivo->estado,
                'fecha_inicio' => $eventoActivo->fecha_inicio,
                'fecha_fin' => $eventoActivo->fecha_fin,
                'bloqueado' => $eventoActivo->estado === 'finalizado',
            ],
        ]);

        return $next($request);
    }
}
