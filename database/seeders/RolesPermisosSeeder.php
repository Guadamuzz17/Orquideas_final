<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rol;
use App\Models\Permiso;

class RolesPermisosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear permisos
        $permisos = [
            // Dashboard
            ['nombre' => 'dashboard.ver', 'modulo' => 'Dashboard', 'descripcion' => 'Ver panel principal', 'ruta' => '/dashboard'],

            // Eventos
            ['nombre' => 'eventos.ver', 'modulo' => 'Eventos', 'descripcion' => 'Ver eventos', 'ruta' => '/eventos'],
            ['nombre' => 'eventos.crear', 'modulo' => 'Eventos', 'descripcion' => 'Crear eventos', 'ruta' => '/eventos/create'],
            ['nombre' => 'eventos.editar', 'modulo' => 'Eventos', 'descripcion' => 'Editar eventos', 'ruta' => '/eventos/*/edit'],
            ['nombre' => 'eventos.eliminar', 'modulo' => 'Eventos', 'descripcion' => 'Eliminar eventos', 'ruta' => null],

            // Participantes
            ['nombre' => 'participantes.ver', 'modulo' => 'Participantes', 'descripcion' => 'Ver participantes', 'ruta' => '/participantes'],
            ['nombre' => 'participantes.crear', 'modulo' => 'Participantes', 'descripcion' => 'Crear participantes', 'ruta' => '/participantes/create'],
            ['nombre' => 'participantes.editar', 'modulo' => 'Participantes', 'descripcion' => 'Editar participantes', 'ruta' => '/participantes/*/edit'],
            ['nombre' => 'participantes.eliminar', 'modulo' => 'Participantes', 'descripcion' => 'Eliminar participantes', 'ruta' => null],

            // Orquídeas
            ['nombre' => 'orquideas.ver', 'modulo' => 'Orquídeas', 'descripcion' => 'Ver catálogo de orquídeas', 'ruta' => '/orquideas'],
            ['nombre' => 'orquideas.crear', 'modulo' => 'Orquídeas', 'descripcion' => 'Registrar orquídeas', 'ruta' => '/orquideas/create'],
            ['nombre' => 'orquideas.editar', 'modulo' => 'Orquídeas', 'descripcion' => 'Editar orquídeas', 'ruta' => '/orquideas/*/edit'],
            ['nombre' => 'orquideas.eliminar', 'modulo' => 'Orquídeas', 'descripcion' => 'Eliminar orquídeas', 'ruta' => null],

            // Clasificación (Grupos y Clases)
            ['nombre' => 'grupos.ver', 'modulo' => 'Grupos', 'descripcion' => 'Ver grupos', 'ruta' => '/grupos'],
            ['nombre' => 'clases.ver', 'modulo' => 'Clases', 'descripcion' => 'Ver clases', 'ruta' => '/clases'],

            // Inscripciones
            ['nombre' => 'inscripciones.ver', 'modulo' => 'Inscripciones', 'descripcion' => 'Ver inscripciones', 'ruta' => '/inscripcion'],
            ['nombre' => 'inscripciones.crear', 'modulo' => 'Inscripciones', 'descripcion' => 'Crear inscripciones', 'ruta' => '/inscripcion/create'],
            ['nombre' => 'inscripciones.editar', 'modulo' => 'Inscripciones', 'descripcion' => 'Editar inscripciones', 'ruta' => '/inscripcion/*/edit'],
            ['nombre' => 'inscripciones.eliminar', 'modulo' => 'Inscripciones', 'descripcion' => 'Eliminar inscripciones', 'ruta' => null],

            // Ganadores
            ['nombre' => 'ganadores.ver', 'modulo' => 'Ganadores', 'descripcion' => 'Ver ganadores', 'ruta' => '/ganadores'],
            ['nombre' => 'ganadores.crear', 'modulo' => 'Ganadores', 'descripcion' => 'Designar ganadores', 'ruta' => null],

            // Listones
            ['nombre' => 'listones.ver', 'modulo' => 'Listones', 'descripcion' => 'Ver listones', 'ruta' => '/listones'],
            ['nombre' => 'listones.crear', 'modulo' => 'Listones', 'descripcion' => 'Otorgar listones', 'ruta' => '/listones/create'],

            // Tipos de Premios
            ['nombre' => 'tipos-premios.ver', 'modulo' => 'Tipos de Premios', 'descripcion' => 'Ver tipos de premios', 'ruta' => '/tipo-premios'],
            ['nombre' => 'tipos-premios.gestionar', 'modulo' => 'Tipos de Premios', 'descripcion' => 'Gestionar tipos de premios', 'ruta' => '/tipo-premios/create'],

            // Fotos
            ['nombre' => 'fotos.ver', 'modulo' => 'Fotos', 'descripcion' => 'Ver galería de fotos', 'ruta' => '/fotos'],
            ['nombre' => 'fotos.subir', 'modulo' => 'Fotos', 'descripcion' => 'Subir fotografías', 'ruta' => '/fotos/create'],

            // Reportes
            ['nombre' => 'reportes.ver', 'modulo' => 'Reportes', 'descripcion' => 'Ver reportes y estadísticas', 'ruta' => '/reportes'],
            ['nombre' => 'reportes.listones', 'modulo' => 'Reportes', 'descripcion' => 'Ver reporte de listones', 'ruta' => '/reportes/listones'],

            // Usuarios
            ['nombre' => 'usuarios.ver', 'modulo' => 'Usuarios', 'descripcion' => 'Ver usuarios', 'ruta' => '/users'],
            ['nombre' => 'usuarios.crear', 'modulo' => 'Usuarios', 'descripcion' => 'Crear usuarios', 'ruta' => '/users/create'],
            ['nombre' => 'usuarios.editar', 'modulo' => 'Usuarios', 'descripcion' => 'Editar usuarios', 'ruta' => '/users/*/edit'],
            ['nombre' => 'usuarios.eliminar', 'modulo' => 'Usuarios', 'descripcion' => 'Eliminar usuarios', 'ruta' => null],

            // Roles y Permisos
            ['nombre' => 'roles.ver', 'modulo' => 'Roles', 'descripcion' => 'Ver roles y permisos', 'ruta' => '/roles'],
            ['nombre' => 'roles.crear', 'modulo' => 'Roles', 'descripcion' => 'Crear roles', 'ruta' => '/roles/create'],
            ['nombre' => 'roles.editar', 'modulo' => 'Roles', 'descripcion' => 'Editar roles', 'ruta' => '/roles/*/edit'],
            ['nombre' => 'roles.eliminar', 'modulo' => 'Roles', 'descripcion' => 'Eliminar roles', 'ruta' => null],
        ];

        foreach ($permisos as $permiso) {
            Permiso::create($permiso);
        }

        // Crear roles
        $adminGeneral = Rol::create([
            'nombre' => 'Admin General',
            'descripcion' => 'Acceso completo al sistema',
            'activo' => true,
        ]);

        $digitador = Rol::create([
            'nombre' => 'Digitador',
            'descripcion' => 'Acceso limitado a participantes, catálogo e inscripciones',
            'activo' => true,
        ]);

        // Asignar TODOS los permisos al Admin General
        $todosPermisos = Permiso::all();
        $adminGeneral->permisos()->attach($todosPermisos);

        // Asignar permisos limitados al Digitador
        $permisosDigitador = Permiso::whereIn('nombre', [
            'dashboard.ver',
            'participantes.ver',
            'participantes.crear',
            'participantes.editar',
            'orquideas.ver',
            'orquideas.crear',
            'orquideas.editar',
            'grupos.ver',
            'clases.ver',
            'inscripciones.ver',
            'inscripciones.crear',
            'inscripciones.editar',
        ])->get();

        $digitador->permisos()->attach($permisosDigitador);
    }
}
