    <?php

    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\GrupoController;
    use App\Http\Controllers\ClaseController;
    use App\Http\Controllers\OrquideaController;

Route::get('dropdowns', [GrupoController::class, 'dropdownData']); // trae grupos y clases
Route::get('orquideas', [OrquideaController::class, 'index']);
Route::post('orquideas', [OrquideaController::class, 'store']);
Route::get('orquideas/{orquidea}', [OrquideaController::class, 'show']);
Route::put('orquideas/{orquidea}', [OrquideaController::class, 'update']);
Route::delete('orquideas/{orquidea}', [OrquideaController::class, 'destroy']);
