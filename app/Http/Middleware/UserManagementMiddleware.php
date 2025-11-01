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

        $user = Auth::user();

        // Por ahora, permitir acceso a todos los usuarios autenticados
        // En el futuro se puede implementar roles/permisos específicos
        // Ejemplo de implementación con roles:
        /*
        if (!$user->hasRole('admin') && !$user->hasPermission('manage_users')) {
            abort(403, 'No tienes permisos para acceder a la gestión de usuarios.');
        }
        */

        // Prevenir que usuarios no administradores modifiquen otros usuarios
        // (excepto el listado que ya está protegido por el controlador)
        if ($request->route('user')) {
            $targetUserId = $request->route('user')->id ?? $request->route('user');

            // Si está intentando modificar otro usuario y no es admin
            // Por ahora permitir todo ya que no hay sistema de roles implementado
            // En el futuro agregar: && !$user->hasRole('admin')
            if ($targetUserId != $user->id) {
                // Permitir por ahora, en futuro implementar control de roles
                // abort(403, 'No tienes permisos para modificar otros usuarios.');
            }
        }

        return $next($request);
    }
}
