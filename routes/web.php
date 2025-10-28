<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TrofeoController;
use App\Http\Controllers\ParticipanteController;
use App\Http\Controllers\OrquideaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InscripcionController;
use App\Http\Controllers\GanadorController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\ClaseController;
use App\Http\Controllers\ListonController;
use App\Http\Controllers\ReportesController;
use App\Http\Controllers\FotosController;

// Ruta de inicio
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Grupo de rutas protegidas por autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Rutas específicas de orquídeas (DEBEN IR ANTES del resource)
    Route::get('/orquideas/clases/{grupoId}', [OrquideaController::class, 'getClasesByGrupo'])
        ->name('orquideas.clases');

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

    // Rutas de recursos para participantes
    Route::resource('participantes', ParticipanteController::class);

    // Rutas de recursos para grupos y clases
    Route::resource('grupos', GrupoController::class);
    Route::resource('clases', ClaseController::class);

    // Rutas de recursos para fotografías
    Route::resource('fotos', FotosController::class);
});

// Rutas API públicas (sin autenticación)
Route::prefix('api')->group(function () {
    Route::get('/fotos', [FotosController::class, 'indexPublic'])->name('api.fotos');
});

// Archivos adicionales requeridos
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
