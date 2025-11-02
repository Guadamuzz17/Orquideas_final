<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Usuarios disponibles:\n";
echo str_repeat('=', 50) . "\n";

$usuarios = DB::table('tb_usuarios')->orderBy('id_usuario')->get(['id_usuario', 'nombre_usuario']);

foreach($usuarios as $u) {
    echo sprintf("%2d - %s\n", $u->id_usuario, $u->nombre_usuario);
}

echo "\n--- Revisando participantes_2024_data.php ---\n";
$participantes = require __DIR__ . '/participantes_2024_data.php';

$usuarios_usados = array_unique(array_column($participantes, 11));
sort($usuarios_usados);

echo "Usuarios usados en participantes: " . implode(', ', $usuarios_usados) . "\n";

$usuarios_existentes = $usuarios->pluck('id_usuario')->toArray();
$usuarios_faltantes = array_diff($usuarios_usados, $usuarios_existentes);

if (!empty($usuarios_faltantes)) {
    echo "\n⚠️  Usuarios que NO existen: " . implode(', ', $usuarios_faltantes) . "\n";
    echo "Se establecerán a NULL\n";
} else {
    echo "\n✅ Todos los usuarios existen\n";
}
