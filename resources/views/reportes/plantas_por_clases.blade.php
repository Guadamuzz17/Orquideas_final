<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Listado General de Plantas por Clases</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin: 0; }
        h2 { font-size: 14px; margin: 4px 0 12px 0; }
        .muted { color: #555; }
        .mb-2 { margin-bottom: 8px; }
        .mb-4 { margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #efefef; }
        .center { text-align: center; }
        .w-no { width: 18%; }
        .w-planta { width: 42%; }
        .w-gc { width: 20%; }
        .w-es { width: 10%; }
        .w-hi { width: 10%; }
    </style>
</head>
<body>
    <h1>Asociación Altaverapacense de Orquideología</h1>
    <h2>Listado General de Plantas por Clases</h2>
    <div class="mb-4 muted">Desde: {{ $from ?: 'N/A' }} &nbsp;&nbsp; Hasta: {{ $to ?: 'N/A' }}</div>

    <table>
        <thead>
            <tr>
                <th class="w-no">No</th>
                <th class="w-planta">Planta</th>
                <th class="w-gc">Grupo/Clase</th>
                <th class="w-es center">Es</th>
                <th class="w-hi center">Hi</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    <td>{{ $row['no'] ?? '' }}</td>
                    <td>{{ $row['planta'] ?? '' }}</td>
                    <td>{{ $row['grupo_clase'] ?? '' }}</td>
                    <td class="center">{{ $row['es'] ?? '' }}</td>
                    <td class="center">{{ $row['hi'] ?? '' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="muted">Sin datos para el rango seleccionado.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
