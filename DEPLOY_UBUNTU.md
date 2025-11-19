# 🚀 Despliegue en Servidor Ubuntu (VPS)

## Requisitos del Servidor
- Ubuntu 20.04+ o 22.04 LTS
- Acceso SSH (root o sudo)
- Dominio apuntando al servidor (opcional pero recomendado)

---

## 📋 PARTE 1: Preparar el Servidor Ubuntu

### 1. Conectar al servidor
```bash
ssh usuario@tu-servidor-ip
# o
ssh root@tu-servidor-ip
```

### 2. Actualizar el sistema
```bash
sudo apt update
sudo apt upgrade -y
```

### 3. Instalar dependencias básicas
```bash
sudo apt install -y software-properties-common curl wget git unzip
```

---

## 🐘 PARTE 2: Instalar PHP 8.2+

### 1. Agregar repositorio de PHP
```bash
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update
```

### 2. Instalar PHP y extensiones necesarias
```bash
sudo apt install -y php8.2 php8.2-fpm php8.2-cli php8.2-common \
    php8.2-mysql php8.2-xml php8.2-curl php8.2-gd \
    php8.2-mbstring php8.2-zip php8.2-bcmath \
    php8.2-intl php8.2-readline php8.2-opcache
```

### 3. Verificar instalación
```bash
php -v
# Debe mostrar: PHP 8.2.x
```

---

## 🎼 PARTE 3: Instalar Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
sudo chmod +x /usr/local/bin/composer
composer --version
```

---

## 🗄️ PARTE 4: Instalar MySQL

### 1. Instalar MySQL Server
```bash
sudo apt install -y mysql-server
```

### 2. Configurar MySQL (seguridad)
```bash
sudo mysql_secure_installation
```
**Respuestas recomendadas:**
- ¿Validar contraseñas? `Y`
- Nivel de validación: `2` (STRONG)
- Establecer contraseña root: `TuContraseñaSegura123!`
- Eliminar usuarios anónimos: `Y`
- Deshabilitar login remoto de root: `Y`
- Eliminar base de datos de prueba: `Y`
- Recargar privilegios: `Y`

### 3. Crear base de datos y usuario
```bash
sudo mysql -u root -p
```

Dentro de MySQL:
```sql
CREATE DATABASE orquideas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'orquideas_user'@'localhost' IDENTIFIED BY 'ContraseñaSegura123!';
GRANT ALL PRIVILEGES ON orquideas_db.* TO 'orquideas_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🌐 PARTE 5: Instalar Nginx

### 1. Instalar Nginx
```bash
sudo apt install -y nginx
```

### 2. Verificar que está corriendo
```bash
sudo systemctl status nginx
```

### 3. Habilitar en inicio automático
```bash
sudo systemctl enable nginx
```

---

## 📦 PARTE 6: Instalar Node.js (para compilar assets)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## 🚢 PARTE 7: Subir el Proyecto

### Opción A: Desde tu PC usando SCP/SFTP

**Desde tu PC (PowerShell):**
```powershell
# Comprimir proyecto (sin node_modules ni vendor)
Compress-Archive -Path "app", "bootstrap", "config", "database", "public", "resources", "routes", "storage", "artisan", "composer.json", "composer.lock", "package.json", "package-lock.json", "vite.config.ts", "tsconfig.json", ".env.production" -DestinationPath "proyecto.zip"

# Subir al servidor
scp proyecto.zip usuario@servidor-ip:/tmp/
```

**En el servidor:**
```bash
# Crear directorio del proyecto
sudo mkdir -p /var/www/orquideas
sudo chown -R $USER:$USER /var/www/orquideas

# Descomprimir
cd /var/www/orquideas
unzip /tmp/proyecto.zip
```

### Opción B: Clonar desde Git (Recomendado)

**En el servidor:**
```bash
cd /var/www
sudo git clone https://github.com/Guadamuzz17/Orquideas_final.git orquideas
sudo chown -R $USER:$USER /var/www/orquideas
cd /var/www/orquideas
```

---

## ⚙️ PARTE 8: Configurar el Proyecto Laravel

### 1. Instalar dependencias PHP
```bash
cd /var/www/orquideas
composer install --optimize-autoloader --no-dev
```

### 2. Configurar archivo .env
```bash
cp .env.production .env
nano .env
```

Editar con tus datos:
```env
APP_NAME="AAOGT Sistema de Orquídeas"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=orquideas_db
DB_USERNAME=orquideas_user
DB_PASSWORD=ContraseñaSegura123!

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync
```

### 3. Generar APP_KEY
```bash
php artisan key:generate
```

### 4. Instalar dependencias Node y compilar assets
```bash
npm install
npm run build
```

### 5. Configurar permisos
```bash
sudo chown -R www-data:www-data /var/www/orquideas/storage
sudo chown -R www-data:www-data /var/www/orquideas/bootstrap/cache
sudo chmod -R 775 /var/www/orquideas/storage
sudo chmod -R 775 /var/www/orquideas/bootstrap/cache
```

### 6. Optimizar Laravel
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 7. Migrar base de datos
```bash
php artisan migrate --force
php artisan db:seed --force
```

---

## 🌍 PARTE 9: Configurar Nginx

### 1. Crear configuración del sitio
```bash
sudo nano /etc/nginx/sites-available/orquideas
```

**Contenido del archivo:**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    root /var/www/orquideas/public;
    index index.php index.html;

    # Logs
    access_log /var/log/nginx/orquideas-access.log;
    error_log /var/log/nginx/orquideas-error.log;

    # Charset
    charset utf-8;

    # Location principal
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    # Assets estáticos
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Denegar acceso a archivos ocultos
    location ~ /\. {
        deny all;
    }

    # Denegar acceso a archivos de configuración
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 2. Activar el sitio
```bash
sudo ln -s /etc/nginx/sites-available/orquideas /etc/nginx/sites-enabled/
```

