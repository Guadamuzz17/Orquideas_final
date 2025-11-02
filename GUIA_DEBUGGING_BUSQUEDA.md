# 🔍 Guía de Debugging - Búsqueda de Participantes

## ✅ Cambios Implementados

### Backend (ParticipanteController.php)

1. **Mínimo reducido**: De 3 a **2 caracteres**
2. **Búsqueda más flexible**: 
   - LIKE con comodines `%search%`
   - Case-insensitive con `LOWER()`
   - Búsqueda por palabras individuales
   - Búsqueda por nombre Y teléfono
3. **Límite aumentado**: De 10 a **15 resultados**
4. **Logs agregados**: Para debugging en `storage/logs/laravel.log`
5. **Filtro opcional**: Si NO hay evento activo, busca en TODOS los eventos

### Frontend (Create.tsx)

1. **Mínimo reducido**: De 3 a **2 caracteres**
2. **Siempre muestra resultados**: Incluso si está vacío
3. **Mensaje de éxito**: "Se encontraron X coincidencias"
4. **Mensaje de no encontrado**: Más claro y descriptivo
5. **Console.log agregados**: Para debugging en navegador
6. **Toast de error**: Si falla la petición

---

## 🧪 Cómo Probar

### 1. Verificar que hay datos en la base de datos

```sql
-- Conectar a MySQL
mysql -u root -p

-- Usar la base de datos
USE expoorquideas;

-- Ver cuántos participantes hay
SELECT COUNT(*) as total FROM tb_participante;

-- Ver algunos nombres de participantes
SELECT id_participante, nombre, numero_telefonico, id_evento 
FROM tb_participante 
LIMIT 20;

-- Ver eventos disponibles
SELECT * FROM tb_evento;
```

### 2. Probar el endpoint directamente

Abre el navegador y prueba:

```
http://127.0.0.1:8000/participantes/search-recycle?query=ju
```

**Resultado esperado**: JSON con participantes que contengan "ju"

```json
[
  {
    "id_participante": 1,
    "nombre": "Juan Pérez",
    "numero_telefonico": "5551-2345",
    ...
  }
]
```

### 3. Probar en el formulario

1. Abre: `http://127.0.0.1:8000/participantes/create`
2. En la sección azul de "Reciclar Datos", escribe: `ju`
3. Espera 300ms (debounce)
4. Deberías ver resultados o mensaje de "no encontrado"

### 4. Ver logs del backend

```powershell
# En terminal, ver logs en tiempo real
cd "d:\Huecada de esto\Orquideas_final"
Get-Content storage/logs/laravel.log -Wait -Tail 50
```

Busca líneas como:
```
[timestamp] local.INFO: Búsqueda de reciclaje {"query":"ju","evento_activo":null,"length":2}
[timestamp] local.INFO: Resultados encontrados {"count":5,"participantes":["Juan Pérez","Juana López",...]}
```

### 5. Ver logs del frontend

1. Abre: `http://127.0.0.1:8000/participantes/create`
2. Presiona `F12` para abrir DevTools
3. Ve a la pestaña **Console**
4. Escribe en el input de búsqueda
5. Deberías ver:
   ```
   Buscando participantes con query: ju
   Resultados recibidos: Array(5) [...]
   ```

### 6. Ver peticiones de red

1. En DevTools, ve a **Network** (Red)
2. Filtra por `XHR` o `Fetch`
3. Escribe en el input de búsqueda
4. Deberías ver una petición a: `participantes/search-recycle?query=ju`
5. Haz clic en la petición
6. Ve a **Response** para ver el JSON devuelto

---

## 🐛 Problemas Comunes

### Problema 1: "No se encontraron registros previos" siempre

**Posibles causas:**
1. No hay datos en `tb_participante`
2. Todos los participantes están en el evento activo actual
3. El evento activo no está definido en sesión

**Solución:**
```sql
-- Verificar datos
SELECT COUNT(*) FROM tb_participante;

-- Ver evento activo en sesión (desde PHP)
-- En ParticipanteController, agregar:
\Log::info('Evento activo', ['evento' => session('evento_activo')]);

-- Si NO hay evento activo, modificar la búsqueda para buscar en TODOS
-- Ya está implementado: if ($eventoActivo) { ... }
```

### Problema 2: Búsqueda no responde

**Posibles causas:**
1. Ruta no registrada
2. Error en el backend
3. Error de permisos

