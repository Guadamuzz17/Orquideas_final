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

//routes para los controladores

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
