<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string|array  $permisos  Permisos requeridos (puede ser uno o varios separados por |)
     */
    public function handle(Request $request, Closure $next, string $permisos): Response
    {
        // Si el usuario no está autenticado
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Si el usuario no tiene rol asignado (usuarios registrados públicamente)
        if (!$user->rol_id) {
            abort(403, 'No tienes permisos para acceder a esta sección.');
        }

        // Convertir permisos a array si se pasaron varios separados por |
        $permisosRequeridos = explode('|', $permisos);

        // Verificar si el usuario tiene al menos uno de los permisos requeridos
        if (!$user->tieneAlgunPermiso($permisosRequeridos)) {
            abort(403, 'No tienes permisos suficientes para realizar esta acción.');
        }

        return $next($request);
    }
}
