<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ClaseController;
use App\Http\Controllers\GrupoController;
use App\Http\Controllers\OrquideaController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});
// routes/web.php
Route::get('/registro_orquideas', function () {
    return Inertia::render('registro_orquideas/index'); // Asegúrate de que coincida con la estructura de tu carpeta
})->name('registro_orquideas');

Route::middleware('auth')->group(function () {
    Route::get('/orquideas', [OrquideaController::class, 'index'])->name('orquideas.index');
    Route::get('/orquideas/create', [OrquideaController::class, 'create'])->name('orquideas.create');
    Route::post('/orquideas', [OrquideaController::class, 'store'])->name('orquideas.store');
    Route::get('/orquideas/{orquidea}', [OrquideaController::class, 'show'])->name('orquideas.show');
    Route::get('/orquideas/{orquidea}/edit', [OrquideaController::class, 'edit'])->name('orquideas.edit');
    Route::put('/orquideas/{orquidea}', [OrquideaController::class, 'update'])->name('orquideas.update');
    Route::delete('/orquideas/{orquidea}', [OrquideaController::class, 'destroy'])->name('orquideas.destroy');
});

//routes para los controladores

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
