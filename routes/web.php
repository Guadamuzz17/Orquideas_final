<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TrofeoController;
use App\Http\Controllers\ParticipanteController;
use App\Http\Controllers\OrquideaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\GanadorController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\ClaseController;
use App\Http\Controllers\ListonController;
use App\Http\Controllers\ReportesController;
use App\Http\Controllers\FotosController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\ReportesEventoController;
use App\Http\Controllers\TipoPremioController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\RolController;
use App\Http\Controllers\EstadisticasController;


// Ruta de inicio
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Grupo de rutas protegidas por autenticación
Route::middleware(['auth', 'verified'])->group(function () {

    // Rutas de Eventos (SIN middleware de evento activo)
    Route::resource('eventos', EventoController::class);
    Route::post('/eventos/{id}/seleccionar', [EventoController::class, 'seleccionar'])->name('eventos.seleccionar');
    Route::post('/eventos/salir', [EventoController::class, 'salir'])->name('eventos.salir');
    Route::post('/eventos/cerrar', [EventoController::class, 'cerrarEvento'])->name('eventos.cerrar');

    // Todas las demás rutas requieren un evento activo
    Route::middleware(['evento.activo'])->group(function () {

        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Estadísticas
        Route::get('/estadisticas', [EstadisticasController::class, 'index'])->name('estadisticas.index');
        Route::get('/estadisticas/datos', [EstadisticasController::class, 'getEstadisticas'])->name('estadisticas.datos');
        Route::get('/estadisticas/exportar', [EstadisticasController::class, 'exportar'])->name('estadisticas.exportar');
        Route::get('/estadisticas/comparar', [EstadisticasController::class, 'comparar'])->name('estadisticas.comparar');

        // Reportes por Eventos (nueva interfaz separada)
        Route::get('/reportes-evento', [ReportesEventoController::class, 'index'])->name('reportes.evento.index');
        Route::get('/reportes-evento/inscripciones/pdf', [ReportesEventoController::class, 'inscripcionesPdf'])->name('reportes.evento.inscripciones.pdf');
        Route::get('/reportes-evento/plantas-por-clases/pdf', [ReportesEventoController::class, 'plantasPorClasesPdf'])->name('reportes.evento.plantas_por_clases.pdf');
        Route::get('/reportes-evento/ganadores/pdf', [ReportesEventoController::class, 'ganadoresPdf'])->name('reportes.evento.ganadores.pdf');
        Route::get('/reportes-evento/participantes-orquideas/pdf', [ReportesEventoController::class, 'participantesOrquideasPdf'])->name('reportes.evento.participantes_orquideas.pdf');
        Route::get('/reportes-evento/inscripciones-participante/pdf', [ReportesEventoController::class, 'inscripcionesPorParticipantePdf'])->name('reportes.evento.inscripciones_participante.pdf');

        // Vistas previas de reportes
        Route::get('/reportes-evento/preview/inscripciones', [ReportesEventoController::class, 'previewInscripciones'])->name('reportes.evento.preview.inscripciones');
        Route::get('/reportes-evento/preview/ganadores', [ReportesEventoController::class, 'previewGanadores'])->name('reportes.evento.preview.ganadores');
        Route::get('/reportes-evento/preview/plantas-clases', [ReportesEventoController::class, 'previewPlantasPorClases'])->name('reportes.evento.preview.plantas_clases');
        Route::get('/reportes-evento/preview/participantes-orquideas', [ReportesEventoController::class, 'previewParticipantesOrquideas'])->name('reportes.evento.preview.participantes_orquideas');


    // Reportes
    Route::get('/reportes', function () {
        return Inertia::render('Reportes/index');
    })->name('reportes.index');

    // Reportes Excel
    Route::get('/reportes/inscripciones/excel', [ReporteController::class, 'inscripcionesExcel'])->name('reportes.inscripciones.excel');
    Route::get('/reportes/plantas-por-clases/excel', [ReporteController::class, 'plantasPorClasesExcel'])->name('reportes.plantas_por_clases.excel');
    Route::get('/reportes/ganadores/excel', [ReporteController::class, 'ganadoresExcel'])->name('reportes.ganadores.excel');
    Route::get('/reportes/participantes-orquideas/excel', [ReporteController::class, 'participantesOrquideasExcel'])->name('reportes.participantes_orquideas.excel');

    // Reporte PDF: Inscripciones (Página 1)
    Route::get('/reportes/inscripciones/pdf', [ReporteController::class, 'inscripcionesPdf'])->name('reportes.inscripciones.pdf');

    // Reporte PDF: Listado de Plantas por Clases (Página 2)
    Route::get('/reportes/plantas-por-clases/pdf', [ReporteController::class, 'plantasPorClasesPdf'])->name('reportes.plantas_por_clases.pdf');

    // Reporte PDF: Listado de Orquídeas Ganadoras (Página 3)
    Route::get('/reportes/ganadores/pdf', [ReporteController::class, 'ganadoresPdf'])->name('reportes.ganadores.pdf');

    // Reporte PDF: Participantes y Orquídeas Asignadas (Página 4)
    Route::get('/reportes/participantes-orquideas/pdf', [ReporteController::class, 'participantesOrquideasPdf'])->name('reportes.participantes_orquideas.pdf');

    // Rutas específicas de orquídeas (DEBEN IR ANTES del resource)
    Route::get('/orquideas/clases/{grupoId}', [OrquideaController::class, 'getClasesByGrupo'])
        ->name('orquideas.clases');
    Route::get('/orquideas/sugerencias', [OrquideaController::class, 'buscarSugerencias'])
        ->name('orquideas.sugerencias');

    // Rutas de recursos para orquídeas
    Route::resource('orquideas', OrquideaController::class);

    // Rutas específicas de inscripción (DEBEN IR ANTES del resource)
    Route::get('/inscripcion/orquideas/{participanteId}', [InscripcionController::class, 'getOrquideasByParticipante'])
        ->name('inscripcion.orquideas');
    Route::get('/inscripcion/search-orquideas', [InscripcionController::class, 'searchOrquideas'])
        ->name('inscripcion.search-orquideas');
    Route::get('/inscripcion/check-correlativo', [InscripcionController::class, 'checkCorrelativo'])
        ->name('inscripcion.check-correlativo');
    Route::get('/inscripcion/ultimo-correlativo', [InscripcionController::class, 'getUltimoCorrelativo'])
        ->name('inscripcion.ultimo-correlativo');

    // Rutas de recursos para inscripción
    Route::resource('inscripcion', InscripcionController::class);

    // Rutas específicas de ganadores (DEBEN IR ANTES del resource)
    Route::get('/ganadores/search-inscripciones', [GanadorController::class, 'searchInscripciones'])
        ->name('ganadores.search-inscripciones');

    // Rutas de recursos para ganadores
    Route::resource('ganadores', GanadorController::class);

    // Rutas específicas de trofeos (DEBEN IR ANTES del resource)
    Route::get('/trofeos/search-inscripciones', [TrofeoController::class, 'searchInscripciones'])
        ->name('trofeos.search-inscripciones');

    // Rutas de recursos para trofeos
    Route::resource('trofeos', TrofeoController::class);

    // Rutas de Tipos de Premios
    Route::patch('/tipo-premios/{tipoPremio}/toggle-activo', [TipoPremioController::class, 'toggleActivo'])
        ->name('tipo-premios.toggle-activo');
    Route::resource('tipo-premios', TipoPremioController::class);

    // Rutas específicas de listones (DEBEN IR ANTES del resource)
    Route::get('/listones/search-inscripciones', [ListonController::class, 'searchInscripciones'])
        ->name('listones.search-inscripciones');

    // Rutas de recursos para listones
    Route::resource('listones', ListonController::class);

    // Rutas para reportes de listones
    Route::get('/test-reportes', function () {
        return Inertia::render('TestReportes');
    })->name('test.reportes');

    // Ruta de prueba para Excel
    Route::get('/test-excel', function () {
        try {
            $export = new \App\Exports\ListonesExport();
            return response()->json(['status' => 'success', 'message' => 'Export class works']);
        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    })->name('test.excel');

    Route::get('/reportes/listones', [ReportesController::class, 'index'])
        ->name('reportes.listones');
    Route::get('/reportes/estadisticas', [ReportesController::class, 'getEstadisticas'])
        ->name('reportes.estadisticas');
    Route::get('/reportes/excel', [ReportesController::class, 'exportExcel'])
        ->name('reportes.excel');
    Route::get('/reportes/pdf', [ReportesController::class, 'exportPdf'])
        ->name('reportes.pdf');

    // Ruta para la vista de creación de trofeos
    Route::get('/trofeos/crear', function () {
        return view('trofeos.create');
    })->name('trofeos.create');

    // Rutas específicas de participantes (DEBEN IR ANTES del resource)
    Route::get('/participantes/formato', [ParticipanteController::class, 'formato'])
        ->name('participantes.formato');

    Route::get('/participantes/municipios/{departamentoId}', [ParticipanteController::class, 'getMunicipiosByDepartamento'])
        ->name('participantes.municipios');

    // Ruta para buscar participantes de eventos anteriores (reciclaje)
    Route::get('/participantes/search-recycle', [ParticipanteController::class, 'searchForRecycle'])
        ->name('participantes.search.recycle');

    // Rutas de recursos para participantes
    Route::resource('participantes', ParticipanteController::class);

    // Rutas de recursos para grupos y clases
    Route::resource('grupos', GrupoController::class);
    Route::resource('clases', ClaseController::class);

    // Rutas de recursos para fotografías
    Route::resource('fotos', FotosController::class);

    // Rutas del módulo de gestión de usuarios
    Route::prefix('users')->name('users.')->middleware('user.management')->group(function () {
        // Rutas específicas (DEBEN IR ANTES del resource)
        Route::patch('/{user}/toggle-verification', [UsersController::class, 'toggleVerification'])
            ->name('toggle-verification');
        Route::patch('/{user}/reset-password', [UsersController::class, 'resetPassword'])
            ->name('reset-password');
        Route::post('/bulk-action', [UsersController::class, 'bulkAction'])
            ->name('bulk-action');
    });

    // Rutas de recursos para usuarios
    Route::resource('users', UsersController::class)->middleware('user.management');

    // Rutas de recursos para roles y permisos
    Route::resource('roles', RolController::class)->middleware('user.management');

    }); // Fin del grupo evento.activo
}); // Fin del grupo auth

// Rutas API públicas (sin autenticación)
Route::prefix('api')->group(function () {
    Route::get('/fotos', [FotosController::class, 'indexPublic'])->name('api.fotos');
});

// Archivos adicionales requeridos
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
