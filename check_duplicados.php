<?php

$data = require __DIR__ . '/inscripciones_2024_data.php';

$correlativos = array_column($data, 3);
$duplicados = array_count_values($correlativos);
$duplicados = array_filter($duplicados, fn($count) => $count > 1);

echo "Correlativos duplicados:\n";
foreach($duplicados as $num => $count) {
    echo "  Correlativo {$num}: aparece {$count} veces\n";
}

echo "\nTotal de inscripciones: " . count($data) . "\n";
echo "Correlativos únicos: " . count(array_unique($correlativos)) . "\n";
