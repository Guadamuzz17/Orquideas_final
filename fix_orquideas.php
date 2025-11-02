<?php

// Leer archivo con problemas de escape
$content = file_get_contents(__DIR__ . '/orquideas_2024_data.php');

// Remover el return [ inicial y ]; final para trabajar con el contenido
$content = preg_replace('/^<\?php\s+return\s+\[/', '', $content);
$content = preg_replace('/\];?\s*$/', '', $content);

// Evaluar el array de manera segura línea por línea
$lines = explode("\n", $content);
$fixed_data = [];

foreach ($lines as $line) {
    $line = trim($line);
    if (empty($line) || $line === '') {
        continue;
    }

    // Remover coma final si existe
    $line = rtrim($line, ',');

    try {
        // Intentar evaluar la línea
        $data = eval('return ' . $line . ';');
        if (is_array($data)) {
            $fixed_data[] = $data;
        }
    } catch (\Throwable $e) {
        // Si falla, intentar arreglar las comillas
        $line_fixed = str_replace("\\'", "'", $line);
        try {
            $data = eval('return ' . $line_fixed . ';');
            if (is_array($data)) {
                $fixed_data[] = $data;
            }
        } catch (\Throwable $e2) {
            echo "Error en línea: " . $line . "\n";
            echo "Error: " . $e2->getMessage() . "\n";
        }
    }
}

echo "Total de orquídeas procesadas: " . count($fixed_data) . "\n";

// Generar nuevo archivo
$output = "<?php\n\nreturn [\n";
foreach ($fixed_data as $row) {
    $output .= '    [';
    foreach ($row as $i => $val) {
        if ($i > 0) $output .= ', ';
        if ($val === NULL) {
            $output .= 'NULL';
        } elseif (is_numeric($val)) {
            $output .= $val;
        } else {
            // Usar var_export para escapar correctamente
            $output .= var_export($val, true);
        }
    }
    $output .= "],\n";
}
$output .= "];\n";

file_put_contents(__DIR__ . '/orquideas_2024_data_fixed.php', $output);
echo "✅ Archivo corregido generado: orquideas_2024_data_fixed.php\n";
