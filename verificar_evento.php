<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n=== VERIFICACIÓN DE id_evento ===\n\n";

$eventoId = DB::table('tb_evento')->latest('id_evento')->value('id_evento');
echo "ID del Evento 2024: {$eventoId}\n\n";

$participantesConEvento = DB::table('tb_participante')->whereNotNull('id_evento')->count();
$participantesTotales = DB::table('tb_participante')->count();
echo "Participantes con id_evento: {$participantesConEvento} de {$participantesTotales}\n";

$orquideasConEvento = DB::table('tb_orquidea')->whereNotNull('id_evento')->count();
$orquideasTotales = DB::table('tb_orquidea')->count();
echo "Orquídeas con id_evento: {$orquideasConEvento} de {$orquideasTotales}\n";

// Mostrar algunos IDs de ejemplo
echo "\n--- Ejemplos de Participantes ---\n";
$ejemplosP = DB::table('tb_participante')->limit(3)->get(['id', 'nombre', 'id_evento']);
foreach($ejemplosP as $p) {
    echo "ID: {$p->id}, Nombre: {$p->nombre}, id_evento: " . ($p->id_evento ?? 'NULL') . "\n";
}

echo "\n--- Ejemplos de Orquídeas ---\n";
$ejemplosO = DB::table('tb_orquidea')->limit(3)->get(['id', 'nombre_planta', 'id_evento']);
foreach($ejemplosO as $o) {
    echo "ID: {$o->id}, Planta: {$o->nombre_planta}, id_evento: " . ($o->id_evento ?? 'NULL') . "\n";
}
