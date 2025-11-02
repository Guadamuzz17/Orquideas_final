# Guía para Migrar Datos del Evento 2024

## 📋 Descripción General

Este seeder migra los datos históricos del evento 2024 desde la base de datos anterior a la nueva estructura que incluye eventos.

## 🗂️ Datos que se Migran

1. **Evento 2024**
   - Nombre: "Concurso de Orquídeas 2024"
   - Fechas: 01/11/2024 - 30/11/2024
   - Estado: Finalizado

2. **Participantes** (56 registros del 2024)
3. **Orquídeas** (cientos de registros - ver archivo SQL)
4. **Inscripciones** (relación participante-orquídea)
5. **Ganadores** (premios asignados)

## ⚠️ IMPORTANTE: Completar el Seeder

El archivo `Evento2024Seeder.php` contiene solo **DATOS DE MUESTRA** para demostrar la estructura.

Para una migración completa, necesitas:

### 1. Extraer Orquídeas Completas del SQL

Las orquídeas están en el archivo `u245906636_orquideasAAO.sql`:
- **Líneas 1130-2170**: Contienen todos los INSERT de orquídeas

Formato del SQL:
```sql
INSERT INTO `tb_orquidea` 
(`id_orquidea`, `nombre_planta`, `origen`, `foto`, `id_grupo`, `id_clase`, `qr_code`, `codigo_orquidea`, `id_participante`, `fecha_creacion`, `fecha_actualizacion`) 
VALUES
(1, 'Lycaste virginalis', 'Especie', NULL, 4, 19, ..., 3, '2024-11-07 21:42:35', '2024-11-07 21:42:35'),
...
```

### 2. Extraer Inscripciones Completas

- **Líneas 549-800**: INSERT INTO `tb_inscripcion`

### 3. Extraer Ganadores Completos

- **Líneas 306-540**: INSERT INTO `tb_ganadores`

## 🔧 Cómo Completar el Seeder

### Opción 1: Manual

1. Abrir `u245906636_orquideasAAO.sql`
2. Copiar todos los registros de INSERT
3. Convertir a formato PHP array
4. Reemplazar las variables `$orquideasMuestra`, `$inscripcionesMuestra`, `$ganadoresMuestra`

### Opción 2: Usar Script Python/Node para Convertir

Crear un script que:
1. Lee el archivo SQL
2. Extrae los INSERT INTO
3. Convierte a arrays PHP
4. Genera el código completo

Ejemplo en Python:
```python
import re

def extraer_inserts_sql(archivo_sql, tabla):
    with open(archivo_sql, 'r', encoding='utf-8') as f:
        contenido = f.read()
    
    patron = rf"INSERT INTO `{tabla}`.*?VALUES\s*(.*?);"
    matches = re.findall(patron, contenido, re.DOTALL)
    
    return matches

# Uso
orquideas = extraer_inserts_sql('u245906636_orquideasAAO.sql', 'tb_orquidea')
```

## 📝 Pasos para Ejecutar la Migración

### 1. Verificar Prerequisitos

```bash
# Verificar que existen las tablas base
php artisan migrate

# Ejecutar seeders de catálogos
php artisan db:seed --class=ClaseSeeder
php artisan db:seed --class=AsoSeeder
php artisan db:seed --class=RolesPermisosSeeder
```

### 2. Ejecutar el Seeder (Solo después de completarlo)

```bash
php artisan db:seed --class=Evento2024Seeder
```

### 3. Verificar Migración

```bash
# Conectar a MySQL
mysql -u root -p

# Verificar datos
USE u245906636_orquideasAAO;

SELECT COUNT(*) FROM tb_evento WHERE nombre_evento = 'Concurso de Orquídeas 2024';
SELECT COUNT(*) FROM tb_participante WHERE id_evento = 1;
SELECT COUNT(*) FROM tb_orquidea WHERE id_evento = 1;
SELECT COUNT(*) FROM tb_inscripcion WHERE id_evento = 1;
SELECT COUNT(*) FROM tb_ganadores WHERE id_evento = 1;
```

## 🎯 Estrategia Recomendada

### Enfoque por Etapas

1. **Etapa 1: Migración Básica (ACTUAL)**
   - ✅ Evento creado
   - ✅ 56 Participantes migrados
   - ✅ 10 Orquídeas de muestra
   - ✅ 10 Inscripciones de muestra
   - ✅ 10 Ganadores de muestra

2. **Etapa 2: Migración Completa**
   - Extraer TODAS las orquídeas (~800 registros)
   - Extraer TODAS las inscripciones (~200+ registros)
   - Extraer TODOS los ganadores (~150 registros)

3. **Etapa 3: Verificación**
   - Comparar totales con BD anterior
   - Verificar integridad de relaciones
   - Validar ganadores y posiciones

## 📊 Estructura de Mapeo

El seeder usa mapeos para relacionar IDs antiguos con nuevos:

```php
// ID Antiguo => ID Nuevo
$participantesMap = [
    1 => 101,  // Participante 1 antiguo ahora es 101
    2 => 102,
    ...
];

$orquideasMap = [
    1 => 501,  // Orquídea 1 antigua ahora es 501
    2 => 502,
    ...
];
```

Esto asegura que las relaciones se mantengan correctas.

## 🔍 Consultas Útiles

### Obtener totales de la BD anterior

```sql
-- Contar participantes 2024
SELECT COUNT(*) FROM tb_participante 
WHERE fecha_creacion BETWEEN '2024-01-01' AND '2024-12-31';

-- Contar orquídeas 2024
SELECT COUNT(*) FROM tb_orquidea 
WHERE fecha_creacion BETWEEN '2024-01-01' AND '2024-12-31';

-- Contar ganadores 2024
SELECT COUNT(*) FROM tb_ganadores 
WHERE fecha_ganador BETWEEN '2024-01-01' AND '2024-12-31';
```

### Verificar datos huérfanos

```sql
-- Orquídeas sin participante válido
SELECT id_orquidea, nombre_planta, id_participante 
FROM tb_orquidea 
WHERE id_participante NOT IN (SELECT id FROM tb_participante);

-- Ganadores sin orquídea válida
SELECT id_ganador, id_orquidea 
FROM tb_ganadores 
WHERE id_orquidea NOT IN (SELECT id_orquidea FROM tb_orquidea);
```

## 🚨 Problemas Comunes

### 1. Participante no existe
**Error**: `Participante no encontrado para orquídea ID X`
**Solución**: Agregar el participante faltante al array `$participantes2024`

### 2. Clase no existe
**Error**: Foreign key constraint fails en `id_clase`
**Solución**: Ejecutar `ClaseSeeder` primero

### 3. Duplicados
**Error**: Duplicate entry
**Solución**: El seeder verifica duplicados por nombre, ajustar criterio si necesario

### 4. Fotos faltantes
**Problema**: Columna `foto` es NULL en muchos registros
**Solución**: Normal, muchas orquídeas no tienen foto en 2024

## 📚 Recursos Adicionales

- Archivo SQL fuente: `u245906636_orquideasAAO.sql`
- Documentación PDF: `u245906636_orquideasAAO.pdf`
- Modelos Laravel: `app/Models/`
- Migraciones: `database/migrations/`

## ✅ Checklist Final

Antes de ejecutar en producción:

- [ ] Backup de la base de datos actual
- [ ] Seeder completado con TODOS los datos (no solo muestra)
- [ ] Probado en ambiente de desarrollo
- [ ] Verificados totales vs BD anterior
- [ ] Confirmadas relaciones (participante-orquídea-ganador)
- [ ] Validadas fechas y estados
- [ ] Revisados casos especiales (empates, etc.)

## 🤝 Soporte

Si necesitas ayuda para:
- Extraer y convertir los datos del SQL
- Resolver errores en la migración
- Optimizar el proceso

Documenta el error específico y los datos involucrados.
