<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        {{-- PWA Primary Meta Tags --}}
        <meta name="application-name" content="Orquídeas AAO">
        <meta name="apple-mobile-web-app-title" content="Orquídeas AAO">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="format-detection" content="telephone=no">

        {{-- Theme Color for PWA and Mobile Browsers --}}
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
        <meta name="theme-color" content="#0b0f19" media="(prefers-color-scheme: dark)">

        {{-- Web App Manifest --}}
        <link rel="manifest" href="/manifest.json">

        {{-- Immediate theme application to completely prevent flash of wrong theme --}}
        <script>
            (function() {
                try {
                    const appearance = localStorage.getItem('appearance') || '{{ $appearance ?? "system" }}';
                    if (appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                } catch (e) {}
            })();
        </script>

        {{-- Inline background color to match theme --}}
        <style>
            html {
                background-color: #ffffff;
            }

            html.dark {
                background-color: #0b0f19;
            }
        </style>

        <title inertia>{{ config('app.name', 'Asociación de Orquideología') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/icons/icon-192x192.png" type="image/png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-background text-foreground selection:bg-purple-500 selection:text-white">
        @inertia

        {{-- Service Worker Registration for PWA --}}
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                        .then(function(reg) {
                            console.log('PWA Service Worker registrado con éxito:', reg.scope);
                        })
                        .catch(function(err) {
                            console.warn('Error al registrar Service Worker:', err);
                        });
                });
            }
        </script>
    </body>
</html>
