<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Listado de Orquídeas Ganadoras</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        h1 { font-size: 18px; margin: 0; }
        .subtitle { font-size: 14px; margin: 4px 0 12px 0; }
        .muted { color: #555; }
        .mb-4 { margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background: #efefef; }
        .center { text-align: center; }
        .w-gc { width: 14%; }
        .w-corr { width: 12%; }
        .w-planta { width: 30%; }
        .w-prop { width: 20%; }
        .w-aso { width: 14%; }
        .w-tro { width: 6%; }
        .w-pos { width: 3.33%; }
    </style>
</head>
<body>
    <h1>Listado de Orquídeas Ganadoras</h1>
    <div class="subtitle">Desde: {{ $from ?: 'N/A' }} &nbsp;&nbsp; Hasta: {{ $to ?: 'N/A' }}</div>

    <table>
        <thead>
            <tr>
                <th class="w-gc">Grupo/Clase</th>
                <th class="w-corr">Correlativo</th>
                <th class="w-planta">Nombre de la planta</th>
                <th class="w-prop">Propietario</th>
                <th class="w-aso">Asociación</th>
                <th class="w-pos center">1</th>
                <th class="w-pos center">2</th>
                <th class="w-pos center">3</th>
                <th class="w-tro center">Trofeos</th>
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    <td>{{ $row['grupo_clase'] ?? '' }}</td>
                    <td>{{ $row['correlativo'] ?? '' }}</td>
                    <td>{{ $row['planta'] ?? '' }}</td>
                    <td>{{ $row['propietario'] ?? '' }}</td>
                    <td>{{ $row['asociacion'] ?? '' }}</td>
                    <td class="center">{{ $row['p1'] ?? '' }}</td>
                    <td class="center">{{ $row['p2'] ?? '' }}</td>
                    <td class="center">{{ $row['p3'] ?? '' }}</td>
                    <td class="center">{{ $row['trofeo'] ?? '' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" class="muted">Sin datos para el rango seleccionado.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