### 3. Probar configuración
```bash
sudo nginx -t
```

### 4. Reiniciar Nginx
```bash
sudo systemctl restart nginx
```

---

## 🔒 PARTE 10: Instalar SSL (HTTPS) con Let's Encrypt

### 1. Instalar Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Obtener certificado SSL
```bash
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

**Seguir el asistente:**
- Email: tu@email.com
- Aceptar términos: `Y`
- Compartir email: `N` (opcional)
- Redireccionar HTTP a HTTPS: `2` (Sí)

### 3. Renovación automática
```bash
sudo systemctl status certbot.timer
# Debe estar activo (auto-renovación)
```

---

## 🔧 PARTE 11: Configuración Adicional (Recomendado)

### 1. Firewall (UFW)
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

### 2. Configurar PHP-FPM para producción
```bash
sudo nano /etc/php/8.2/fpm/php.ini
```

Buscar y modificar:
```ini
upload_max_filesize = 20M
post_max_size = 25M
max_execution_time = 300
memory_limit = 256M
```

Reiniciar PHP-FPM:
```bash
sudo systemctl restart php8.2-fpm
```

### 3. Configurar cron para tareas programadas
```bash
sudo crontab -e
```

Agregar:
```cron
* * * * * cd /var/www/orquideas && php artisan schedule:run >> /dev/null 2>&1
```

---

## ✅ PARTE 12: Verificación Final

### 1. Verificar servicios
```bash
sudo systemctl status nginx
sudo systemctl status php8.2-fpm
sudo systemctl status mysql
```

### 2. Probar la aplicación
```bash
# En el navegador:
http://tu-dominio.com
# o
https://tu-dominio.com (si instalaste SSL)
```

### 3. Verificar logs si hay errores
```bash
# Logs de Nginx
sudo tail -f /var/log/nginx/orquideas-error.log

# Logs de Laravel
tail -f /var/www/orquideas/storage/logs/laravel.log

# Logs de PHP-FPM
sudo tail -f /var/log/php8.2-fpm.log
```

---

## 🔄 Actualizar la Aplicación

```bash
cd /var/www/orquideas

# Si usas Git
git pull origin master

# Reinstalar dependencias
composer install --optimize-autoloader --no-dev
npm install
npm run build

# Migrar BD
php artisan migrate --force

# Limpiar y regenerar cachés
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Reiniciar servicios
sudo systemctl restart php8.2-fpm
sudo systemctl reload nginx
```

---

## 🛠️ Solución de Problemas

### Error 502 Bad Gateway
```bash
# Verificar PHP-FPM
sudo systemctl status php8.2-fpm
sudo systemctl restart php8.2-fpm

# Verificar permisos
sudo chown -R www-data:www-data /var/www/orquideas/storage
```

### Error 500 Internal Server Error
```bash
# Ver logs de Laravel
tail -50 /var/www/orquideas/storage/logs/laravel.log

# Verificar permisos
sudo chmod -R 775 /var/www/orquideas/storage
sudo chmod -R 775 /var/www/orquideas/bootstrap/cache
```

### Assets no cargan
```bash
# Verificar que build/ existe
ls -la /var/www/orquideas/public/build/

# Recompilar
cd /var/www/orquideas
npm run build

# Verificar APP_URL en .env
grep APP_URL /var/www/orquideas/.env
```

### Base de datos no conecta
```bash
# Verificar MySQL
sudo systemctl status mysql

# Probar conexión
mysql -u orquideas_user -p orquideas_db

# Verificar credenciales en .env
cat /var/www/orquideas/.env | grep DB_
```

---

## 📊 Monitoreo y Mantenimiento

### Logs importantes
```bash
# Nginx access
sudo tail -f /var/log/nginx/orquideas-access.log

# Nginx errors
sudo tail -f /var/log/nginx/orquideas-error.log

# Laravel
tail -f /var/www/orquideas/storage/logs/laravel.log

# MySQL
sudo tail -f /var/log/mysql/error.log
```

### Backup de base de datos
```bash
# Crear backup
mysqldump -u orquideas_user -p orquideas_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u orquideas_user -p orquideas_db < backup_20251115.sql
```

### Espacio en disco
```bash
df -h
du -sh /var/www/orquideas
```

---

## 🎯 Checklist Rápido

- [ ] Ubuntu actualizado
- [ ] PHP 8.2+ instalado
- [ ] Composer instalado
- [ ] MySQL instalado y configurado
- [ ] Nginx instalado
- [ ] Node.js instalado
- [ ] Proyecto subido a /var/www/orquideas
- [ ] .env configurado
- [ ] APP_KEY generada
- [ ] Dependencias instaladas (composer + npm)
- [ ] Assets compilados (npm run build)
- [ ] Permisos configurados (775 storage y bootstrap/cache)
- [ ] Laravel optimizado (caches)
- [ ] Base de datos migrada y seeded
- [ ] Nginx configurado
- [ ] Sitio activado en Nginx
- [ ] SSL instalado (Let's Encrypt)
- [ ] Firewall configurado
- [ ] Cron configurado
- [ ] Aplicación funcionando en el navegador

---

## 🚀 ¡Listo!

Tu aplicación Laravel + Inertia + React está corriendo en producción en Ubuntu.

**Accede a:** https://tu-dominio.com

**Para soporte:** Revisa los logs mencionados arriba.
