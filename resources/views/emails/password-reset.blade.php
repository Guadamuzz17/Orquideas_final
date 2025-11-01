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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            margin: -30px -30px 20px -30px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #666;
            font-size: 12px;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
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

        <h2>Hola, {{ $name }}</h2>

        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>

        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

        <div style="text-align: center;">
            <a href="{{ $resetUrl }}" class="button">Restablecer Contraseña</a>
        </div>

        <div class="warning">
            <strong>⚠️ Importante:</strong>
            <ul>
                <li>Este enlace expirará en 1 hora</li>
                <li>Si no solicitaste este cambio, puedes ignorar este correo</li>
                <li>Tu contraseña actual seguirá siendo válida hasta que completes el proceso</li>
            </ul>
        </div>

        <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
        <p style="word-break: break-all; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
            {{ $resetUrl }}
        </p>

        <div class="footer">
            <p><strong>Sistema de Gestión de Orquídeas</strong></p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
    </div>
</body>
</html>
