<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:test {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Enviar email de prueba para verificar configuración SMTP';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');

        $this->info('📧 Verificando configuración SMTP...');
        $this->newLine();

        // Mostrar configuración
        $this->line('Mailer: ' . config('mail.default'));
        $this->line('Host: ' . config('mail.mailers.smtp.host'));
        $this->line('Port: ' . config('mail.mailers.smtp.port'));
        $this->line('Usuario: ' . config('mail.mailers.smtp.username'));
        $this->line('Remitente: ' . config('mail.from.address'));
        $this->newLine();

        $this->info("📤 Enviando email de prueba a: {$email}");

        try {
            Mail::send('emails.password-reset', [
                'name' => 'Usuario de Prueba',
                'resetUrl' => url('/reset-password/token-de-prueba?email=' . urlencode($email)),
                'token' => 'token-de-prueba-12345'
            ], function ($message) use ($email) {
                $message->to($email);
                $message->subject('✅ Prueba SMTP - Sistema Orquídeas');
            });

            $this->newLine();
            $this->info('✅ Email enviado exitosamente!');
            $this->line('📬 Revisa tu bandeja de entrada y carpeta de spam');
            $this->newLine();

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->newLine();
            $this->error('❌ Error al enviar email:');
            $this->error($e->getMessage());
            $this->newLine();

            $this->warn('📝 Verifica lo siguiente:');
            $this->line('1. Credenciales SMTP correctas en .env');
            $this->line('2. Contraseña de aplicación (no tu contraseña normal de Gmail)');
            $this->line('3. Verificación en 2 pasos habilitada (para Gmail)');
            $this->line('4. Puerto 587 no bloqueado por firewall');
            $this->line('5. Revisa storage/logs/laravel.log para más detalles');
            $this->newLine();

            return Command::FAILURE;
        }
    }
}
