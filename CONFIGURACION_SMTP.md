# Configuración SMTP para Recuperación de Contraseña

## 📧 Pasos para Configurar Gmail SMTP

### 1. Habilitar Verificación en 2 Pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com
2. Selecciona **Seguridad** en el menú lateral
3. En "Cómo inicias sesión en Google", selecciona **Verificación en 2 pasos**
4. Sigue los pasos para habilitarla

### 2. Generar Contraseña de Aplicación

1. Regresa a **Seguridad** → **Verificación en 2 pasos**
2. Desplázate hasta abajo y selecciona **Contraseñas de aplicaciones**
3. Selecciona "Correo" como la app y "Windows Computer" como dispositivo
4. Haz clic en **Generar**
5. **Copia la contraseña de 16 caracteres** que aparece

### 3. Configurar el archivo .env

Edita el archivo `.env` en la raíz del proyecto:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@gmail.com
MAIL_PASSWORD=tu-contraseña-de-aplicacion-16-caracteres
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@orquideas.com"
MAIL_FROM_NAME="Sistema Orquídeas"
```

**⚠️ IMPORTANTE:**
- Usa la contraseña de aplicación (16 caracteres), NO tu contraseña normal de Gmail
- NO compartas esta contraseña
- Añade `.env` a tu `.gitignore` para no subirlo a Git

### 4. Reiniciar el Servidor

Después de cambiar el `.env`, reinicia el servidor:

```bash
php artisan config:clear
php artisan cache:clear
```

## 🔧 Otras Opciones de SMTP

### Mailtrap (Para Testing)

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=tu-username-mailtrap
MAIL_PASSWORD=tu-password-mailtrap
MAIL_ENCRYPTION=tls
```

### SendGrid

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=tu-api-key-sendgrid
MAIL_ENCRYPTION=tls
```

### Outlook/Hotmail

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-mail.outlook.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@outlook.com
MAIL_PASSWORD=tu-contraseña
MAIL_ENCRYPTION=tls
```

## 🧪 Probar el Envío de Correos

Ejecuta este comando en la terminal para probar:

```bash
php artisan tinker
```

Luego ejecuta:

```php
Mail::raw('Prueba de correo', function ($message) {
    $message->to('tu-email@ejemplo.com')
            ->subject('Test Email');
});
```

Si no aparece ningún error, la configuración es correcta.

## 🔐 Flujo de Recuperación de Contraseña

1. **Usuario solicita recuperación:**
   - Navega a `/recuperar-password`
   - Ingresa su correo electrónico
   - Sistema valida que el correo existe

2. **Sistema envía correo:**
   - Genera token único de recuperación
   - Guarda token en base de datos (válido por 1 hora)
   - Envía email con enlace de recuperación

3. **Usuario resetea contraseña:**
   - Hace clic en el enlace del correo
   - Ingresa nueva contraseña
   - Sistema valida token y actualiza contraseña
   - Envía correo de confirmación

4. **Usuario puede iniciar sesión:**
   - Usa la nueva contraseña

## 📁 Archivos Creados

- **Controlador:** `app/Http/Controllers/PasswordResetController.php`
- **Vistas Email:** 
  - `resources/views/emails/password-reset.blade.php`
  - `resources/views/emails/password-changed.blade.php`
- **Páginas Frontend:**
  - `resources/js/pages/auth/RecuperarPassword.tsx`
  - `resources/js/pages/auth/ResetPassword.tsx`
- **Rutas:** Agregadas en `routes/web.php`

## 🛡️ Seguridad

- Tokens expiran en 1 hora
- Tokens hasheados en base de datos
- Solo se puede usar un token una vez
- Se envía confirmación cuando cambia la contraseña
- Validación de correo antes de enviar

## ⚠️ Solución de Problemas

### Error: "Connection could not be established"
- Verifica que MAIL_HOST y MAIL_PORT sean correctos
- Revisa que la contraseña de aplicación esté bien copiada
- Asegúrate de que tu firewall no bloquee el puerto 587

### Error: "Invalid credentials"
- Usa la contraseña de aplicación, no la contraseña normal
- Verifica que la verificación en 2 pasos esté habilitada

### No llega el correo
- Revisa la carpeta de spam
- Verifica que el correo esté en la tabla `users`
- Revisa los logs en `storage/logs/laravel.log`

## 📝 Notas Adicionales

- La tabla `password_reset_tokens` se crea automáticamente con las migraciones de Laravel
- Los correos usan templates Blade con estilos inline
- Los mensajes de éxito/error usan SweetAlert2
