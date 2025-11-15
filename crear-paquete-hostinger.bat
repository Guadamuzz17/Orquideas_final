@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo   CREANDO PAQUETE PARA HOSTINGER
echo ==========================================
echo.

echo [0/8] Limpiando caches de Laravel...
php artisan view:clear >nul 2>&1
php artisan cache:clear >nul 2>&1
timeout /t 2 /nobreak >nul

:: Verificar que existe 7zip o PowerShell para comprimir
where 7z >nul 2>&1
if %errorlevel% equ 0 (
    set ZIPPER=7z
    echo [INFO] Usando 7zip para comprimir
) else (
    set ZIPPER=powershell
    echo [INFO] Usando PowerShell para comprimir
)

echo.
echo [1/7] Creando carpeta temporal...
if exist deploy_temp rmdir /s /q deploy_temp
mkdir deploy_temp
mkdir deploy_temp\laravel
mkdir deploy_temp\public_html

echo.
echo [2/8] Copiando archivos de Laravel (excepto public)...
xcopy /E /I /Y app deploy_temp\laravel\app\ >nul
xcopy /E /I /Y bootstrap deploy_temp\laravel\bootstrap\ >nul
xcopy /E /I /Y config deploy_temp\laravel\config\ >nul
xcopy /E /I /Y database deploy_temp\laravel\database\ >nul
xcopy /E /I /Y resources deploy_temp\laravel\resources\ >nul
xcopy /E /I /Y routes deploy_temp\laravel\routes\ >nul

:: Copiar storage pero sin archivos cache compilados
echo [INFO] Copiando storage (sin cache)...
mkdir deploy_temp\laravel\storage
mkdir deploy_temp\laravel\storage\app
mkdir deploy_temp\laravel\storage\framework
mkdir deploy_temp\laravel\storage\framework\cache
mkdir deploy_temp\laravel\storage\framework\sessions
mkdir deploy_temp\laravel\storage\framework\testing
mkdir deploy_temp\laravel\storage\framework\views
mkdir deploy_temp\laravel\storage\logs
echo. > deploy_temp\laravel\storage\logs\.gitkeep
echo. > deploy_temp\laravel\storage\app\.gitkeep
echo. > deploy_temp\laravel\storage\framework\cache\.gitkeep
echo. > deploy_temp\laravel\storage\framework\sessions\.gitkeep
echo. > deploy_temp\laravel\storage\framework\testing\.gitkeep
echo. > deploy_temp\laravel\storage\framework\views\.gitkeep

xcopy /E /I /Y vendor deploy_temp\laravel\vendor\ >nul
copy /Y artisan deploy_temp\laravel\ >nul
copy /Y composer.json deploy_temp\laravel\ >nul
copy /Y composer.lock deploy_temp\laravel\ >nul
copy /Y .env.production deploy_temp\laravel\.env >nul

echo.
echo [3/8] Copiando contenido de public...
xcopy /E /I /Y public\* deploy_temp\public_html\ >nul

echo.
echo [4/8] Creando archivo de instrucciones...
(
echo ==========================================
echo   INSTRUCCIONES DE INSTALACION
echo ==========================================
echo.
echo ESTRUCTURA DE ARCHIVOS:
echo.
echo 1. Contenido de carpeta "laravel" ^→ public_html/laravel/
echo 2. Contenido de carpeta "public_html" ^→ public_html/
echo.
echo PASOS:
echo.
echo 1. Conectate a File Manager de Hostinger
echo 2. Entra a public_html/
echo 3. Crea carpeta "laravel"
echo 4. Sube contenido de "laravel" a public_html/laravel/
echo 5. Sube contenido de "public_html" a public_html/
echo.
echo 6. IMPORTANTE: Edita public_html/index.php
echo    Cambia:
echo      require __DIR__.'/../vendor/autoload.php';
echo      $app = require_once __DIR__.'/../bootstrap/app.php';
echo.
echo    Por:
echo      require __DIR__.'/laravel/vendor/autoload.php';
echo      $app = require_once __DIR__.'/laravel/bootstrap/app.php';
echo.
echo 7. Establece permisos 755 a:
echo    - public_html/laravel/storage/ ^(recursivo^)
echo    - public_html/laravel/bootstrap/cache/
echo.
echo 8. Importa base de datos en phpMyAdmin de Hostinger
echo.
echo 9. Verifica en https://aaocoban.com
echo.
echo BASE DE DATOS:
echo - Nombre: u245906636_aaogt
echo - Usuario: u245906636_aaogt
echo - Password: 2905Andres@
echo.
echo ==========================================
) > deploy_temp\LEEME.txt

