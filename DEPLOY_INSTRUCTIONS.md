# ✅ APLICACIÓN LISTA PARA DESPLEGAR EN HOSTINGER

## 📊 Estado Actual
- ✅ Assets compilados (npm run build)
- ✅ Laravel optimizado (config, routes, views cached)
- ✅ .env.production configurado
- ✅ Rutas duplicadas corregidas

## 🔐 Credenciales Configuradas
- **Dominio**: aaocoban.com
- **Base de Datos**: u245906636_aaogt
- **Usuario BD**: u245906636_aaogt
- **Password BD**: 2905Andres@

## 📦 PASO 1: Exportar Base de Datos

### Opción A: phpMyAdmin Local
1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Selecciona la base de datos `orquidea1`
3. Click en "Exportar"
4. Selecciona "Método rápido" y formato "SQL"
5. Click "Continuar"
6. Guarda el archivo como `orquideas_database.sql`

### Opción B: MySQL Workbench
1. Abre MySQL Workbench
2. Server → Data Export
3. Selecciona `orquidea1`
4. Export to Self-Contained File
5. Guarda como `orquideas_database.sql`

## 📤 PASO 2: Preparar Archivos para Subir

### Archivos/Carpetas que DEBES subir:
```
✅ app/
✅ bootstrap/
✅ config/
✅ database/
✅ public/ (con build/ compilado)
✅ resources/
✅ routes/
✅ storage/
✅ vendor/
✅ artisan
✅ composer.json
✅ composer.lock
✅ .env.production (renombrar a .env al subir)
```

### NO subas:
```
❌ node_modules/
❌ .git/
❌ .env (local)
❌ tests/
❌ .gitignore
```

## 🌐 PASO 3: Subir a Hostinger

### 3.1 Acceder a File Manager
1. Ve a https://hpanel.hostinger.com
2. Inicia sesión
3. Selecciona tu hosting
4. Click en "File Manager"

### 3.2 Estructura de Carpetas

**IMPORTANTE:** Debes crear esta estructura:

```
public_html/
├── laravel/              ← Aquí TODO excepto public/
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   ├── artisan
│   ├── composer.json
│   └── .env             ← Renombrar .env.production a .env
│
├── index.php            ← De la carpeta public/
├── .htaccess            ← De la carpeta public/
├── robots.txt           ← De la carpeta public/
└── build/               ← De la carpeta public/build/
```

### 3.3 Subir Archivos

1. **Crear carpeta laravel:**
   - En File Manager, entra a `public_html/`
   - Click derecho → New Folder → Nombre: `laravel`

2. **Subir proyecto Laravel:**
   - Entra a `public_html/laravel/`
   - Sube TODO excepto la carpeta `public/`
   - NO olvides incluir `vendor/`

3. **Subir contenido de public:**
   - Regresa a `public_html/`
   - Sube el contenido de tu carpeta `public/` directamente aquí
   - Asegúrate que `build/` se suba completo

4. **Renombrar .env:**
   - Entra a `public_html/laravel/`
   - Busca `.env.production`
   - Click derecho → Rename → Cambia a `.env`

## ⚙️ PASO 4: Modificar index.php

Edita `public_html/index.php` con File Manager:

**Busca estas líneas (alrededor de línea 17):**
```php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```

**Cámbialas por:**
```php
require __DIR__.'/laravel/vendor/autoload.php';
$app = require_once __DIR__.'/laravel/bootstrap/app.php';
```

**Guarda el archivo.**

## 🗄️ PASO 5: Configurar Base de Datos

### 5.1 Crear Base de Datos (si no existe)
1. hPanel → "MySQL Databases"
2. Debería existir: `u245906636_aaogt`
3. Si no existe, créala

### 5.2 Importar Datos
1. hPanel → "phpMyAdmin"
2. Inicia sesión
3. Selecciona base de datos `u245906636_aaogt`
4. Click en "Importar"
5. Click "Choose File" → Selecciona `orquideas_database.sql`
6. Scroll abajo → Click "Continuar"
7. Espera a que termine (puede tardar si hay muchos datos)

## 🔒 PASO 6: Configurar Permisos

Usando File Manager, establece estos permisos:

1. `public_html/laravel/storage/` → 755 (recursivo)
2. `public_html/laravel/bootstrap/cache/` → 755

**Para cambiar permisos:**
- Click derecho en carpeta → Permissions
- Marca: Owner (Read, Write, Execute)
- Marca: Group (Read, Execute)
- Marca: Public (Read, Execute)
- Marca "Recurse into subdirectories"
- Apply

## 🧪 PASO 7: Verificar Instalación

### 7.1 Probar el Sitio
Visita: `https://aaocoban.com`

**Deberías ver:**
- ✅ Página de inicio o login
- ✅ Estilos cargando correctamente
- ✅ Sin errores 500

### 7.2 Si hay Error 500
1. Activa modo debug temporalmente:
   - Edita `public_html/laravel/.env`
   - Cambia `APP_DEBUG=false` a `APP_DEBUG=true`
   - Recarga el sitio para ver el error específico
   - **IMPORTANTE:** Vuelve a `APP_DEBUG=false` después de arreglar

2. Revisa logs:
   - `public_html/laravel/storage/logs/laravel.log`

### 7.3 Problemas Comunes

#### Assets no cargan (CSS/JS)
- Verifica que `public_html/build/` existe
- Verifica `APP_URL=https://aaocoban.com` en .env
- Vacía cache del navegador (Ctrl+Shift+Del)

#### Error de base de datos
- Verifica credenciales en .env
- Verifica que phpMyAdmin importó todo
- `DB_HOST` debe ser `localhost`

#### Sesiones no funcionan
- Permisos 755 en `storage/`
- `SESSION_DRIVER=file` en .env

#### Error 404 en rutas
- Verifica que `.htaccess` existe en `public_html/`
- Hostinger debe tener mod_rewrite activado (normalmente sí)

## 🎉 PASO 8: Configuración Final

### 8.1 Limpiar Cachés (Si tienes SSH)

Si Hostinger te da acceso SSH:
```bash
cd public_html/laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### 8.2 Configurar HTTPS

Hostinger automáticamente debe redirigir a HTTPS. Si no:
1. hPanel → SSL/TLS
2. Activar "Force HTTPS Redirect"

### 8.3 Configurar Email (Opcional)

Si quieres enviar emails:
1. hPanel → Email Accounts
2. Crear cuenta: `noreply@aaocoban.com`
3. Actualizar en .env:
   ```env
   MAIL_USERNAME=noreply@aaocoban.com
   MAIL_PASSWORD=tu_password_email
   ```

## 📝 Notas Importantes

1. **Seguridad:**
   - SIEMPRE mantén `APP_DEBUG=false` en producción
   - No compartas credenciales de .env
   - Cambia `APP_KEY` si haces deploy público

2. **Actualizaciones:**
   - Para actualizar: compila local, sube archivos modificados
   - Siempre haz backup de BD antes de actualizar

3. **Backups:**
   - Hostinger hace backups automáticos
   - También haz backup manual semanal de BD

4. **Performance:**
   - Hostinger tiene cache automático
   - Considera usar CDN para assets estáticos

## ✅ Checklist de Despliegue

Marca cada item al completarlo:

- [ ] Base de datos exportada localmente
- [ ] Carpeta `laravel` creada en `public_html/`
- [ ] Proyecto subido a `public_html/laravel/`
- [ ] Contenido de `public/` subido a `public_html/`
- [ ] `.env.production` renombrado a `.env`
- [ ] `index.php` modificado con rutas correctas
- [ ] Permisos 755 en `storage/` y `bootstrap/cache/`
- [ ] Base de datos creada en Hostinger
- [ ] Base de datos importada vía phpMyAdmin
- [ ] Sitio probado en navegador
- [ ] `APP_DEBUG=false` en producción
- [ ] HTTPS funcionando

## 🆘 Soporte

**Hostinger Soporte:**
- Chat 24/7 en hPanel
- Tickets: https://support.hostinger.com

**Errores Laravel:**
- Revisa `storage/logs/laravel.log`
- Activa temporalmente `APP_DEBUG=true` para ver errores detallados

---

## 🎊 ¡Listo!

Tu aplicación de Orquídeas AAO está lista para funcionar en:
**https://aaocoban.com**

¡Éxito con el despliegue! 🌸
