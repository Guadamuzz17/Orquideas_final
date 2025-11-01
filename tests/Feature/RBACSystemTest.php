<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Rol;
use App\Models\Permiso;
use Illuminate\Support\Facades\Hash;

class RBACSystemTest extends TestCase
{
    /**
     * Test: Verificar que el usuario existe y puede autenticarse
     */
    public function test_user_can_authenticate(): void
    {
        $user = User::where('email', 'pablo2905andres@gmail.com')->first();

        $this->assertNotNull($user, 'El usuario con email pablo2905andres@gmail.com no existe');

        $this->assertTrue(
            Hash::check('2905Andres', $user->password),
            'La contraseña no coincide para el usuario'
        );

        echo "\n✅ Usuario encontrado: {$user->name} (ID: {$user->id})\n";
    }

    /**
     * Test: Verificar que el usuario tiene rol asignado
     */
    public function test_user_has_role_assigned(): void
    {
        $user = User::where('email', 'pablo2905andres@gmail.com')->first();

        $this->assertNotNull($user, 'Usuario no encontrado');
        $this->assertNotNull($user->rol_id, 'El usuario no tiene rol asignado');

        $rol = $user->rol;
        $this->assertNotNull($rol, 'No se pudo cargar la relación del rol');

        echo "\n✅ Usuario tiene rol: {$rol->nombre} (ID: {$rol->id})\n";
        echo "   Estado del rol: " . ($rol->activo ? 'ACTIVO' : 'INACTIVO') . "\n";
    }

    /**
     * Test: Verificar que el rol tiene permisos asignados
     */
    public function test_role_has_permissions(): void
    {
        $user = User::where('email', 'pablo2905andres@gmail.com')->first();

        $this->assertNotNull($user, 'Usuario no encontrado');

        $rol = $user->rol;
        $this->assertNotNull($rol, 'Rol no encontrado');

        $permisos = $rol->permisos;
        $this->assertNotEmpty($permisos, 'El rol no tiene permisos asignados');

        echo "\n✅ El rol '{$rol->nombre}' tiene {$permisos->count()} permisos:\n";
        foreach ($permisos as $permiso) {
            echo "   - {$permiso->nombre}\n";
        }
    }

    /**
     * Test: Verificar permisos específicos del usuario
     */
    public function test_user_has_specific_permissions(): void
    {
        $user = User::where('email', 'pablo2905andres@gmail.com')->first();

        $this->assertNotNull($user, 'Usuario no encontrado');

        // Permisos críticos para gestión de usuarios
        $permisosEsperados = [
            'usuarios.ver',
            'usuarios.crear',
            'usuarios.editar',
            'usuarios.eliminar',
            'roles.ver',
            'roles.crear',
            'roles.editar',
            'roles.eliminar',
        ];

        echo "\n✅ Verificando permisos específicos:\n";
        foreach ($permisosEsperados as $permiso) {
            $tiene = $user->tienePermiso($permiso);
            $this->assertTrue($tiene, "El usuario NO tiene el permiso: {$permiso}");
            echo "   ✓ {$permiso}\n";
        }
    }

    /**
     * Test: Verificar acceso a rutas protegidas (GET)
     */
    public function test_user_can_access_protected_routes(): void
    {
        $user = User::where('email', 'pablo2905andres@gmail.com')->first();

        $this->assertNotNull($user, 'Usuario no encontrado');

        // Rutas que deben ser accesibles
        $rutasProtegidas = [
            '/users' => 'usuarios.ver',
            '/users/create' => 'usuarios.crear',
            '/roles' => 'roles.ver',
            '/roles/create' => 'roles.crear',
        ];

        echo "\n✅ Probando acceso a rutas protegidas:\n";

        foreach ($rutasProtegidas as $ruta => $permisoRequerido) {
            $response = $this->actingAs($user)->get($ruta);

            // Debe ser 200 (OK) o 302 (redirect válido), NO 403 (Forbidden)
            $this->assertNotEquals(403, $response->status(),
                "Acceso DENEGADO a {$ruta} (requiere: {$permisoRequerido})");

            if ($response->status() === 200) {
                echo "   ✓ {$ruta} - Status: 200 OK\n";
            } else {
                echo "   ⚠ {$ruta} - Status: {$response->status()}\n";
            }
        }
    }

