@echo off
echo ==========================================
echo   PAQUETE PARA HOSTINGER - VERSION SIMPLE
echo ==========================================
echo.
echo NOTA: Este script te guiara para preparar los archivos
echo       sin comprimirlos automaticamente.
echo.
echo Presiona cualquier tecla para continuar...
pause >nul

echo.
echo [INFO] Los archivos ya estan listos en tu proyecto.
echo.
echo ==========================================
echo   ARCHIVOS QUE DEBES SUBIR A HOSTINGER
echo ==========================================
echo.
echo CARPETAS Y ARCHIVOS A SUBIR:
echo.
echo 1. public_html/laravel/ (Subir estas carpetas aqui):
echo    - app\
echo    - bootstrap\
echo    - config\
echo    - database\
echo    - resources\
echo    - routes\
echo    - storage\  (con permisos 755)
echo    - vendor\
echo    - artisan
echo    - composer.json
echo    - composer.lock
echo    - .env (IMPORTANTE: Sube .env.production y renombralo a .env)
echo.
echo 2. public_html/ (Subir contenido de carpeta public):
echo    - public\index.php
echo    - public\.htaccess
echo    - public\robots.txt
echo    - public\build\ (toda la carpeta)
echo    - public\storage (si existe)
echo.
echo ==========================================
echo   EXPORTAR BASE DE DATOS
echo ==========================================
echo.
echo 1. Abre phpMyAdmin: http://localhost/phpmyadmin
echo 2. Selecciona base de datos: orquidea1
echo 3. Click en "Exportar"
echo 4. Metodo rapido, formato SQL
echo 5. Click "Continuar"
echo 6. Guarda como: orquideas_database.sql
echo.
echo ==========================================
echo   MODIFICAR index.php EN HOSTINGER
echo ==========================================
echo.
echo Despues de subir, edita public_html/index.php:
echo.
echo BUSCA estas lineas:
echo   require __DIR__.'/../vendor/autoload.php';
echo   $app = require_once __DIR__.'/../bootstrap/app.php';
echo.
echo CAMBIALAS por:
echo   require __DIR__.'/laravel/vendor/autoload.php';
echo   $app = require_once __DIR__.'/laravel/bootstrap/app.php';
echo.
echo ==========================================
echo   CREDENCIALES DE BASE DE DATOS
echo ==========================================
echo.
echo Dominio: aaocoban.com
echo Base de datos: u245906636_aaogt
echo Usuario: u245906636_aaogt
echo Password: 2905Andres@
echo.
echo Estas credenciales ya estan en .env.production
echo Solo renombra .env.production a .env al subir
echo.
echo ==========================================
echo   PERMISOS EN HOSTINGER
echo ==========================================
echo.
echo Establece permisos 755 en:
echo - public_html/laravel/storage/ (recursivo)
echo - public_html/laravel/bootstrap/cache/
echo.
echo ==========================================
echo   METODO ALTERNATIVO: ZIP MANUAL
echo ==========================================
echo.
echo Si prefieres crear un ZIP manualmente:
echo.
echo 1. Crea una carpeta llamada "hostinger_upload"
echo 2. Dentro crea dos subcarpetas:
echo    - laravel
echo    - public_html
echo.
echo 3. Copia a "laravel":
echo    app, bootstrap, config, database, resources,
echo    routes, storage, vendor, artisan, composer.*
echo    y .env.production (renombralo a .env)
echo.
echo 4. Copia a "public_html":
echo    Todo el contenido de la carpeta public/
echo.
echo 5. Comprime "hostinger_upload" con WinRAR o 7-Zip
echo.
echo 6. Sube y descomprime en Hostinger
echo.
echo ==========================================
echo.
echo Quieres abrir la guia completa de deploy? (S/N)
set /p respuesta="> "
if /i "%respuesta%"=="S" (
    start DEPLOY_INSTRUCTIONS.md
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul
