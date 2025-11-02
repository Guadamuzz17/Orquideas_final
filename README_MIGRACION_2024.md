# 🌸 Migración de Datos del Evento 2024

## 📌 Resumen

Este conjunto de herramientas te permite migrar todos los datos históricos del evento 2024 desde la base de datos anterior a la nueva estructura que soporta múltiples eventos.

## 🗂️ Archivos Incluidos

1. **`Evento2024Seeder.php`** - Seeder principal de Laravel
2. **`extraer_datos_sql.py`** - Script Python para extraer datos del SQL
3. **`GUIA_MIGRACION_EVENTO_2024.md`** - Guía detallada de migración
4. **`u245906636_orquideasAAO.sql`** - Dump de base de datos original

## 🚀 Proceso Rápido (3 pasos)

### Paso 1: Extraer Datos del SQL

```bash
# Asegúrate de tener Python 3 instalado
python --version

# Ejecutar el script extractor
python extraer_datos_sql.py
```

Esto generará 3 archivos:
- `orquideas_2024.txt`
- `inscripciones_2024.txt`
- `ganadores_2024.txt`

### Paso 2: Actualizar el Seeder

Abrir `database/seeders/Evento2024Seeder.php` y:

1. **Método `migrarOrquideas2024`**:
   - Copiar contenido de `orquideas_2024.txt`
   - Reemplazar `$orquideasMuestra` con `$orquideas2024`

2. **Método `migrarInscripciones2024`**:
   - Copiar contenido de `inscripciones_2024.txt`
   - Reemplazar `$inscripcionesMuestra` con `$inscripciones2024`

3. **Método `migrarGanadores2024`**:
   - Copiar contenido de `ganadores_2024.txt`
   - Reemplazar `$ganadoresMuestra` con $ganadores2024`

### Paso 3: Ejecutar la Migración

```bash
# Verificar que las migraciones estén actualizadas
php artisan migrate

# Ejecutar seeders de catálogos base (si no se han ejecutado)
php artisan db:seed --class=ClaseSeeder
php artisan db:seed --class=AsoSeeder

# Ejecutar el seeder de migración
php artisan db:seed --class=Evento2024Seeder
```

## 📊 Datos que se Migrarán

### Evento
- **Nombre**: Concurso de Orquídeas 2024
- **Período**: 01/11/2024 - 30/11/2024
- **Estado**: Finalizado

### Participantes
- **Total**: 56 participantes registrados en noviembre 2024
- Incluye nombre, teléfono, dirección, departamento, municipio

### Orquídeas
- **Total**: ~800 orquídeas registradas
- Incluye nombre científico, origen, grupo, clase, participante

### Inscripciones
- **Total**: ~200+ inscripciones
- Relaciona participantes con orquídeas mediante correlativo

### Ganadores
- **Total**: ~150 premios
- Incluye posición (1°, 2°, 3°), empates, fecha de premiación

## ⚙️ Configuración Técnica

### Requisitos Previos

1. **Laravel 11+** con base de datos configurada
2. **Python 3.7+** para el script extractor
3. **MySQL** con permisos de escritura
4. **Backup** de la base de datos actual

### Estructura de la BD Nueva

El seeder asume que ya existen estas tablas:
- `tb_evento` (eventos)
- `tb_participante` (con columna `id_evento`)
- `tb_orquidea` (con columna `id_evento`)
- `tb_inscripcion` (con columna `id_evento`)
- `tb_ganadores` (con columna `id_evento`)

### Mapeo de IDs

El seeder mantiene mapeos para preservar relaciones:

```php
$participantesMap = [ID_Antiguo => ID_Nuevo]
$orquideasMap = [ID_Antiguo => ID_Nuevo]
$inscripcionesMap = [ID_Antiguo => ID_Nuevo]
```

Esto asegura que:
- Las orquídeas apunten al participante correcto
- Las inscripciones relacionen participante-orquídea correctamente
- Los ganadores apunten a la inscripción correcta

## 🔍 Verificación Post-Migración

### Consultas SQL de Verificación

```sql
-- Verificar evento creado
SELECT * FROM tb_evento WHERE nombre_evento = 'Concurso de Orquídeas 2024';

-- Contar registros migrados
SELECT 
    (SELECT COUNT(*) FROM tb_participante WHERE id_evento = 1) as participantes,
    (SELECT COUNT(*) FROM tb_orquidea WHERE id_evento = 1) as orquideas,
    (SELECT COUNT(*) FROM tb_inscripcion WHERE id_evento = 1) as inscripciones,
    (SELECT COUNT(*) FROM tb_ganadores WHERE id_evento = 1) as ganadores;

-- Verificar integridad de ganadores
SELECT g.*, i.correlativo, o.nombre_planta, p.nombre
FROM tb_ganadores g
INNER JOIN tb_inscripcion i ON g.id_inscripcion = i.id_nscr
INNER JOIN tb_orquidea o ON i.id_orquidea = o.id_orquidea
INNER JOIN tb_participante p ON i.id_participante = p.id
WHERE g.id_evento = 1
ORDER BY g.fecha_ganador
LIMIT 10;
```

### Totales Esperados

Comparar estos números con tu SQL original:

| Tabla | Total Esperado |
|-------|----------------|
| Participantes | ~56 |
| Orquídeas | ~800 |
| Inscripciones | ~200 |
| Ganadores | ~150 |

## 🚨 Solución de Problemas

### Error: "Participante no encontrado"

**Causa**: El array de participantes no está completo.

**Solución**: El seeder ya incluye TODOS los 56 participantes del 2024. Si ves este error, verifica que el script Python extrajo correctamente los datos.

### Error: "Duplicate entry"

**Causa**: El seeder ya se ejecutó anteriormente.

**Solución**: El seeder verifica duplicados automáticamente. Si quieres reejecutar:

```sql
DELETE FROM tb_ganadores WHERE id_evento = 1;
DELETE FROM tb_inscripcion WHERE id_evento = 1;
DELETE FROM tb_orquidea WHERE id_evento = 1;
DELETE FROM tb_participante WHERE id_evento = 1;
DELETE FROM tb_evento WHERE id_evento = 1;
```

### Error: "Foreign key constraint fails"

**Causa**: Tablas de catálogos (clases, grupos, ASO) no están pobladas.

**Solución**:
```bash
php artisan db:seed --class=ClaseSeeder
php artisan db:seed --class=GrupoSeeder
php artisan db:seed --class=AsoSeeder
```

### Orquídeas con participante NULL

**Causa**: El participante no existe en el array o tiene un ID diferente.

**Solución**: El script muestra advertencias. Revisa los logs para identificar IDs faltantes.

## 📝 Notas Importantes

### Fotos de Orquídeas

- La mayoría de orquídeas tienen `foto = NULL` en 2024
- Si necesitas migrar fotos:
  1. Copiar carpeta `public/storage/orquideas/` de la BD antigua
  2. Actualizar rutas en la tabla después de migrar

### QR Codes

- Los QR codes antiguos se ignoran (se generarán nuevos si es necesario)
- El campo `qr_code` y `codigo_orquidea` del SQL original no se migran

### Fechas

- Todas las fechas se preservan del sistema original
- Formato: Carbon/Datetime para compatibilidad con Laravel

### Usuarios

- Los participantes se asocian al usuario `id = 1` (admin) por defecto
- Puedes actualizar esto después si tienes el mapeo de usuarios

## 🎯 Próximos Pasos

Después de la migración exitosa:

1. **Verificar datos en el sistema**
   - Navegar a `/participantes`
   - Ver listado de orquídeas
   - Revisar ganadores

2. **Generar reportes históricos**
   - Usar la funcionalidad de reportes existente
   - Filtrar por evento 2024

3. **Migrar eventos adicionales**
   - Duplicar el seeder para años anteriores (2023, 2022, etc.)
   - Adaptar fechas y datos

## 📚 Referencias

- [Guía Completa de Migración](GUIA_MIGRACION_EVENTO_2024.md)
- [Documentación Laravel Seeders](https://laravel.com/docs/11.x/seeding)
- Archivo SQL fuente: `u245906636_orquideasAAO.sql`

## ✅ Checklist de Migración

- [ ] Python 3 instalado
- [ ] Backup de BD actual creado
- [ ] Script `extraer_datos_sql.py` ejecutado
- [ ] Archivos .txt generados revisados
- [ ] Seeder actualizado con datos completos
- [ ] Seeders de catálogos ejecutados
- [ ] `Evento2024Seeder` ejecutado sin errores
- [ ] Totales verificados vs SQL original
- [ ] Relaciones verificadas (participante-orquídea-ganador)
- [ ] Pruebas en interfaz web realizadas

## 🤝 Soporte

Si encuentras problemas:
1. Revisa los logs de Laravel: `storage/logs/laravel.log`
2. Ejecuta las consultas SQL de verificación
3. Documenta el error específico con:
   - Mensaje de error completo
   - Línea del seeder donde ocurre
   - Estado de la BD antes del error

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0
**Autor**: Sistema de Gestión de Orquídeas AAO
