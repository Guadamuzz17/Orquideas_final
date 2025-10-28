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

// Ruta de inicio
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Grupo de rutas protegidas por autenticación
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Reportes
    Route::get('/reportes', function () {
        return Inertia::render('Reportes/index');
    })->name('reportes.index');

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

    // Rutas de recursos para trofeos
    Route::resource('trofeos', TrofeoController::class);

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
});

// Archivos adicionales requeridos
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
