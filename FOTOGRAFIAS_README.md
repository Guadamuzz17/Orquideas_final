# Módulo de Fotografías - API Documentación

## Endpoints Disponibles

### 1. API Pública (Sin Autenticación)

#### GET /api/fotos
Obtiene todas las fotografías disponibles.

**Parámetros opcionales:**
- `fecha` (date): Filtrar por fecha específica (formato: YYYY-MM-DD)
- `buscar` (string): Buscar en título o descripción

**Ejemplos:**
```bash
# Obtener todas las fotos
curl http://localhost:8000/api/fotos

# Filtrar por fecha
curl http://localhost:8000/api/fotos?fecha=2025-10-26

# Buscar por término
curl http://localhost:8000/api/fotos?buscar=festival

# Combinar filtros
curl http://localhost:8000/api/fotos?fecha=2025-10-26&buscar=orquideas
```

**Respuesta JSON:**
```json
[
  {
    "id": 1,
    "titulo": "Festival de Orquídeas 2025",
    "descripcion": "Celebración anual del festival de orquídeas en el parque central",
    "fecha_evento": "2025-10-16",
    "url_imagen": "http://localhost:8000/storage/fotos/festival-2025.jpg"
  },
  {
    "id": 2,
    "titulo": "Exposición de Especies Raras",
    "descripcion": "Muestra especial de orquídeas raras y en peligro de extinción",
    "fecha_evento": "2025-10-21",
    "url_imagen": "http://localhost:8000/storage/fotos/especies-raras.jpg"
  }
]
```

### 2. Panel Administrativo (Con Autenticación)

#### Dashboard - Gestión de Fotografías
- **URL:** `/fotos`
- **Método:** GET
- **Descripción:** Vista principal con listado paginado

#### Subir Nueva Fotografía
- **URL:** `/fotos/create`
- **Método:** GET/POST
- **Descripción:** Formulario para subir nuevas fotos

#### Ver Fotografía
- **URL:** `/fotos/{id}`
- **Método:** GET
- **Descripción:** Vista detallada de una fotografía

#### Editar Fotografía
- **URL:** `/fotos/{id}/edit`
- **Método:** GET/PUT
- **Descripción:** Formulario para editar información

#### Eliminar Fotografía
- **URL:** `/fotos/{id}`
- **Método:** DELETE
- **Descripción:** Eliminar fotografía y archivo

## Validaciones

### Subida de Archivos
- **Tipos permitidos:** JPG, JPEG, PNG
- **Tamaño máximo:** 5MB
- **Campos requeridos:** titulo, imagen
- **Campos opcionales:** descripcion, fecha_evento

### Campos de Base de Datos
- `titulo`: VARCHAR(255) - Requerido
- `descripcion`: TEXT - Opcional
- `fecha_evento`: DATE - Opcional
- `ruta_imagen`: VARCHAR(255) - Requerido

## Estructura de Archivos

```
storage/
├── app/
│   └── public/
│       └── fotos/           # Imágenes almacenadas
│           ├── uuid1.jpg
│           ├── uuid2.png
│           └── ...
public/
└── storage/
    └── fotos/               # Enlace simbólico público
        ├── uuid1.jpg
        ├── uuid2.png
        └── ...
```

## Uso en Página Web Externa

### Ejemplo HTML + JavaScript
```html
<!DOCTYPE html>
<html>
<head>
    <title>Galería de Eventos - Orquídeas Guatemala</title>
    <style>
        .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .photo { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .photo img { width: 100%; height: 200px; object-fit: cover; }
        .photo-info { padding: 15px; }
        .photo-title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .photo-date { color: #666; font-size: 14px; margin-bottom: 10px; }
        .photo-description { color: #333; line-height: 1.4; }
    </style>
</head>
<body>
    <h1>Galería de Eventos de Orquídeas</h1>
    <div id="gallery" class="gallery"></div>

    <script>
        // Cargar fotos desde la API
        fetch('http://localhost:8000/api/fotos')
            .then(response => response.json())
            .then(fotos => {
                const gallery = document.getElementById('gallery');
                
                fotos.forEach(foto => {
                    const photoElement = document.createElement('div');
                    photoElement.className = 'photo';
                    photoElement.innerHTML = `
                        <img src="${foto.url_imagen}" alt="${foto.titulo}" loading="lazy">
                        <div class="photo-info">
                            <div class="photo-title">${foto.titulo}</div>
                            <div class="photo-date">${foto.fecha_evento || 'Sin fecha'}</div>
                            <div class="photo-description">${foto.descripcion || ''}</div>
                        </div>
                    `;
                    gallery.appendChild(photoElement);
                });
            })
            .catch(error => {
                console.error('Error al cargar fotos:', error);
            });
    </script>
</body>
</html>
```

### Ejemplo con Filtros
```javascript
// Buscar fotos de eventos recientes
fetch('http://localhost:8000/api/fotos?fecha=2025-10-26')
    .then(response => response.json())
    .then(fotos => console.log('Fotos del día:', fotos));

// Buscar fotos por término
fetch('http://localhost:8000/api/fotos?buscar=festival')
    .then(response => response.json())
    .then(fotos => console.log('Fotos de festivales:', fotos));
```

## Características Implementadas

✅ **Dashboard Administrativo Completo**
- Sidebar con opción "Fotografías" e ícono de cámara
- Vista de listado con paginación
- Subida de archivos con vista previa
- Edición de información
- Eliminación segura con confirmación

✅ **API Pública Sin Autenticación**
- Endpoint `/api/fotos` accesible sin login
- Filtros por fecha y búsqueda por término
- Respuesta JSON optimizada

✅ **Gestión de Archivos**
- Almacenamiento en `storage/app/public/fotos`
- Enlaces simbólicos configurados
- Validación de tipos y tamaños
- Limpieza automática al eliminar

✅ **Interfaz Moderna**
- Componentes UI consistentes con el resto del sistema
- Vista previa de imágenes
- Formularios responsivos
- Alertas de confirmación con SweetAlert2

El módulo está completamente funcional y listo para usar. Los usuarios pueden subir fotos desde el dashboard y consumir la API pública para mostrar las imágenes en sitios web externos.
