<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class UserManagementMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar que el usuario esté autenticado
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        // Verificar si el usuario tiene permisos para gestionar usuarios
        // Si no tiene rol asignado, permitir acceso (para mantener compatibilidad con usuarios existentes)
        if ($user->rol_id) {
            // Si tiene rol pero no tiene el permiso de usuarios, denegar acceso
            if (!$user->tienePermiso('usuarios.ver')) {
                abort(403, 'No tienes permisos para acceder a la gestión de usuarios.');
            }

            // Verificar permisos específicos según la acción
            $route = $request->route();
            $routeName = $route ? $route->getName() : '';

            // Verificar permisos de creación
            if (str_contains($routeName, 'create') || str_contains($routeName, 'store')) {
                if (!$user->tienePermiso('usuarios.crear')) {
                    abort(403, 'No tienes permisos para crear usuarios.');
                }
            }

            // Verificar permisos de edición
            if (str_contains($routeName, 'edit') || str_contains($routeName, 'update')) {
                if (!$user->tienePermiso('usuarios.editar')) {
                    abort(403, 'No tienes permisos para editar usuarios.');
                }
            }

            // Verificar permisos de eliminación
            if (str_contains($routeName, 'destroy')) {
                if (!$user->tienePermiso('usuarios.eliminar')) {
                    abort(403, 'No tienes permisos para eliminar usuarios.');
                }
            }
        }

        return $next($request);
    }
}