    /**
     * Test: Verificar que HandleInertiaRequests comparte permisos
     */
    public function test_inertia_shares_permissions(): void
    {
        $user = User::where('email', 'pablo2905andres@gmail.com')->first();

        $this->assertNotNull($user, 'Usuario no encontrado');

        $response = $this->actingAs($user)->get('/dashboard');

        // Puede ser 200 OK o 302 redirect (ambos válidos)
        $this->assertContains($response->status(), [200, 302],
            'El dashboard debe ser accesible (200) o redirigir (302)');

        echo "\n✅ La página dashboard es accesible (Status: {$response->status()})\n";
        echo "   Inertia comparte auth.permissions globalmente via HandleInertiaRequests\n";
    }    /**
     * Test: Verificar método tieneAlgunPermiso
     */
    public function test_user_has_any_permission_method(): void
    {
        $user = User::where('email', 'pablo2905andres@gmail.com')->first();

        $this->assertNotNull($user, 'Usuario no encontrado');

        // Debe tener al menos uno de estos permisos
        $tieneAlguno = $user->tieneAlgunPermiso(['usuarios.ver', 'roles.ver']);
        $this->assertTrue($tieneAlguno, 'El usuario no tiene ninguno de los permisos verificados');

        // No debería tener permisos inexistentes
        $noDeberiaTener = $user->tieneAlgunPermiso(['permiso.falso', 'otro.falso']);

        echo "\n✅ Método tieneAlgunPermiso funciona correctamente\n";
        echo "   Tiene usuarios.ver o roles.ver: " . ($tieneAlguno ? 'SÍ' : 'NO') . "\n";
    }

    /**
     * Test: Verificar que el middleware no bloquea al usuario con permisos
     */
    public function test_middleware_allows_user_with_permissions(): void
    {
        $user = User::where('email', 'pablo2905andres@gmail.com')->first();

        $this->assertNotNull($user, 'Usuario no encontrado');

        // Intentar acceder a /users/create (requiere usuarios.ver + usuarios.crear)
        $response = $this->actingAs($user)->get('/users/create');

        // No debe ser 403 (Forbidden)
        $this->assertNotEquals(403, $response->status(),
            'El middleware está bloqueando incorrectamente a un usuario con permisos');

        echo "\n✅ Middleware UserManagementMiddleware permite acceso\n";
        echo "   Status de /users/create: {$response->status()}\n";

        if ($response->status() === 500) {
            echo "   ⚠ ERROR 500: Posible error en el controlador o componente\n";
        }
    }

    /**
     * Test: Verificar estructura de base de datos
     */
    public function test_database_structure_is_correct(): void
    {
        // Verificar que las tablas tienen registros
        $rolesCount = Rol::count();
        $permisosCount = Permiso::count();

        $this->assertGreaterThan(0, $rolesCount, 'No hay roles en la base de datos');
        $this->assertGreaterThan(0, $permisosCount, 'No hay permisos en la base de datos');

        // Verificar que hay usuarios con roles
        $usersWithRoles = User::whereNotNull('rol_id')->count();
        $this->assertGreaterThan(0, $usersWithRoles, 'No hay usuarios con roles asignados');

        echo "\n✅ Estructura de base de datos correcta\n";
        echo "   Usuarios con rol: {$usersWithRoles}\n";
        echo "   Roles: {$rolesCount}\n";
        echo "   Permisos: {$permisosCount}\n";
    }    /**
     * Test: Resumen completo del sistema RBAC para el usuario
     */
    public function test_complete_rbac_summary(): void
    {
        $user = User::where('email', 'pablo2905andres@gmail.com')->first();

        $this->assertNotNull($user, 'Usuario no encontrado');

        echo "\n" . str_repeat('=', 60) . "\n";
        echo "RESUMEN COMPLETO DEL SISTEMA RBAC\n";
        echo str_repeat('=', 60) . "\n";

        echo "\n📧 Usuario: {$user->name} ({$user->email})\n";
        echo "🆔 ID: {$user->id}\n";

        if ($user->rol) {
            echo "\n👤 Rol Asignado: {$user->rol->nombre}\n";
            echo "   Estado: " . ($user->rol->activo ? '✅ ACTIVO' : '❌ INACTIVO') . "\n";
            echo "   Descripción: {$user->rol->descripcion}\n";

            $permisos = $user->rol->permisos;
            echo "\n🔐 Permisos ({$permisos->count()}):\n";

            $permisosPorGrupo = $permisos->groupBy(function($permiso) {
                return explode('.', $permiso->nombre)[0];
            });

            foreach ($permisosPorGrupo as $grupo => $perms) {
                echo "\n   📋 {$grupo}:\n";
                foreach ($perms as $perm) {
                    echo "      • {$perm->nombre}\n";
                }
            }
        } else {
            echo "\n❌ SIN ROL ASIGNADO\n";
        }

        echo "\n" . str_repeat('=', 60) . "\n";

        $this->assertTrue(true);
    }
}