echo.
echo [5/8] Exportando base de datos...
mysqldump -u root orquidea1 > deploy_temp\orquideas_database.sql 2>nul
if %errorlevel% equ 0 (
    echo [OK] Base de datos exportada: orquideas_database.sql
) else (
    echo [ADVERTENCIA] No se pudo exportar con mysqldump
    echo              Exporta manualmente desde phpMyAdmin
    echo.
    echo INSTRUCCIONES EXPORTACION MANUAL: > deploy_temp\EXPORTAR_BASE_DATOS.txt
    echo 1. Abre http://localhost/phpmyadmin >> deploy_temp\EXPORTAR_BASE_DATOS.txt
    echo 2. Selecciona base de datos "orquidea1" >> deploy_temp\EXPORTAR_BASE_DATOS.txt
    echo 3. Click en "Exportar" >> deploy_temp\EXPORTAR_BASE_DATOS.txt
    echo 4. Metodo rapido, formato SQL >> deploy_temp\EXPORTAR_BASE_DATOS.txt
    echo 5. Guardar como "orquideas_database.sql" >> deploy_temp\EXPORTAR_BASE_DATOS.txt
    echo 6. Incluir ese archivo al subir a Hostinger >> deploy_temp\EXPORTAR_BASE_DATOS.txt
)

echo.
echo [6/8] Comprimiendo archivos...
if "%ZIPPER%"=="7z" (
    7z a -tzip hostinger_deploy.zip deploy_temp\* >nul
) else (
    powershell -command "Compress-Archive -Path 'deploy_temp\*' -DestinationPath 'hostinger_deploy.zip' -Force -CompressionLevel Optimal"
)

if exist hostinger_deploy.zip (
    echo [OK] Archivo creado: hostinger_deploy.zip
) else (
    echo [ERROR] No se pudo crear el archivo ZIP
    pause
    exit /b 1
)

echo.
echo [7/8] Limpiando archivos temporales...
rmdir /s /q deploy_temp

echo.
echo [8/8] Generando checksum MD5...
powershell -command "Get-FileHash hostinger_deploy.zip -Algorithm MD5 | Select-Object -ExpandProperty Hash" > hostinger_deploy.md5
echo [OK] MD5: hostinger_deploy.md5

echo.
echo [8/8] Generando checksum MD5...
echo ==========================================
echo   PAQUETE CREADO EXITOSAMENTE
echo ==========================================
echo.
echo Archivo: hostinger_deploy.zip
for %%I in (hostinger_deploy.zip) do echo Tamano: %%~zI bytes
echo.
echo CONTENIDO DEL ZIP:
echo   /laravel/          - Todo el proyecto Laravel
echo   /public_html/      - Archivos publicos
echo   /LEEME.txt         - Instrucciones de instalacion
echo   /orquideas_database.sql - Base de datos
echo.
echo PROXIMOS PASOS:
echo 1. Extrae hostinger_deploy.zip
echo 2. Sube carpeta "laravel" a public_html/laravel/
echo 3. Sube contenido de "public_html" a public_html/
echo 4. Edita index.php con las rutas correctas
echo 5. Importa orquideas_database.sql en phpMyAdmin
echo 6. Configura permisos 755 en storage/
echo.
echo Lee LEEME.txt para instrucciones detalladas
echo.
pause
