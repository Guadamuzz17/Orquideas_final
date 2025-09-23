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
        
        // Contar participantes registrados en el año actual
        $participantesCount = Participante::whereYear('created_at', $currentYear)->count();
        
        // Contar orquídeas registradas en el año actual
        $orquideasCount = Orquidea::whereYear('created_at', $currentYear)->count();
        
        return Inertia::render('dashboard', [
            'stats' => [
                'participantes' => $participantesCount,
                'orquideas' => $orquideasCount,
                'year' => $currentYear
            ]
        ]);
    }
}
