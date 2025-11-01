<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Participante;
use App\Models\Orquidea;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $currentYear = Carbon::now()->year;
        $eventoActivo = session('evento_activo');

        // Contar participantes del evento activo
        $participantesCount = Participante::where('id_evento', $eventoActivo)->count();

        // Contar orquídeas del evento activo
        $orquideasCount = Orquidea::where('id_evento', $eventoActivo)->count();

        return Inertia::render('dashboard', [
            'stats' => [
                'participantes' => $participantesCount,
                'orquideas' => $orquideasCount,
                'year' => $currentYear
            ]
        ]);
    }
}
