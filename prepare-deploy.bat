@echo off
echo ==========================================
echo   PREPARANDO APLICACION PARA HOSTINGER
echo ==========================================
echo.

echo [1/6] Instalando dependencias de produccion...
call composer install --optimize-autoloader --no-dev
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias
    pause
    exit /b 1
)

echo.
echo [2/6] Compilando assets del frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo al compilar assets
    pause
    exit /b 1
)

echo.
echo [3/6] Limpiando caches...
php artisan optimize:clear

echo.
echo [4/6] Optimizando para produccion...
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo.
echo [5/6] Creando archivo .env.production...
if not exist .env.production (
    copy .env .env.production
    echo NOTA: Edita .env.production con las credenciales de Hostinger
) else (
    echo Ya existe .env.production
)

echo.
echo [6/6] Exportando base de datos...
php artisan schema:dump
echo Base de datos exportada a database/schema/

echo.
echo ==========================================
echo   PREPARACION COMPLETADA
echo ==========================================
echo.
echo PROXIMOS PASOS:
echo 1. Edita .env.production con las credenciales de Hostinger
echo 2. Sube los archivos a Hostinger (ver DEPLOYMENT_GUIDE.md)
echo 3. Importa la base de datos en phpMyAdmin
echo.
pause
