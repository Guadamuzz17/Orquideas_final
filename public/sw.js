const CACHE_NAME = 'orquideas-pwa-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
    OFFLINE_URL,
    '/manifest.json',
    '/favicon.ico',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/images/Logo-fotor-bg-remover-2024090519443.png',
    '/images/umg2.png',
    '/images/SISTEMAS_UMG-removebg-preview.png',
];

// Instalación: precachear recursos mínimos esenciales
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activación: limpiar cachés obsoletas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia de Fetch
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Solo interceptar peticiones GET
    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    // Evitar interceptar extensiones de navegador o peticiones externas que no sean de este origen
    if (url.origin !== self.location.origin) {
        return;
    }

    // 1. Peticiones de Navegación (HTML de páginas): Network First con fallback a offline.html
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(async () => {
                const cache = await caches.open(CACHE_NAME);
                const cachedResponse = await cache.match(request);
                if (cachedResponse) {
                    return cachedResponse;
                }
                const offlinePage = await cache.match(OFFLINE_URL);
                return offlinePage || new Response('Offline', { status: 503, statusText: 'Offline' });
            })
        );
        return;
    }

    // 2. Archivos estáticos inmutables de Vite (/build/assets/*, fuentes, iconos)
    const isStaticAsset = url.pathname.startsWith('/build/') ||
                          url.pathname.startsWith('/icons/') ||
                          url.pathname.startsWith('/images/') ||
                          url.pathname.endsWith('.woff2') ||
                          url.pathname.endsWith('.svg') ||
                          url.pathname.endsWith('.png');

    if (isStaticAsset) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Stale-while-revalidate para actualizar en background
                    fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
                        }
                    }).catch(() => {});
                    return cachedResponse;
                }

                return fetch(request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    return networkResponse;
                }).catch(() => {
                    // Si falla una imagen estática, retornar nada o dejar fallar
                    return new Response('', { status: 408, statusText: 'Request timed out' });
                });
            })
        );
        return;
    }

    // 3. Resto de peticiones (APIs, Inertia JSON): Network-only con fallback
    event.respondWith(
        fetch(request).catch(async () => {
            const cachedResponse = await caches.match(request);
            if (cachedResponse) {
                return cachedResponse;
            }
            return new Response(JSON.stringify({ error: 'offline', message: 'Sin conexión a internet' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 503
            });
        })
    );
});

