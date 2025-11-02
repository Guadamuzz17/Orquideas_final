<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Evento;
use Carbon\Carbon;

class MigracionEvento2024 extends Seeder
{
    /**
     * Ejecuta el bulk insert de los datos del evento 2024
     * Incluye: 65 participantes, 1023 orquídeas, 210 inscripciones, 224 ganadores
     */
    public function run(): void
    {
        $this->command->info('🌺 Iniciando migración masiva del Evento 2024...');

        // 1. Crear el evento
        $evento = $this->crearEvento2024();
        $this->command->info("✅ Evento creado con ID: {$evento->id_evento}");

        // 2. Insertar participantes y obtener mapeo ID antiguo => ID nuevo
        $mapeoParticipantes = $this->insertarParticipantes($evento->id_evento);

        // 3. Insertar orquídeas y obtener mapeo ID antiguo => ID nuevo
        $mapeoOrquideas = $this->insertarOrquideas($evento->id_evento, $mapeoParticipantes);

        // 4. Insertar inscripciones usando mapeos
        $this->insertarInscripciones($evento->id_evento, $mapeoParticipantes, $mapeoOrquideas);

        // 5. Insertar ganadores usando mapeo de orquídeas
        $this->insertarGanadores($evento->id_evento, $mapeoOrquideas);

        // 6. Mostrar estadísticas
        $this->mostrarEstadisticas($evento->id_evento);
    }

    private function crearEvento2024()
    {
        return Evento::create([
            'nombre_evento' => 'Concurso de Orquídeas 2024',
            'descripcion' => 'Concurso Anual de Orquídeas de la Asociación de Amigos de la Orquídea - Evento Histórico Migrado',
            'fecha_inicio' => '2024-11-07',
            'fecha_fin' => '2024-11-20',
            'estado' => 'finalizado',
        ]);
    }

    private function insertarParticipantes($eventoId)
    {
        $this->command->info('📝 Insertando 65 participantes...');

        // Cargar datos desde el archivo generado
        $participantesData = require(__DIR__ . '/../../participantes_2024_data.php');

        $participantes = [];
        $idsAntiguos = []; // Para mapeo

        foreach ($participantesData as $p) {
            // Mapear IDs de ASO antiguos a nuevos
            // 0 -> 5 (Independiente), 6 -> 3 (Alta Verapaz)
            $id_aso_mapeado = $p[8];
            if ($id_aso_mapeado == 0) {
                $id_aso_mapeado = 5; // Independiente
            } elseif ($id_aso_mapeado == 6) {
                $id_aso_mapeado = 3; // Alta Verapaz
            }

            // id_usuario a NULL si no existe en tb_usuarios
            // (todos los usuarios del 2024 no existen en la nueva BD)

            $participantes[] = [
                'nombre' => $p[1],
                'numero_telefonico' => $p[2],
                'direccion' => $p[3],
                'id_tipo' => $p[4],
                'id_departamento' => $p[5],
                'id_municipio' => $p[6],
                'pais' => $p[7],
                'id_aso' => $id_aso_mapeado,
                'id_evento' => $eventoId,
                'id_usuario' => null, // Establecido a NULL porque usuarios 2024 no existen
                'created_at' => $p[9],
                'updated_at' => $p[10],
            ];

            $idsAntiguos[] = $p[0]; // Guardar ID antiguo
        }

        DB::table('tb_participante')->insert($participantes);
        $this->command->info("✅ " . count($participantes) . " participantes insertados");

        // Obtener los IDs nuevos que se generaron (los últimos 65)
        $participantesInsertados = DB::table('tb_participante')
            ->where('id_evento', $eventoId)
            ->orderBy('id')
            ->limit(65)
            ->pluck('id')
            ->toArray();

        $this->command->info("IDs antiguos: " . count($idsAntiguos) . ", IDs nuevos: " . count($participantesInsertados));        // Crear mapeo: ID_antiguo => ID_nuevo
        $mapeo = array_combine($idsAntiguos, $participantesInsertados);        return $mapeo;
    }    private function insertarOrquideas($eventoId, $mapeoParticipantes)
    {
        $this->command->info('🌸 Insertando 1,023 orquídeas...');

        // Cargar datos desde el archivo generado (versión corregida)
        $orquideasData = require(__DIR__ . '/../../orquideas_2024_data_fixed.php');

        // Guardar IDs antiguos para mapeo posterior
        $idsAntiguosOrquideas = [];

        // Insertar en lotes de 100 para evitar problemas de memoria
        $chunks = array_chunk($orquideasData, 100);
        $total = 0;

        foreach ($chunks as $index => $chunk) {
            $orquideas = [];
            foreach ($chunk as $o) {
                // Saltar registros vacíos
                if (empty($o) || count($o) < 2) continue;

                // Mapear ID de participante antiguo al nuevo
                $id_participante_antiguo = $o[8];
                $id_participante_nuevo = $mapeoParticipantes[$id_participante_antiguo] ?? null;

                if ($id_participante_nuevo === null) {
                    $this->command->warn("⚠️  Orquídea '{$o[1]}' tiene participante inválido: {$id_participante_antiguo}");
                    continue;
                }

                // Guardar ID antiguo de la orquídea
                $idsAntiguosOrquideas[] = $o[0];

                $orquideas[] = [
                    'nombre_planta' => $o[1] ?? 'Sin nombre',
                    'origen' => $o[2] ?? 'Especie',
                    'foto' => $o[3],
                    'id_grupo' => $o[4],
                    'id_clase' => $o[5],
                    'cantidad' => 1, // Valor por defecto
                    'id_participante' => $id_participante_nuevo,
                    'id_evento' => $eventoId,
                    'created_at' => $o[9] ?? Carbon::now(),
                    'updated_at' => $o[10] ?? Carbon::now(),
                ];
            }

            if (!empty($orquideas)) {
                DB::table('tb_orquidea')->insert($orquideas);
                $total += count($orquideas);
                $this->command->info("  Lote " . ($index + 1) . ": {$total} orquídeas insertadas");
            }
        }

        // Obtener los IDs nuevos que se generaron
        $orquideasInsertadas = DB::table('tb_orquidea')
            ->where('id_evento', $eventoId)
            ->orderBy('id_orquidea')
            ->pluck('id_orquidea')
            ->toArray();

        $this->command->info("✅ Total: {$total} orquídeas insertadas");
        $this->command->info("IDs antiguos: " . count($idsAntiguosOrquideas) . ", IDs nuevos: " . count($orquideasInsertadas));

        // Crear mapeo: ID_antiguo => ID_nuevo
        $mapeoOrquideas = array_combine($idsAntiguosOrquideas, $orquideasInsertadas);

        return $mapeoOrquideas;
    }

