<?php

use Illuminate\Support\Facades\Mail;

/**
 * Script de prueba para verificar configuración SMTP
 *
 * Para ejecutar:
 * php artisan tinker
 *
 * Luego pega este código en tinker
 */

// Prueba 1: Verificar configuración
echo "📧 Configuración SMTP:\n";
echo "Mailer: " . config('mail.default') . "\n";
echo "Host: " . config('mail.mailers.smtp.host') . "\n";
echo "Port: " . config('mail.mailers.smtp.port') . "\n";
echo "Username: " . config('mail.mailers.smtp.username') . "\n";
echo "From: " . config('mail.from.address') . "\n\n";

// Prueba 2: Enviar email de prueba
echo "📤 Enviando email de prueba...\n";

$destinatario = 'tu-email@ejemplo.com'; // CAMBIAR POR TU EMAIL

try {
    Mail::raw('Este es un email de prueba del Sistema de Orquídeas.', function ($message) use ($destinatario) {
        $message->to($destinatario)
                ->subject('✅ Prueba SMTP - Sistema Orquídeas');
    });

    echo "✅ Email enviado exitosamente a: $destinatario\n";
    echo "📬 Revisa tu bandeja de entrada (y spam)\n";
} catch (Exception $e) {
    echo "❌ Error al enviar email:\n";
    echo $e->getMessage() . "\n";
    echo "\n📝 Verifica:\n";
    echo "1. Credenciales SMTP en .env\n";
    echo "2. Contraseña de aplicación (no la normal)\n";
    echo "3. Verificación en 2 pasos habilitada (Gmail)\n";
    echo "4. Puerto 587 no bloqueado por firewall\n";
}
