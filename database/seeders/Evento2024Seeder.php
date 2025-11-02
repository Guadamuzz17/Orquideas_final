<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Evento2024Seeder extends Seeder
{
    /**
     * Seeder para migrar datos del evento 2024 desde la base de datos anterior.
     *
     * Migra:
     * - Evento 2024
     * - Participantes
     * - Orquídeas
     * - Inscripciones
     * - Ganadores
     *
     * IMPORTANTE: Ejecutar este seeder solo una vez.
     * Para ejecutar: php artisan db:seed --class=Evento2024Seeder
     */
    public function run(): void
    {
        $this->command->info('🌸 Iniciando migración de datos del Evento 2024...');

        // 1. Crear el evento 2024
        $idEvento2024 = $this->crearEvento2024();

        // 2. Migrar participantes del 2024
        $participantesMap = $this->migrarParticipantes2024($idEvento2024);

        // 3. Migrar orquídeas del 2024
        $orquideasMap = $this->migrarOrquideas2024($idEvento2024, $participantesMap);

        // 4. Migrar inscripciones del 2024
        $inscripcionesMap = $this->migrarInscripciones2024($idEvento2024, $participantesMap, $orquideasMap);

        // 5. Migrar ganadores del 2024
        $this->migrarGanadores2024($idEvento2024, $inscripcionesMap, $orquideasMap);

        $this->command->info('✅ Migración completada exitosamente!');
        $this->command->info("📊 Evento ID: {$idEvento2024}");
        $this->command->info("👥 Participantes migrados: " . count($participantesMap));
        $this->command->info("🌺 Orquídeas migradas: " . count($orquideasMap));
        $this->command->info("📝 Inscripciones migradas: " . count($inscripcionesMap));
    }

    /**
     * Crear el evento 2024
     */
    private function crearEvento2024(): int
    {
        $this->command->info('📅 Creando evento 2024...');

        // Verificar si ya existe
        $eventoExistente = DB::table('tb_evento')
            ->where('nombre_evento', 'Concurso de Orquídeas 2024')
            ->first();

        if ($eventoExistente) {
            $this->command->warn('⚠️ El evento 2024 ya existe. Se usará el existente.');
            return $eventoExistente->id_evento;
        }

        $idEvento = DB::table('tb_evento')->insertGetId([
            'nombre_evento' => 'Concurso de Orquídeas 2024',
            'descripcion' => 'Concurso Anual de Orquídeas de la Asociación de Amigos de la Orquídea - Año 2024',
            'fecha_inicio' => '2024-11-01',
            'fecha_fin' => '2024-11-30',
            'estado' => 'finalizado',
            'created_at' => Carbon::create(2024, 11, 1, 0, 0, 0),
            'updated_at' => Carbon::create(2024, 11, 30, 23, 59, 59),
        ]);

        $this->command->info("✅ Evento 2024 creado con ID: {$idEvento}");

        return $idEvento;
    }

    /**
     * Migrar participantes del año 2024
     */
    private function migrarParticipantes2024(int $idEvento): array
    {
        $this->command->info('👥 Migrando participantes del 2024...');

        // Datos de participantes del 2024 (extraídos del SQL dump)
        $participantes2024 = [
            [1, 'Priscila Gómez Sanchinelli ', '51521010', 'San Juan chamelco ', 1, 1, 10, 'Guatemala', 6, '2024-11-07 18:03:51'],
            [2, 'Perla Albadina Villatoro Milian', '50427329', '7a Calle 10-35 Zona 1', 1, 1, 9, 'Guatemala', 4, '2024-11-07 18:38:06'],
            [3, 'Pablo Luis Ruiz Pérez ', '55555555', 'Carcha ', 1, 1, 9, 'Guatemala', 6, '2024-11-07 21:41:07'],
            [4, 'Juan Paredes', '5555-6699', 'Coban', 1, 1, 1, 'Guatemala', 6, '2024-11-07 22:11:08'],
            [5, 'Victor Manuel De Jesus Sarazua Fernandez', '51309066', '5ta. calle 1-37 zona 3, San Cristobal Verapaz', 1, 1, 3, 'Guatemala', 4, '2024-11-10 20:28:45'],
            [6, 'Joan Stanley', '57230796', 'Km 207 CN 7W, Casa Misterio Verde, aldea Chiyuc, San Cristobal Verapaz, A.V.', 1, 1, 3, 'Guatemala', 4, '2024-11-10 21:39:15'],
            [7, 'César Danilo Maaz Stwolinski', '46417889', 'San Pedro Carchá, Alta Verapaz ', 1, 1, 9, 'Guatemala', 4, '2024-11-10 21:41:50'],
            [8, 'Familia Ruiz Moino', '37711135', 'Coban', 1, 1, 1, '', 4, '2024-11-10 21:51:05'],
            [9, 'Alberto contreras', '43108183', 'Zona 10', 1, 1, 1, 'Guatemala', 6, '2024-11-10 23:51:58'],
            [10, 'Norman Aquino Esteban', '53069868', '14 CALLE 31-21 ZONA 7 TIKAL 3', 1, 7, 72, 'Guatemala', 1, '2024-11-16 14:01:30'],
            [11, 'Sandra Sorel Cruz Riveiro', '53028740  -  39', '4 Avenida 8-12 zona 8', 1, 1, 1, 'Guatemala', 6, '2024-11-16 18:24:39'],
            [12, 'Finca Santa Anita', '57849127', 'Cobán, Alta Verapaz', 1, 1, 1, 'Guatemala', 6, '2024-11-16 21:02:56'],
            [13, 'Grupo de Estudio en Botánica y Anatomía Vegetal Agronomía CUNOR - USAC', '55954884', 'Cobán, Alta Verapaz', 1, 1, 1, 'Guatemala', 6, '2024-11-16 22:23:42'],
            [14, 'Mauro García García', '41287190', 'Cobán, Alta Verapaz', 1, 1, 1, 'Guatemala', 4, '2024-11-16 22:36:50'],
            [15, 'Familia Pape Gregg', '42940534', 'Cobán, A.V.', 1, 1, 1, 'Guatemala', 4, '2024-11-16 22:42:04'],
            [16, 'Carlos Teyul', '58221848', 'Colonia Monja Blanca', 1, 1, 1, 'Guatemala', 6, '2024-11-16 22:50:24'],
            [18, 'Carol Hernadez', '41188606', '8 av 3-12 zona 2', 1, 1, 1, 'Guatemala', 6, '2024-11-16 23:11:45'],
            [19, 'Blanca Rosa Chenal', '40450309', 'coban', 1, 1, 1, 'Guatemala', 4, '2024-11-16 23:14:40'],
            [20, 'Marlene Spiegeler', '52088956', 'San Juan Chamelco', 1, 1, 10, 'Guatemala', 4, '2024-11-16 23:23:09'],
            [21, 'Sandra Ninet Del Cid Del Cid', '00000000', 'Coban A.V.', 1, 1, 1, 'Guatemala', 6, '2024-11-16 23:31:06'],
            [22, 'Karol Sanchinelli Pezzarossi', '3222-2266', 'San Juan Chamelco ', 1, 1, 10, 'Guatemala', 4, '2024-11-16 23:48:47'],
            [23, 'Alejandro Bolaños Molina ', '00000000', 'Guatemala', 1, 7, 72, '', 1, '2024-11-17 16:46:49'],
            [24, 'Marla de Padilla ', '42728881', 'Guatemala ', 1, 7, 72, 'Guatemala', 6, '2024-11-17 16:48:04'],
            [25, 'Norman Aquino', '53069868', 'Cd. Guatemala', 1, 7, 72, 'Guatemala', 6, '2024-11-17 16:50:08'],
            [26, 'Javier Matla y Jonathan Velásquez', '59797978', 'Guatemala', 1, 7, 72, 'Guatemala', 6, '2024-11-17 16:56:24'],
            [27, 'Miguel Ángel Velásquez Martínez ', '00000000', 'San Bartolomé milpas altas ', 1, 7, 72, 'Guatemala', 6, '2024-11-17 16:58:57'],
            [28, 'Juan Francisco Velasquez Martínez', '00000000', 'San Bartolomé Milpas Altas', 1, 16, 220, 'Guatemala', 6, '2024-11-17 17:04:14'],
            [29, 'Ruby Amado de Imeri ', '00000000', 'Guatemala ', 1, 7, 72, 'Guatemala', 6, '2024-11-17 17:07:27'],
            [30, 'Visi de minondo ', '52066884', 'zona 7', 1, 7, 72, 'Guatemala', 1, '2024-11-17 17:09:36'],
            [31, 'Angela de Zuleta', '59736729', 'Salamá Baja Verapaz', 1, 2, 17, 'Guatemala', 2, '2024-11-17 17:44:34'],
            [32, 'Villa Lorena', '46308462', 'Salamá Baja Verapaz', 1, 2, 17, 'Guatemala', 2, '2024-11-17 17:59:56'],
            [33, 'Silvia Di Pollina de Palmieri', '55583881', '14 Calle 8-13 zona 10', 1, 1, 1, 'Guatemala', 6, '2024-11-17 18:04:37'],
            [34, 'Oscar Guillermo ', '00000000', 'Salama ', 1, 2, 17, 'Guatemala', 6, '2024-11-17 18:05:20'],
            [35, 'Vivero Angelus', '30112331', 'S', 1, 2, 17, 'Guatemala', 2, '2024-11-17 18:18:08'],
            [36, 'ORQUIGONIA ', '00000000', 'Alta verapaz ', 1, 1, 1, 'Guatemala', 6, '2024-11-17 18:18:58'],
            [37, 'Jorge Ramirez', '51026562', 'Salamá B.V.', 1, 2, 17, 'Guatemala', 2, '2024-11-17 18:37:21'],
            [38, 'Mario Palmieri/ Silvia de Palimeri', '55583881', 'Zona 10 ', 1, 7, 72, 'Guatemala', 1, '2024-11-17 18:40:03'],
            [39, 'Natalia Zuleta', '50182544', 'Salamá Baja Verapaz', 1, 2, 17, 'Guatemala', 2, '2024-11-17 18:54:01'],
            [40, 'Heidy Gabriela Chavarria del Cid', '46255295', 'Cobán, Alta Verapaz', 1, 1, 1, 'Guatemala', 6, '2024-11-17 20:41:49'],
            [41, 'María Elena Rivera', '51198474', 'Purulhá B.V.', 1, 2, 23, 'Guatemala', 1, '2024-11-17 20:52:09'],
            [42, 'Marta Reyes', '51542409', 'Santa Cruz verapaz', 1, 1, 2, 'Guatemala', 6, '2024-11-17 21:17:25'],
            [43, 'Astrid Javier', '51198474', 'Guatemala', 1, 7, 72, 'Guatemala', 1, '2024-11-17 21:20:16'],
            [44, 'Maria Elena Rivera', '51198474', 'Purulhá B.V.', 1, 2, 23, 'Guatemala', 1, '2024-11-17 21:22:33'],
            [45, 'Werner Ramírez', '46824015', 'Cobán, Alta Verapaz', 1, 1, 1, 'Guatemala', 4, '2024-11-17 21:24:20'],
            [47, 'Familia Aguilar Hidalgo', '58683398', 'Coban A.V.', 1, 1, 1, 'Guatemala', 6, '2024-11-17 22:24:54'],
            [48, 'Jaime Mó', '41545735', 'Cobán A.V.', 1, 1, 1, 'Guatemala', 4, '2024-11-17 23:21:30'],
            [49, 'Anagracia de Reyes', '52025941', 'Zona 15', 1, 7, 72, '', 1, '2024-11-17 23:41:35'],
            [50, 'Herbert Soto', '31973752', 'Coban Zona 9', 1, 1, 1, 'Guatemala', 4, '2024-11-18 00:20:56'],
            [51, 'Jorge A. Carlos', '56277723', '6ta. Av. 3-44 Zona 4', 1, 1, 1, 'Guatemala', 4, '2024-11-18 21:01:58'],
            [52, 'Guiselle Carlos V.', '55152332', '6ta. Av. 3-44 Zona 4', 1, 1, 1, '', 0, '2024-11-18 21:03:11'],
            [53, 'Mayra López', '43912286', 'San Pedro Carchá A.V.', 1, 1, 9, 'Guatemala', 6, '2024-11-18 21:46:30'],
            [54, 'Helmuth Ibañez', '52041846', 'Coban A-V-', 1, 1, 1, 'Guatemala', 4, '2024-11-18 22:22:15'],
            [55, 'Orlando Pop', '569997464', 'Coban A v', 1, 1, 1, 'Guatemala', 5, '2024-11-18 23:26:14'],
            [56, 'José Can', '79511616', 'Cobán, Alta Verapaz', 1, 1, 1, 'Guatemala', 6, '2024-11-19 22:31:12'],
        ];

        $participantesMap = [];
        $insertados = 0;

        foreach ($participantes2024 as $participante) {
            $idAntiguo = $participante[0];

            // Verificar si ya existe el participante con el mismo nombre
            $existe = DB::table('tb_participante')
                ->where('nombre', $participante[1])
                ->where('id_evento', $idEvento)
                ->first();

            if ($existe) {
                $participantesMap[$idAntiguo] = $existe->id;
                continue;
            }

            $idNuevo = DB::table('tb_participante')->insertGetId([
                'nombre' => $participante[1],
                'numero_telefonico' => $participante[2],
                'direccion' => $participante[3],
                'id_tipo' => $participante[4],
                'id_departamento' => $participante[5],
                'id_municipio' => $participante[6],
                'pais' => $participante[7],
                'id_aso' => $participante[8],
                'id_evento' => $idEvento,
                'id_usuario' => 1, // Usuario admin por defecto
                'fecha_creacion' => Carbon::parse($participante[9]),
                'fecha_actualizacion' => Carbon::parse($participante[9]),
            ]);

            $participantesMap[$idAntiguo] = $idNuevo;
            $insertados++;
        }

        $this->command->info("✅ {$insertados} participantes migrados");

        return $participantesMap;
    }

    /**
     * Migrar orquídeas del año 2024
     *
     * NOTA: Este método contiene una muestra. Para migración completa,
     * extraer todos los registros del SQL dump.
     */
    private function migrarOrquideas2024(int $idEvento, array $participantesMap): array
    {
        $this->command->info('🌺 Migrando orquídeas del 2024...');

        $this->command->warn('⚠️ IMPORTANTE: Este seeder contiene solo datos de muestra.');
        $this->command->warn('   Para migración completa, extraer todos los registros de orquídeas del SQL dump.');
        $this->command->warn('   Las orquídeas se almacenan en las líneas 1130-2170 del archivo u245906636_orquideasAAO.sql');

        // Datos de muestra de orquídeas 2024 (solo primeras 20 para ejemplo)
        // Formato: [id_antiguo, nombre_planta, origen, foto, id_grupo, id_clase, id_participante_antiguo, fecha_creacion]
        $orquideasMuestra = [
            [1, 'Lycaste virginalis ', 'Especie', NULL, 4, 19, 3, '2024-11-07 21:42:35'],
            [2, 'Lycaste virginalis ', 'Especie', NULL, 4, 19, 3, '2024-11-07 21:42:35'],
            [3, 'Lycaste virginalis', 'Especie', NULL, 4, 21, 4, '2024-11-07 22:12:01'],
            [4, 'Lycaste virginalis', 'Especie', NULL, 4, 21, 4, '2024-11-07 22:12:01'],
            [5, 'lycaste', 'Especie', NULL, 4, 20, 5, '2024-11-10 20:29:35'],
            [6, 'Phalanopsis blanca', 'Hibrida', NULL, 7, 69, 1, '2024-11-10 21:26:52'],
            [7, 'Onicidium javieri', 'Especie', NULL, 5, 46, 1, '2024-11-10 21:27:53'],
            [8, 'Prueba/ Lycaste Lassioglossa', 'Especie', NULL, 4, 27, 6, '2024-11-10 21:41:14'],
            [9, 'Monja negra', 'Especie', NULL, 4, 20, 9, '2024-11-10 23:52:41'],
            [10, 'Monja blanca', 'Especie', NULL, 4, 20, 9, '2024-11-10 23:52:41'],
        ];

        $orquideasMap = [];
        $insertados = 0;

        foreach ($orquideasMuestra as $orquidea) {
            $idAntiguo = $orquidea[0];
            $idParticipanteNuevo = $participantesMap[$orquidea[6]] ?? null;

            if (!$idParticipanteNuevo) {
                $this->command->warn("⚠️ Participante no encontrado para orquídea ID {$idAntiguo}");
                continue;
            }

            $idNuevo = DB::table('tb_orquidea')->insertGetId([
                'nombre_planta' => $orquidea[1],
                'origen' => $orquidea[2],
                'foto' => $orquidea[3],
                'id_grupo' => $orquidea[4],
                'id_clase' => $orquidea[5],
                'id_participante' => $idParticipanteNuevo,
                'id_evento' => $idEvento,
                'cantidad' => 1,
                'fecha_creacion' => Carbon::parse($orquidea[7]),
                'fecha_actualizacion' => Carbon::parse($orquidea[7]),
            ]);

            $orquideasMap[$idAntiguo] = $idNuevo;
            $insertados++;
        }

        $this->command->info("✅ {$insertados} orquídeas migradas (MUESTRA)");

        return $orquideasMap;
    }

    /**
     * Migrar inscripciones del año 2024
     */
    private function migrarInscripciones2024(int $idEvento, array $participantesMap, array $orquideasMap): array
    {
        $this->command->info('📝 Migrando inscripciones del 2024...');

        // Datos de muestra de inscripciones (solo primeras 20)
        // Formato: [id_antiguo, id_participante_antiguo, id_orquidea_antiguo, correlativo]
        $inscripcionesMuestra = [
            [1, 57, 821, '1'],
            [2, 57, 822, '2'],
            [3, 57, 823, '3'],
            [4, 57, 824, '4'],
            [5, 57, 825, '5'],
            [6, 57, 826, '6'],
            [7, 58, 827, '7'],
            [8, 58, 828, '8'],
            [9, 58, 829, '9'],
            [10, 58, 830, '10'],
        ];

        $inscripcionesMap = [];
        $insertados = 0;

        foreach ($inscripcionesMuestra as $inscripcion) {
            $idAntiguo = $inscripcion[0];
            $idParticipanteNuevo = $participantesMap[$inscripcion[1]] ?? null;
            $idOrquideaNuevo = $orquideasMap[$inscripcion[2]] ?? null;

            if (!$idParticipanteNuevo || !$idOrquideaNuevo) {
                continue;
            }

            $idNuevo = DB::table('tb_inscripcion')->insertGetId([
                'id_participante' => $idParticipanteNuevo,
                'id_orquidea' => $idOrquideaNuevo,
                'correlativo' => $inscripcion[3],
                'id_evento' => $idEvento,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $inscripcionesMap[$idAntiguo] = $idNuevo;
            $insertados++;
        }

        $this->command->info("✅ {$insertados} inscripciones migradas (MUESTRA)");

        return $inscripcionesMap;
    }

    /**
     * Migrar ganadores del año 2024
     */
    private function migrarGanadores2024(int $idEvento, array $inscripcionesMap, array $orquideasMap): void
    {
        $this->command->info('🏆 Migrando ganadores del 2024...');

        // Datos de ganadores 2024 (muestra - primeros 20 registros)
        // Formato: [id_ganador, id_orquidea_antiguo, id_grupo, id_clase, posicion, empate, fecha_ganador]
        $ganadoresMuestra = [
            [3, 372, 1, 4, 1, 0, '2024-11-20 17:34:07'],
            [4, 350, 1, 4, 2, 0, '2024-11-20 17:34:33'],
            [5, 332, 1, 4, 3, 0, '2024-11-20 17:35:17'],
            [6, 225, 1, 1, 1, 0, '2024-11-20 17:46:54'],
            [7, 218, 1, 1, 2, 0, '2024-11-20 17:47:23'],
            [8, 219, 1, 1, 3, 0, '2024-11-20 17:47:53'],
            [9, 819, 1, 2, 1, 0, '2024-11-20 17:49:08'],
            [10, 340, 1, 2, 1, 0, '2024-11-20 17:50:16'],
            [11, 293, 1, 2, 3, 0, '2024-11-20 17:50:55'],
            [12, 342, 1, 3, 1, 0, '2024-11-20 17:52:36'],
        ];

        $insertados = 0;

        foreach ($ganadoresMuestra as $ganador) {
            $idOrquideaNuevo = $orquideasMap[$ganador[1]] ?? null;

            if (!$idOrquideaNuevo) {
                continue;
            }

            // Buscar la inscripción correspondiente
            $inscripcion = DB::table('tb_inscripcion')
                ->where('id_orquidea', $idOrquideaNuevo)
                ->where('id_evento', $idEvento)
                ->first();

            if (!$inscripcion) {
                continue;
            }

            DB::table('tb_ganadores')->insert([
                'id_inscripcion' => $inscripcion->id_nscr,
                'posicion' => $ganador[4],
                'empate' => $ganador[5],
                'fecha_ganador' => Carbon::parse($ganador[6]),
                'id_evento' => $idEvento,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $insertados++;
        }

        $this->command->info("✅ {$insertados} ganadores migrados (MUESTRA)");
    }
}