    private function insertarInscripciones($eventoId, $mapeoParticipantes, $mapeoOrquideas)
    {
        $this->command->info('📋 Insertando inscripciones...');

        // Cargar datos desde el archivo generado
        $inscripcionesData = require(__DIR__ . '/../../inscripciones_2024_data.php');

        $inscripciones = [];
        $correlativoActual = 1; // Generar correlativos únicos desde 1
        $skipped = 0;

        foreach ($inscripcionesData as $i) {
            // Mapear IDs antiguos a nuevos
            $id_participante_nuevo = $mapeoParticipantes[$i[1]] ?? null;
            $id_orquidea_nuevo = $mapeoOrquideas[$i[2]] ?? null;

            if ($id_participante_nuevo === null || $id_orquidea_nuevo === null) {
                $skipped++;
                continue; // Saltar si algún ID no existe
            }

            $inscripciones[] = [
                'id_participante' => $id_participante_nuevo,
                'id_orquidea' => $id_orquidea_nuevo,
                'correlativo' => $correlativoActual++, // Auto-incrementar correlativo
                'id_evento' => $eventoId,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }

        DB::table('tb_inscripcion')->insert($inscripciones);
        $this->command->info("✅ " . count($inscripciones) . " inscripciones insertadas");
        if ($skipped > 0) {
            $this->command->warn("⚠️  {$skipped} inscripciones omitidas por IDs inválidos");
        }
    }

    private function insertarGanadores($eventoId, $mapeoOrquideas)
    {
        $this->command->info('🏆 Insertando ganadores...');

        // Cargar datos desde el archivo generado
        $ganadoresData = require(__DIR__ . '/../../ganadores_2024_data.php');

        // Obtener todas las inscripciones del evento 2024 con sus IDs de orquídea
        $inscripciones = DB::table('tb_inscripcion')
            ->where('id_evento', $eventoId)
            ->get()
            ->keyBy('id_orquidea'); // Indexar por id_orquidea para búsqueda rápida

        $ganadores = [];
        $skipped = 0;

        foreach ($ganadoresData as $g) {
            // Mapear ID antiguo de orquídea al nuevo
            $id_orquidea_antiguo = $g[1];
            $id_orquidea_nuevo = $mapeoOrquideas[$id_orquidea_antiguo] ?? null;

            if ($id_orquidea_nuevo === null) {
                $skipped++;
                continue; // Saltar si el ID de orquídea no existe
            }

            // Buscar la inscripción correspondiente
            $inscripcion = $inscripciones->get($id_orquidea_nuevo);

            if (!$inscripcion) {
                $this->command->warn("⚠️  Orquídea {$id_orquidea_nuevo} no tiene inscripción");
                $skipped++;
                continue;
            }

            $ganadores[] = [
                'id_inscripcion' => $inscripcion->id_nscr,
                'posicion' => $g[4],
                'empate' => $g[5],
                'id_evento' => $eventoId,
                'fecha_ganador' => $g[6],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }

        DB::table('tb_ganadores')->insert($ganadores);
        $this->command->info("✅ " . count($ganadores) . " ganadores insertados");
        if ($skipped > 0) {
            $this->command->warn("⚠️  {$skipped} ganadores omitidos por IDs inválidos");
        }
    }    private function mostrarEstadisticas($eventoId)
    {
        $stats = [
            'Participantes' => DB::table('tb_participante')->where('id_evento', $eventoId)->count(),
            'Orquídeas' => DB::table('tb_orquidea')->where('id_evento', $eventoId)->count(),
            'Inscripciones' => DB::table('tb_inscripcion')->where('id_evento', $eventoId)->count(),
            'Ganadores' => DB::table('tb_ganadores')->where('id_evento', $eventoId)->count(),
        ];

        $this->command->newLine();
        $this->command->info('📊 ESTADÍSTICAS FINALES:');
        $this->command->table(['Tabla', 'Registros'], [
            ['Participantes', $stats['Participantes']],
            ['Orquídeas', $stats['Orquídeas']],
            ['Inscripciones', $stats['Inscripciones']],
            ['Ganadores', $stats['Ganadores']],
        ]);
    }
}