**Solución:**
```powershell
# Verificar rutas
php artisan route:list | Select-String "search-recycle"

# Limpiar cache de rutas
php artisan route:clear
php artisan config:clear
php artisan cache:clear

# Verificar permisos de storage
# (debe ser escribible para logs)
```

### Problema 3: Error 500 en la petición

**Posibles causas:**
1. Error de sintaxis en el código
2. Relación de modelo faltante
3. Error de base de datos

**Solución:**
```powershell
# Ver últimas líneas del log
Get-Content storage/logs/laravel.log -Tail 100

# Buscar errores PHP
Select-String -Path storage/logs/laravel.log -Pattern "ERROR|CRITICAL" | Select-Object -Last 10
```

### Problema 4: Resultados duplicados

**Ya solucionado**: Agrupamos por nombre
```php
$uniqueParticipantes = $participantes->groupBy('nombre')->map(...);
```

### Problema 5: Búsqueda muy lenta

**Optimizaciones aplicadas:**
1. Debounce de 300ms
2. Límite de 15 resultados
3. Eager loading de relaciones: `with(['tipo', 'departamento', ...])`
4. Índices en la BD (si no existen):

```sql
-- Agregar índices para mejorar rendimiento
ALTER TABLE tb_participante ADD INDEX idx_nombre (nombre);
ALTER TABLE tb_participante ADD INDEX idx_telefono (numero_telefonico);
ALTER TABLE tb_participante ADD INDEX idx_evento (id_evento);
```

---

## 📊 Verificación Paso a Paso

### ✅ Checklist de Verificación

- [ ] **1. Compilación exitosa**
  ```powershell
  npm run build
  # Debe completar sin errores
  ```

- [ ] **2. Datos en la base de datos**
  ```sql
  SELECT COUNT(*) FROM tb_participante;
  -- Debe retornar > 0
  ```

- [ ] **3. Ruta registrada**
  ```powershell
  php artisan route:list | Select-String "search-recycle"
  # Debe mostrar: GET /participantes/search-recycle
  ```

- [ ] **4. Modelo tiene relación evento()**
  ```php
  // En app/Models/Participante.php
  public function evento() { ... }
  ```

- [ ] **5. Endpoint responde**
  ```
  http://127.0.0.1:8000/participantes/search-recycle?query=test
  # Debe retornar JSON (aunque sea [])
  ```

- [ ] **6. Frontend muestra búsqueda**
  ```
  http://127.0.0.1:8000/participantes/create
  # Debe mostrar sección azul "♻️ Reciclar Datos"
  ```

- [ ] **7. Input de búsqueda funciona**
  - Escribir 2+ caracteres
  - Ver spinner de carga
  - Ver resultados o mensaje de "no encontrado"

- [ ] **8. Clic en resultado abre modal**
  - Modal SweetAlert2 con detalles
  - Botones "Sí, reciclar" y "No, crear nuevo"

- [ ] **9. Reciclar autocompleta formulario**
  - Todos los campos se llenan
  - Municipios se cargan
  - Toast de éxito aparece

- [ ] **10. Logs funcionan**
  ```powershell
  Get-Content storage/logs/laravel.log -Tail 20
  # Debe mostrar logs de búsqueda
  ```

---

## 🎯 Ejemplos de Búsqueda

### Búsqueda por nombre completo
```
Input: "Juan Pérez"
Resultados esperados: Todos los "Juan Pérez" de eventos anteriores
```

### Búsqueda por nombre parcial
```
Input: "Ju"
Resultados esperados: Juan, Juana, Julia, etc.
```

### Búsqueda por apellido
```
Input: "Pérez"
Resultados esperados: Todos los que tengan "Pérez" en el nombre
```

### Búsqueda por teléfono completo
```
Input: "5551-2345"
Resultados esperados: Participante con ese teléfono
```

### Búsqueda por teléfono parcial
```
Input: "5551"
Resultados esperados: Todos los teléfonos que empiecen con 5551
```

### Búsqueda con palabras separadas
```
Input: "Juan López"
Resultados esperados: 
- Juan López (exacto)
- Juan García (por "Juan")
- María López (por "López")
```

---

## 🔄 Flujo Completo Esperado

