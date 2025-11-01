<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            border: 1px solid #e0e0e0;
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            margin: -30px -30px 20px -30px;
        }
        .success-icon {
            font-size: 48px;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 12px;
        }
        .info-box {
            background-color: #e0f2fe;
            border-left: 4px solid #0284c7;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌺 Sistema de Orquídeas</h1>
        </div>

        <div class="success-icon">
            ✅
        </div>

        <h2 style="text-align: center; color: #10b981;">Contraseña Actualizada</h2>

        <p>Hola, <strong>{{ $name }}</strong></p>

        <p>Te confirmamos que tu contraseña ha sido actualizada exitosamente.</p>

        <div class="info-box">
            <strong>ℹ️ Información importante:</strong>
            <ul>
                <li>Ya puedes iniciar sesión con tu nueva contraseña</li>
                <li>Si no realizaste este cambio, contacta al administrador inmediatamente</li>
                <li>Te recomendamos usar una contraseña segura y única</li>
            </ul>
        </div>

        <p style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/login') }}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Ir a Iniciar Sesión
            </a>
        </p>

        <div class="footer">
            <p><strong>Sistema de Gestión de Orquídeas</strong></p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
