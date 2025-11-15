<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Inscripciones por Participante</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1 { font-size: 20px; margin-bottom: 4px; }
        h2 { font-size: 16px; margin-bottom: 8px; color: #333; }
        .muted { color: #555; font-size: 11px; }
        .mb-2 { margin-bottom: 8px; }
        .mb-4 { margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #efefef; font-weight: bold; }
        .total-row { background: #f9f9f9; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Reporte de Inscripciones por Participante</h1>
    <div class="mb-2"><strong>Evento:</strong> {{ $evento->nombre_evento ?? 'N/A' }}</div>
    <div class="mb-4"><strong>Participante:</strong> {{ $participante->nombre ?? 'N/A' }}</div>

    <table>
        <thead>
            <tr>
                <th style="width: 80px;">Correlativo</th>
                <th style="width: 50px;">Grupo</th>
                <th style="width: 100px;">Clase</th>
                <th>Nombre de la Planta</th>
                <th style="width: 100px;">Origen</th>
            </tr>
        </thead>
        <tbody>
            @forelse($inscripciones as $ins)
                <tr>
                    <td style="text-align: center;">{{ $ins['correlativo'] }}</td>
                    <td style="text-align: center;">{{ $ins['grupo'] }}</td>
                    <td>{{ $ins['clase'] }}</td>
                    <td>{{ $ins['nombre_planta'] }}</td>
                    <td>{{ $ins['origen'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" class="muted" style="text-align: center;">Sin inscripciones registradas.</td>
                </tr>
            @endforelse
        </tbody>
        @if(count($inscripciones) > 0)
        <tfoot>
            <tr class="total-row">
                <td colspan="4" style="text-align: right; padding-right: 12px;">Total de Inscripciones:</td>
                <td style="text-align: center;">{{ count($inscripciones) }}</td>
            </tr>
        </tfoot>
        @endif
    </table>

    <div style="margin-top: 24px; font-size: 10px; color: #777;">
        Generado el {{ date('d/m/Y H:i:s') }}
    </div>
</body>
</html>
