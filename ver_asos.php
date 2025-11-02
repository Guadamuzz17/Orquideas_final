<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "ASOs disponibles:\n";
echo str_repeat('=', 50) . "\n";

$asos = DB::table('tb_aso')->orderBy('id_aso')->get(['id_aso', 'Clase']);

foreach($asos as $aso) {
    echo sprintf("%2d - %s\n", $aso->id_aso, $aso->Clase);
}

echo "\n--- Revisando participantes_2024_data.php ---\n";
$participantes = require __DIR__ . '/participantes_2024_data.php';

$asos_usados = array_unique(array_column($participantes, 8));
sort($asos_usados);

echo "ASOs usados en participantes: " . implode(', ', $asos_usados) . "\n";

$asos_existentes = $asos->pluck('id_aso')->toArray();
$asos_faltantes = array_diff($asos_usados, $asos_existentes);

if (!empty($asos_faltantes)) {
    echo "\n⚠️  ASOs que NO existen en la BD: " . implode(', ', $asos_faltantes) . "\n";
} else {
    echo "\n✅ Todas las ASOs existen\n";
}
