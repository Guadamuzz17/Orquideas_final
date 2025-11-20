<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Listones y Menciones Honoríficas</title>
    <style>
        @page {
            margin: 1cm;
            size: A4 landscape;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            line-height: 1.3;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #2d5016;
            padding-bottom: 15px;
        }

        .header h1 {
            color: #2d5016;
            font-size: 20px;
            margin: 0 0 5px 0;
            font-weight: bold;
        }

        .header h2 {
            color: #666;
            font-size: 14px;
            margin: 0;
            font-weight: normal;
        }

        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            background-color: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #2d5016;
        }

        .info-left, .info-right {
            width: 48%;
        }

        .info-item {
            margin-bottom: 5px;
        }

        .info-label {
            font-weight: bold;
            color: #2d5016;
        }

        .statistics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }

        .stat-box {
            background-color: #f1f8e9;
            border: 1px solid #c8e6c9;
            padding: 10px;
            text-align: center;
            border-radius: 4px;
        }

        .stat-number {
            font-size: 18px;
            font-weight: bold;
            color: #2d5016;
            display: block;
        }

        .stat-label {
            font-size: 10px;
            color: #666;
            margin-top: 2px;
        }

        .table-container {
            margin-top: 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 10px;
        }

        thead {
            background-color: #2d5016;
            color: white;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
            vertical-align: top;
        }

        th {
            font-weight: bold;
            font-size: 10px;
            text-align: center;
        }

        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        tbody tr:hover {
            background-color: #f1f8e9;
        }

        .tipo-liston {
            font-weight: bold;
            color: #2d5016;
            padding: 2px 6px;
            border-radius: 3px;
            background-color: #f1f8e9;
            font-size: 9px;
        }

        .fecha {
            white-space: nowrap;
            font-size: 9px;
        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9px;
            color: #666;
            padding: 10px;
            border-top: 1px solid #ddd;
            background-color: white;
        }

        .page-number:before {
            content: "Página " counter(page) " de " counter(pages);
        }

        .no-data {
            text-align: center;
            padding: 30px;
            color: #666;
            font-style: italic;
        }

        .summary-section {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 20px;
        }

        .summary-title {
            font-size: 14px;
            font-weight: bold;
            color: #2d5016;
            margin-bottom: 10px;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
        }

        .summary-item {
            background-color: white;
            padding: 8px;
            border-radius: 3px;
            border-left: 3px solid #2d5016;
        }

        .summary-type {
            font-weight: bold;
            color: #2d5016;
            font-size: 10px;
        }

        .summary-count {
            font-size: 16px;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reporte de Listones y Menciones Honoríficas</h1>
        <h2>Sistema de Gestión de Competencias de Orquídeas</h2>
    </div>

    <div class="info-section">
        <div class="info-left">
            <div class="info-item">
                <span class="info-label">Fecha de Generación:</span> {{ $estadisticas['fecha_generacion'] }}
            </div>
            <div class="info-item">
                <span class="info-label">Período:</span> {{ $estadisticas['periodo'] }}
            </div>
        </div>
        <div class="info-right">
            <div class="info-item">
                <span class="info-label">Total de Registros:</span> {{ $estadisticas['total_listones'] }}
            </div>
            @if($estadisticas['filtro_tipo'])
            <div class="info-item">
                <span class="info-label">Filtro Aplicado:</span> {{ $estadisticas['filtro_tipo'] }}
            </div>
            @endif
        </div>
    </div>

    @if($estadisticas['tipos_distribucion']->count() > 0)
    <div class="summary-section">
        <div class="summary-title">Distribución por Tipo de Listón</div>
        <div class="summary-grid">
            @foreach($estadisticas['tipos_distribucion'] as $tipo => $cantidad)
            <div class="summary-item">
                <div class="summary-type">{{ $tipo ?: 'Sin especificar' }}</div>
                <div class="summary-count">{{ $cantidad }} {{ $cantidad == 1 ? 'listón' : 'listones' }}</div>
            </div>
            @endforeach
        </div>
    </div>
    @endif

    <div class="table-container">
        @if(isset($rows) && $rows->count() > 0)
        <table>
            <thead>
                <tr>
                    <th style="width: 6%;">Correlativo</th>
                    <th style="width: 20%;">Participante</th>
                    <th style="width: 25%;">Nombre de Orquídea</th>
                    <th style="width: 12%;">Clase / Grupo</th>
                    <th style="width: 12%;">Asociación</th>
                    @foreach($tiposPremio as $tipo)
                        <th style="width: 6%;">{{ $tipo->nombre_premio }}</th>
                    @endforeach
                    <th style="width: 6%;">Listón</th>
                </tr>
            </thead>
            <tbody>
                @foreach($rows as $row)
                <tr>
                    <td style="text-align: center; font-weight: bold;">{{ $row['correlativo'] ?? 'N/A' }}</td>
                    <td>{{ $row['participante'] }}</td>
                    <td>{{ $row['orquidea'] }}</td>
                    <td style="text-align: center;">{{ $row['clase_grupo'] }}</td>
                    <td style="text-align: center;">{{ $row['aso'] }}</td>
                    @foreach($row['flags'] as $flag)
                        <td style="text-align: center;">{{ $flag }}</td>
                    @endforeach
                    <td style="text-align: center;">{{ $row['liston'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @else
        <div class="no-data">
            <p>No se encontraron listones con los filtros aplicados.</p>
        </div>
        @endif
    </div>

    <div class="footer">
        <div class="page-number"></div>
        <div>Generado por Sistema de Gestión de Competencias de Orquídeas - {{ now()->format('d/m/Y H:i:s') }}</div>
    </div>
</body>
</html>
