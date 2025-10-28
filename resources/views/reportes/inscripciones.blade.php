<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Inscripciones</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        .muted { color: #555; }
        .mb-2 { margin-bottom: 8px; }
        .mb-4 { margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #efefef; }
    </style>
</head>
<body>
    <h1>Reporte de Inscripciones</h1>
    <div class="mb-4 muted">Desde: {{ $from ?: 'N/A' }} &nbsp;&nbsp; Hasta: {{ $to ?: 'N/A' }}</div>

    <table>
        <thead>
            <tr>
                <th>Participante</th>
                <th>Orquídea</th>
                <th>Grupo</th>
                <th>Clase</th>
                <th>Origen</th>
                <th>Correlativo</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    <td>{{ $row['participante'] ?? '' }}</td>
                    <td>{{ $row['orquidea'] ?? '' }}</td>
                    <td>{{ $row['grupo'] ?? '' }}</td>
                    <td>{{ $row['clase'] ?? '' }}</td>
                    <td>{{ $row['origen'] ?? '' }}</td>
                    <td>{{ $row['correlativo'] ?? '' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="muted">Sin datos para el rango seleccionado.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