```
1. Usuario abre /participantes/create
   ↓
2. Ve sección azul "♻️ Reciclar Datos de Eventos Anteriores"
   ↓
3. Escribe "ju" en el input
   ↓
4. Aparece spinner de carga (300ms)
   ↓
5. Backend recibe petición:
   - Log: "Búsqueda de reciclaje {query:ju, length:2}"
   ↓
6. Backend busca en tb_participante:
   - WHERE nombre LIKE '%ju%' OR telefono LIKE '%ju%'
   - WHERE id_evento != evento_activo (si existe)
   ↓
7. Backend retorna JSON con resultados
   - Log: "Resultados encontrados {count:3}"
   ↓
8. Frontend recibe resultados:
   - Console: "Resultados recibidos: Array(3)"
   ↓
9. Frontend muestra:
   - Si hay resultados: "✅ Se encontraron 3 coincidencias"
   - Si no hay: "⚠️ No se encontraron registros previos"
   ↓
10. Usuario hace clic en resultado
    ↓
11. Modal SweetAlert2 aparece con todos los detalles
    ↓
12. Usuario confirma "Sí, reciclar datos"
    ↓
13. Frontend autocompleta formulario:
    - Carga municipios del departamento
    - Llena todos los campos
    - Muestra toast de éxito
    ↓
14. Usuario revisa datos y guarda
    ↓
15. ✅ Participante creado en evento actual
```

---

## 💡 Tips Adicionales

### Ver datos de prueba
```sql
-- Nombres más comunes para buscar
SELECT nombre, COUNT(*) as veces
FROM tb_participante
GROUP BY nombre
ORDER BY veces DESC
LIMIT 10;

-- Teléfonos únicos
SELECT DISTINCT numero_telefonico
FROM tb_participante
LIMIT 20;
```

### Insertar participante de prueba
```sql
INSERT INTO tb_participante 
(nombre, numero_telefonico, direccion, id_tipo, id_departamento, id_municipio, id_aso, id_evento)
VALUES
('Juan de Prueba', '1234-5678', 'Dirección de prueba', 1, 1, 1, 1, 1);
```

### Limpiar logs
```powershell
# Vaciar archivo de logs
"" | Out-File storage/logs/laravel.log
```

### Reiniciar servidor Laravel
```powershell
# Detener cualquier servidor corriendo
# Ctrl+C en la terminal del servidor

# Iniciar de nuevo
php artisan serve
```

---

## 🎓 Debugging Avanzado

### Habilitar query log temporalmente

En `ParticipanteController.php`, agregar antes de la búsqueda:

```php
\DB::enableQueryLog();

// ... tu código de búsqueda ...

$queries = \DB::getQueryLog();
\Log::info('SQL Queries', $queries);
```

Esto mostrará en el log EXACTAMENTE qué SQL se ejecutó.

### Usar dd() para debugging

```php
// En lugar de return, usar:
dd($uniqueParticipantes);
// Esto detiene la ejecución y muestra el contenido
```

### Verificar axios en frontend

```typescript
// En Create.tsx, modificar temporalmente:
const response = await axios.get('/participantes/search-recycle', {
  params: { query: searchQuery }
});
console.log('Response completo:', response);
console.log('Status:', response.status);
console.log('Headers:', response.headers);
console.log('Data:', response.data);
```

---

## ✅ Estado Actual

**Backend:**
- ✅ Búsqueda flexible (2 caracteres, case-insensitive, palabras)
- ✅ Logs de debugging habilitados
- ✅ Límite de 15 resultados
- ✅ Filtro por evento activo (opcional)

**Frontend:**
- ✅ Debounce de 300ms
- ✅ Spinner de carga
- ✅ Mensajes claros (encontrado/no encontrado)
- ✅ Console.log para debugging
- ✅ Toast de errores

**Compilación:**
- ✅ Build exitoso: 6.51s
- ✅ Bundle: 371KB (gzip: 120KB)
- ✅ Sin errores TypeScript

---

**Estado:** ✅ MEJORADO Y LISTO PARA PROBAR  
**Versión:** 1.1 - Búsqueda Flexible  
**Fecha:** Noviembre 2, 2025

---

## 📞 Siguiente Paso

1. **Abre el navegador**: `http://127.0.0.1:8000/participantes/create`
2. **Prueba búsqueda con 2 caracteres**: Ejemplo: "ju", "ma", "55"
3. **Revisa la consola del navegador** (F12) para ver logs
4. **Si no funciona**, revisa `storage/logs/laravel.log`
5. **Reporta** qué ves en los logs para seguir debuggeando

---
