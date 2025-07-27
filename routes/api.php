    <?php

    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\GrupoController;
    use App\Http\Controllers\ClaseController;
    use App\Http\Controllers\OrquideaController;

Route::get('dropdowns', [GrupoController::class, 'dropdownData']); // trae grupos y clases
Route::post('orquideas', [OrquideaController::class, 'store']);    // registrar orquídea
