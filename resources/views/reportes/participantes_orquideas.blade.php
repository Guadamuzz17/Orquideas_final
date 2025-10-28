<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Participantes y Orquídeas Asignadas</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin: 0; }
        .mb-4 { margin-bottom: 16px; }
        .muted { color: #555; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #efefef; }
        .w-part { width: 20%; }
        .w-tel { width: 13%; }
        .w-dir { width: 27%; }
        .w-orq { width: 20%; }
        .w-org { width: 8%; }
        .w-gru { width: 6%; }
        .w-cla { width: 6%; }
    </style>
</head>
<body>
    <h1>Reporte de Participantes y Orquídeas Asignadas</h1>

    <table class="mb-4">
        <thead>
            <tr>
                <th class="w-part">Participante</th>
                <th class="w-tel">Teléfono</th>
                <th class="w-dir">Dirección</th>
                <th class="w-orq">Orquídea(s)</th>
                <th class="w-org">Origen</th>
                <th class="w-gru">Grupo</th>
                <th class="w-cla">Clase</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    <td>{{ $row['participante'] ?? '' }}</td>
                    <td>{{ $row['telefono'] ?? '' }}</td>
                    <td>{{ $row['direccion'] ?? '' }}</td>
                    <td>{{ $row['orquidea'] ?? '' }}</td>
                    <td>{{ $row['origen'] ?? '' }}</td>
                    <td>{{ $row['grupo'] ?? '' }}</td>
                    <td>{{ $row['clase'] ?? '' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" class="muted">No hay participantes con orquídeas asignadas.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
