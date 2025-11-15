<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>REPORTE DE INSCRIPCIONES</title>
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif; 
            font-size: 12px; 
        }
        .header { 
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 { 
            font-size: 16px; 
            margin: 0 0 5px 0;
            text-transform: uppercase;
        }
        table { 
            width: 100%; 
            border-collapse: collapse;
            margin-top: 10px;
        }
        th, td { 
            border: 1px solid #000; 
            padding: 5px 8px; 
            text-align: left;
        }
        th { 
            background: #f0f0f0;
            font-weight: bold;
            text-align: center;
        }
        .text-center { text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>REPORTE DE INSCRIPCIONES</h1>
        @if(isset($evento) && $evento)
            <div>{{ $evento->nombre_evento }}</div>
        @endif
        @if(isset($fechaInicio) || isset($fechaFin))
            <div>
                {{ $fechaInicio ? date('d/m/Y', strtotime($fechaInicio)) : 'Inicio' }} 
                al 
                {{ $fechaFin ? date('d/m/Y', strtotime($fechaFin)) : 'Fin' }}
            </div>
        @endif
        <div>Generado: {{ now()->format('d/m/Y H:i') }}</div>
    </div>

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
            @if(isset($inscripciones) && count($inscripciones) > 0)
                @foreach($inscripciones as $inscripcion)
                    <tr>
                        <td>{{ $inscripcion['participante'] ?? 'N/A' }}</td>
                        <td>{{ $inscripcion['orquidea'] ?? 'N/A' }}</td>
                        <td class="text-center">{{ $inscripcion['grupo'] ?? 'N/A' }}</td>
                        <td class="text-center">{{ $inscripcion['clase'] ?? 'N/A' }}</td>
                        <td>{{ $inscripcion['origen'] ?? 'N/A' }}</td>
                        <td class="text-center">{{ $inscripcion['correlativo'] ?? 'N/A' }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="6" style="text-align: center; font-style: italic;">
                        No hay inscripciones para mostrar.
                    </td>
                </tr>
            @endif
        </tbody>
    </table>
</body>
</html>
