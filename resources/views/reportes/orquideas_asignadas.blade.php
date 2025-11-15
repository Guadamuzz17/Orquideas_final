<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Orquídeas Asignadas</title>
    <style>
        body { 
            font-family: DejaVu Sans, sans-serif; 
            font-size: 12px; 
            margin: 0;
            padding: 20px;
        }
        .header { 
            text-align: center;
            margin-bottom: 15px;
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
        <h1>Reporte de Orquídeas Asignadas y Registradas</h1>
        @if(isset($evento) && $evento)
            <div>{{ $evento->nombre_evento }}</div>
        @endif
        <div>Generado: {{ now()->format('d/m/Y H:i') }}</div>
    </div>

    @if(!empty($rows))
        <table>
            <thead>
                <tr>
                    <th>Participante</th>
                    <th>Teléfono</th>
                    <th>Orquídea</th>
                    <th>Origen</th>
                    <th>G</th>
                    <th>C</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rows as $row)
                    <tr>
                        <td>{{ $row['participante'] ?? '' }}</td>
                        <td>{{ $row['telefono'] ?? '' }}</td>
                        <td>{{ $row['orquidea'] ?? '' }}</td>
                        <td>{{ $row['origen'] ?? '' }}</td>
                        <td class="text-center">{{ $row['grupo'] ?? '' }}</td>
                        <td class="text-center">{{ $row['clase'] ?? '' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p style="text-align: center; font-style: italic;">
            No hay orquídeas asignadas para mostrar.
        </p>
    @endif
</body>
</html>