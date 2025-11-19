<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Orquídeas Inscritas</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Arial', sans-serif;
            font-size: 10px;
            color: #333;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #4472C4;
        }

        .header h1 {
            font-size: 18px;
            color: #4472C4;
            margin-bottom: 5px;
        }

        .header p {
            font-size: 11px;
            color: #666;
        }

        .info-box {
            background-color: #f8f9fa;
            padding: 8px;
            margin-bottom: 15px;
            border-radius: 4px;
            border-left: 3px solid #4472C4;
        }

        .info-box p {
            margin: 3px 0;
            font-size: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        table thead {
            background-color: #4472C4;
            color: white;
        }

        table thead th {
            padding: 8px 5px;
            text-align: left;
            font-size: 9px;
            font-weight: bold;
            border: 1px solid #ddd;
        }

        table tbody td {
            padding: 6px 5px;
            border: 1px solid #ddd;
            font-size: 9px;
        }

        table tbody tr:nth-child(even) {
            background-color: #f8f9fa;
        }

        table tbody tr:hover {
            background-color: #e9ecef;
        }

        .grupo-section {
            margin-top: 15px;
            page-break-inside: avoid;
        }

        .grupo-header {
            background-color: #e7f3ff;
            padding: 8px;
            margin-bottom: 5px;
            border-left: 4px solid #4472C4;
            font-weight: bold;
            font-size: 11px;
            color: #4472C4;
        }

        .clase-header {
            background-color: #f0f0f0;
            padding: 6px 8px;
            margin: 5px 0;
            border-left: 3px solid #6c757d;
            font-weight: bold;
            font-size: 10px;
            color: #495057;
        }

        .footer {
            position: fixed;
            bottom: 10px;
            left: 20px;
            right: 20px;
            text-align: center;
            font-size: 8px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 5px;
        }

        .page-number:after {
            content: counter(page);
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 8px;
            font-weight: bold;
        }

        .badge-nativa {
            background-color: #d4edda;
            color: #155724;
        }

        .badge-hibrido {
            background-color: #e7d4f8;
            color: #6a1b9a;
        }

        .badge-importada {
            background-color: #d1ecf1;
            color: #0c5460;
        }

        .text-center {
            text-align: center;
        }

        .text-right {
            text-align: right;
        }

        .total-row {
            background-color: #e9ecef !important;
            font-weight: bold;
            border-top: 2px solid #4472C4 !important;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌺 Reporte de Orquídeas Inscritas</h1>
        <p>Asociación de Amigos de las Orquídeas de Guatemala</p>
        <p>Generado el: {{ $fecha }}</p>
    </div>

    <div class="info-box">
        <p><strong>Total de orquídeas:</strong> {{ $orquideas->count() }}</p>
        <p><strong>Grupos:</strong> {{ $orquideas->groupBy('id_grupo')->count() }}</p>
        <p><strong>Clases:</strong> {{ $orquideas->groupBy('id_clase')->count() }}</p>
    </div>

    @php
        $orquideasPorGrupo = $orquideas->groupBy('id_grupo');
    @endphp

    @foreach($orquideasPorGrupo as $grupoId => $orquideasGrupo)
        <div class="grupo-section">
            <div class="grupo-header">
                📂 Grupo: {{ $orquideasGrupo->first()->grupo->nombre_grupo ?? 'Sin Grupo' }}
                ({{ $orquideasGrupo->count() }} orquídeas)
            </div>

            @php
                $orquideasPorClase = $orquideasGrupo->groupBy('id_clase');
            @endphp

            @foreach($orquideasPorClase as $claseId => $orquideasClase)
                <div class="clase-header">
                    📑 Clase: {{ $orquideasClase->first()->clase->nombre_clase ?? 'Sin Clase' }}
                    ({{ $orquideasClase->count() }} orquídeas)
                </div>

                <table>
                    <thead>
                        <tr>
                            <th class="text-center" style="width: 8%;">Correlativo</th>
                            <th style="width: 35%;">Nombre de la Planta</th>
                            <th class="text-center" style="width: 12%;">Origen</th>
                            <th class="text-center" style="width: 10%;">Cantidad</th>
                            <th style="width: 35%;">Participante</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($orquideasClase->sortBy(function($orq) {
                            return $orq->inscripcion->correlativo ?? 9999;
                        }) as $orquidea)
                            <tr>
                                <td class="text-center">
                                    <strong>{{ $orquidea->inscripcion->correlativo ?? 'N/A' }}</strong>
                                </td>
                                <td>{{ $orquidea->nombre_planta }}</td>
                                <td class="text-center">
                                    @if($orquidea->origen === 'nativa')
                                        <span class="badge badge-nativa">Nativa</span>
                                    @elseif($orquidea->origen === 'hibrido')
                                        <span class="badge badge-hibrido">Híbrido</span>
                                    @elseif($orquidea->origen === 'importada')
                                        <span class="badge badge-importada">Importada</span>
                                    @else
                                        <span class="badge">{{ $orquidea->origen }}</span>
                                    @endif
                                </td>
                                <td class="text-center">{{ $orquidea->cantidad }}</td>
                                <td>{{ $orquidea->participante->nombre ?? 'N/A' }}</td>
                            </tr>
                        @endforeach
                        <tr class="total-row">
                            <td colspan="3" class="text-right">Subtotal Clase:</td>
                            <td class="text-center">{{ $orquideasClase->sum('cantidad') }}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            @endforeach

            <table style="margin-top: 5px;">
                <tbody>
                    <tr class="total-row">
                        <td colspan="3" class="text-right" style="padding: 8px;"><strong>Total Grupo:</strong></td>
                        <td class="text-center" style="padding: 8px;"><strong>{{ $orquideasGrupo->sum('cantidad') }}</strong></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    @endforeach

    <div style="margin-top: 20px; padding: 10px; background-color: #4472C4; color: white; text-align: center; border-radius: 4px;">
        <strong>TOTAL GENERAL: {{ $orquideas->sum('cantidad') }} orquídeas</strong>
    </div>

    <div class="footer">
        <p>Reporte generado automáticamente por el Sistema AAOGT - Página <span class="page-number"></span></p>
    </div>
</body>
</html>
