<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

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

        return $next($request);
    }
}
