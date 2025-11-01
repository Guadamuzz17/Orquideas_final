<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class PasswordResetController extends Controller
{
    /**
     * Mostrar formulario de solicitud de recuperación
     */
    public function showRequestForm()
    {
        return Inertia::render('auth/RecuperarPassword');
    }

    /**
     * Enviar email con token de recuperación
     */
    public function sendResetEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ], [
            'email.exists' => 'No existe ningún usuario con este correo electrónico.'
        ]);

        try {
            // Generar token único
            $token = Str::random(64);

            // Guardar token en base de datos
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'email' => $request->email,
                    'token' => Hash::make($token),
                    'created_at' => Carbon::now()
                ]
            );

            // Obtener usuario
            $user = User::where('email', $request->email)->first();

            // Generar URL de reseteo
            $resetUrl = url("/reset-password/{$token}?email=" . urlencode($request->email));

            // Enviar email
            Mail::send('emails.password-reset', [
                'name' => $user->name,
                'resetUrl' => $resetUrl,
                'token' => $token
            ], function ($message) use ($request) {
                $message->to($request->email);
                $message->subject('Recuperación de Contraseña - Sistema Orquídeas');
            });

            return back()->with('success', 'Se ha enviado un enlace de recuperación a tu correo electrónico.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al enviar el correo: ' . $e->getMessage());
        }
    }

    /**
     * Mostrar formulario para resetear contraseña
     */
    public function showResetForm(Request $request, $token)
    {
        return Inertia::render('auth/ResetPassword', [
            'token' => $token,
            'email' => $request->email
        ]);
    }

    /**
     * Resetear la contraseña
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        try {
            // Verificar que el token existe y no ha expirado (1 hora)
            $tokenData = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$tokenData) {
                return back()->with('error', 'Token inválido o expirado.');
            }

            // Verificar si el token ha expirado (1 hora)
            if (Carbon::parse($tokenData->created_at)->addHour()->isPast()) {
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                return back()->with('error', 'El token ha expirado. Solicita uno nuevo.');
            }

            // Verificar que el token coincide
            if (!Hash::check($request->token, $tokenData->token)) {
                return back()->with('error', 'Token inválido.');
            }

            // Actualizar contraseña
            $user = User::where('email', $request->email)->first();
            $user->password = Hash::make($request->password);
            $user->save();

            // Eliminar token usado
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            // Enviar confirmación por email
            Mail::send('emails.password-changed', [
                'name' => $user->name
            ], function ($message) use ($request) {
                $message->to($request->email);
                $message->subject('Contraseña Actualizada - Sistema Orquídeas');
            });

            return redirect()->route('login')
                ->with('success', 'Contraseña actualizada exitosamente. Ya puedes iniciar sesión.');
        } catch (\Exception $e) {
            return back()->with('error', 'Error al actualizar la contraseña: ' . $e->getMessage());
        }
    }
}
