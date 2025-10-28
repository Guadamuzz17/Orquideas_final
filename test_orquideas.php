<?php

require 'vendor/autoload.php';
require 'bootstrap/app.php';

use App\Models\Orquidea;

echo "=== Verificando Orquídeas ===\n";

$orquideas = Orquidea::with(['grupo', 'clase', 'participante'])->get();

echo "Total de orquídeas: " . $orquideas->count() . "\n\n";

foreach ($orquideas as $orquidea) {
    echo "ID: " . $orquidea->id_orquidea . "\n";
    echo "Nombre: " . $orquidea->nombre_planta . "\n";
    echo "Origen: " . $orquidea->origen . "\n";
    echo "Foto: " . ($orquidea->foto ?? 'Sin foto') . "\n";
    echo "Cantidad: " . $orquidea->cantidad . "\n";
    echo "Grupo: " . ($orquidea->grupo ? $orquidea->grupo->nombre_grupo : 'Sin grupo') . "\n";
    echo "Clase: " . ($orquidea->clase ? $orquidea->clase->nombre_clase : 'Sin clase') . "\n";
    echo "Participante: " . ($orquidea->participante ? $orquidea->participante->nombre : 'Sin participante') . "\n";
    echo "---\n";
}
