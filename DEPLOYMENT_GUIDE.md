# Guía de Despliegue en Hostinger (Hosting Compartido)

## Requisitos Previos
- Cuenta de Hostinger con hosting compartido
- Acceso FTP o File Manager
- Base de datos MySQL creada en Hostinger

## Pasos para Desplegar

### 1. Preparar la aplicación localmente

```bash
# 1. Compilar los assets del frontend
npm run build

# 2. Optimizar Laravel para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Crear archivo .env de producción
# Copiar .env y ajustar para producción
```

### 2. Configurar .env para Producción

Crea un archivo `.env.production` con:

```env
APP_NAME="Orquídeas AAO"
APP_ENV=production
APP_KEY=base64:YIj48nr/DEjSKx0DmrgXj28+oDLLM/554Os7ur613WM=
APP_DEBUG=false
APP_URL=https://tudominio.com

# Base de datos de Hostinger
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=tu_usuario_nombredb
DB_USERNAME=tu_usuario_db
DB_PASSWORD=tu_password_db

# Session y Cache
SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=database

# Mail (opcional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=tu@email.com
MAIL_PASSWORD=tu_password
MAIL_ENCRYPTION=tls
```

### 3. Estructura de Archivos para Subir

**Archivos/carpetas que SÍ debes subir:**
```
├── app/
├── bootstrap/
├── config/
├── database/
├── public/         (Este será tu public_html)
├── resources/
├── routes/
├── storage/
├── vendor/         (si no hay composer en servidor)
├── artisan
├── composer.json
├── composer.lock
└── .env            (renombrar .env.production a .env)
```

**Archivos que NO subas:**
```
- node_modules/
- .git/
- .env.local
- tests/
```

### 4. Subir Archivos a Hostinger

#### Opción A: File Manager de Hostinger
1. Entra a hPanel de Hostinger
2. Ve a "File Manager"
3. Navega a `public_html`
4. **IMPORTANTE:** Sube TODO excepto `public/` a una carpeta llamada `laravel` dentro de `public_html`
5. El contenido de la carpeta `public/` súbelo directamente a `public_html`

**Estructura final en Hostinger:**
```
public_html/
├── laravel/              (Todo el proyecto Laravel)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── vendor/
│   └── ...
├── index.php            (de public/)
├── .htaccess            (de public/)
└── build/               (assets compilados)
```

#### Opción B: FTP (FileZilla)
1. Descarga FileZilla
2. Credenciales FTP desde hPanel
3. Conecta y sube archivos igual que en Opción A

### 5. Configurar index.php

Edita `public_html/index.php` y cambia las rutas:

```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Cambiar esta línea
require __DIR__.'/laravel/vendor/autoload.php';

// Cambiar esta línea
$app = require_once __DIR__.'/laravel/bootstrap/app.php';

$app->handleRequest(Request::capture());
```

### 6. Configurar .htaccess

Edita o crea `public_html/.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # Redirigir a HTTPS (opcional pero recomendado)
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # Manejo de rutas de Laravel
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### 7. Permisos de Carpetas

En File Manager o FTP, establece permisos:

```bash
storage/ → 755 (recursivo)
storage/framework/ → 755 (recursivo)
storage/logs/ → 755
bootstrap/cache/ → 755
```

### 8. Crear Base de Datos en Hostinger

1. hPanel → "Bases de Datos MySQL"
2. Crear nueva base de datos
3. Crear usuario y asignar a la base de datos
4. Anotar: nombre_bd, usuario, contraseña
5. Actualizar .env con estos datos

### 9. Importar Base de Datos

#### Opción A: phpMyAdmin
1. hPanel → "phpMyAdmin"
2. Seleccionar tu base de datos
3. Importar → Seleccionar archivo SQL
4. Ejecutar

#### Opción B: Crear desde cero
```bash
# Localmente, exportar estructura:
php artisan migrate --pretend > migraciones.sql

# Subir y ejecutar en phpMyAdmin
```

### 10. Ejecutar Seeders (Opcional)

Si no puedes usar artisan en servidor:
```bash
# Local: Exportar datos
php artisan db:seed
mysqldump -u root orquidea1 > datos_completos.sql

# Importar en Hostinger vía phpMyAdmin
```

### 11. Limpiar Cachés (Si tienes SSH)

Si Hostinger te da acceso SSH:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### 12. Verificación

Visita: `https://tudominio.com`

Deberías ver tu aplicación funcionando.

## Problemas Comunes

### Error 500
- Verificar permisos de storage/ y bootstrap/cache/
- Verificar que .env existe y tiene APP_KEY
- Revisar logs en storage/logs/laravel.log

### Assets no cargan
- Verificar que la carpeta build/ está en public_html/
- Verificar APP_URL en .env

### Base de datos no conecta
- Verificar credenciales en .env
- DB_HOST debe ser "localhost" en Hostinger
- Usuario debe tener permisos completos

### Sesiones no funcionan
- SESSION_DRIVER=file en .env
- Permisos 755 en storage/framework/sessions/

## Comandos Útiles Pre-Deploy

```bash
# Compilar assets
npm run build

# Limpiar todo
php artisan optimize:clear

# Optimizar para producción
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Verificar que todo compila
composer install --optimize-autoloader --no-dev
```

## Checklist Final

- [ ] npm run build ejecutado
- [ ] .env configurado para producción
- [ ] APP_DEBUG=false
- [ ] Base de datos creada en Hostinger
- [ ] Archivos subidos correctamente
- [ ] index.php modificado con rutas correctas
- [ ] Permisos de storage/ configurados
- [ ] Base de datos importada
- [ ] Probado en navegador

## Soporte

Si tienes problemas:
1. Revisa storage/logs/laravel.log
2. Activa temporalmente APP_DEBUG=true
3. Verifica phpMyAdmin que la BD tiene datos
4. Contacta soporte de Hostinger para verificar requisitos PHP
