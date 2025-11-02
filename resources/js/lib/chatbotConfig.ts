export type Action = { label: string; href: string };
export type QA = { question: string; answer: string; actions?: Action[] };
export type ModuleQA = { title: string; qas: QA[] };

export const chatbotConfig: Record<string, ModuleQA> = {
  dashboard: {
    title: "Panel de control",
    qas: [
      { question: "¿Qué veo en el panel?", answer: "Un resumen de métricas: total de participantes, orquídeas registradas, inscripciones activas y ganadores del evento actual." },
      { question: "¿Cómo navegar a un módulo?", answer: "Usa el menú lateral izquierdo o haz clic en las tarjetas de acceso rápido del panel." },
      { question: "¿Cómo cambiar de evento?", answer: "En la parte superior derecha, selecciona el evento activo del selector de eventos." },
      { question: "¿Qué significan los números del dashboard?", answer: "Muestran estadísticas en tiempo real del evento seleccionado: participantes inscritos, plantas registradas, inscripciones completadas y premios otorgados." }
    ]
  },
  participantes: {
    title: "Participantes",
    qas: [
      { question: "¿Cómo registrar un participante?", answer: "Ve a Participantes > Nuevo, completa nombre, teléfono, dirección, departamento, municipio y ASO (Asociación). Luego guarda.", actions: [
        { label: "Nuevo participante", href: "/participantes/create" }
      ] },
      { question: "¿Puedo reciclar datos de eventos anteriores?", answer: "Sí, el sistema tiene una función de búsqueda inteligente. Al registrar un participante, escribe su nombre, DPI o email y el sistema mostrará coincidencias de eventos previos. Puedes seleccionar uno y sus datos se autocompletarán, ahorrando tiempo en la inscripción." },
      { question: "¿Cómo funciona el reciclaje de datos?", answer: "Cuando buscas un participante existente, el sistema te preguntará si deseas reciclar sus datos. Al aceptar, se copia automáticamente su información de contacto, dirección y plantas registradas al nuevo evento, sin modificar los registros originales." },
      { question: "¿Cómo editar un participante?", answer: "En el listado de participantes, haz clic en el ícono de editar (lápiz) junto al nombre del participante." },
      { question: "¿Qué es ASO?", answer: "ASO es la Asociación a la que pertenece el participante. Debes seleccionar una de la lista: AAO, AGOA, AOSAC, GOBAM o INBIO." },
      { question: "¿Puedo ver todas las orquídeas de un participante?", answer: "Sí, haz clic en Ver detalles del participante para ver todas sus plantas registradas." },
      { question: "¿Cómo buscar un participante?", answer: "Usa la barra de búsqueda en la parte superior del listado. Puedes buscar por nombre, teléfono, DPI, correo electrónico o municipio. El sistema también sugiere participantes de eventos anteriores." },
      { question: "¿Puedo eliminar un participante?", answer: "Solo si no tiene orquídeas registradas. Si tiene plantas asociadas, primero debes reasignarlas o eliminarlas." },
      { question: "¿Qué pasa si no encuentro al participante en búsqueda?", answer: "Si no hay coincidencias, verás el mensaje 'No se encontraron registros previos'. Esto significa que es un participante nuevo y deberás completar todos los datos manualmente." }
    ]
  },
  orquideas: {
    title: "Orquídeas",
    qas: [
      { question: "¿Cómo agregar una orquídea?", answer: "En Orquídeas > Nueva, ingresa nombre científico, origen (Nativa/Híbrida), grupo, clase, cantidad y participante propietario. Opcionalmente sube una foto.", actions: [
        { label: "Nueva orquídea", href: "/orquideas/create" }
      ] },
      { question: "¿Cómo asociar a un participante?", answer: "En el formulario de orquídea, selecciona el participante en el campo 'Participante'. Puedes buscar por nombre." },
      { question: "¿Qué son grupos y clases?", answer: "Los grupos categorizan las orquídeas por género (ej: Cattleya, Phalaenopsis). Las clases son subcategorías específicas dentro de cada grupo." },
      { question: "¿Cómo filtrar clases por grupo?", answer: "Al seleccionar un grupo, el selector de clases se actualiza automáticamente mostrando solo las clases correspondientes a ese grupo." },
      { question: "¿Qué tipos de origen existen?", answer: "Hay 2 orígenes: Nativa (especie guatemalteca), Híbrida (cruce de especies)." },
      { question: "¿Puedo subir foto después?", answer: "Sí, edita la orquídea y agrega la foto en el formulario de edición." },
      { question: "¿Cómo ver el autocompletado de nombres?", answer: "Al escribir en el campo 'Nombre de la Planta', aparecerán sugerencias de nombres ya registrados para evitar duplicados." }
    ]
  },
  inscripcion: {
    title: "Inscripción",
    qas: [
      { question: "¿Cómo crear una inscripción?", answer: "Desde Inscripción > Nueva, selecciona el participante, luego elige las orquídeas a inscribir. Se generará un correlativo único automáticamente.", actions: [
        { label: "Nueva inscripción", href: "/inscripcion/create" }
      ] },
      { question: "¿El sistema recuerda plantas de eventos anteriores?", answer: "Sí, al seleccionar un participante reciclado, sus plantas registradas en eventos previos aparecerán como sugerencias. Puedes marcarlas para incluirlas en el nuevo evento o agregar plantas nuevas." },
      { question: "¿Cómo ver el estado de inscripción?", answer: "En el listado de inscripciones verás el correlativo, participante, planta y fecha de registro." },
      { question: "¿Qué es el correlativo?", answer: "Es un número único secuencial que identifica cada inscripción en el evento (ej: 001, 002, 003...). Se genera automáticamente y no se puede modificar." },
      { question: "¿Puedo inscribir múltiples plantas a la vez?", answer: "Sí, al crear inscripción puedes agregar varias orquídeas del mismo participante presionando el botón '+' para añadir más plantas." },
      { question: "¿Qué pasa si una orquídea ya está inscrita?", answer: "El sistema validará y no permitirá inscribir la misma planta dos veces en el mismo evento." },
      { question: "¿Cómo verificar el último correlativo usado?", answer: "El sistema muestra automáticamente el siguiente número disponible al crear una nueva inscripción." },
      { question: "¿Puedo editar una inscripción después de crearla?", answer: "Puedes editar ciertos datos, pero el correlativo y la fecha de registro no se pueden cambiar una vez creada la inscripción." }
    ]
  },
  grupos: {
    title: "Grupos",
    qas: [
      { question: "¿Cómo crear un grupo?", answer: "En Grupos > Nuevo, ingresa el nombre del género de orquídea (ej: Cattleya, Phalaenopsis, Dendrobium) y guarda.", actions: [
        { label: "Nuevo grupo", href: "/grupos/create" }
      ] },
      { question: "¿Cómo asignar orquídeas a grupos?", answer: "No se asignan directamente. Al registrar una orquídea, seleccionas el grupo correspondiente a su género." },
      { question: "¿Qué grupos son más comunes?", answer: "Los grupos principales son: Cattleya, Phalaenopsis, Oncidium, Dendrobium, Epidendrum, Lycaste, Miltonia, Paphiopedilum, entre otros." },
      { question: "¿Puedo editar un grupo?", answer: "Sí, pero ten cuidado: cambiar el nombre afectará todas las orquídeas asociadas a ese grupo." }
    ]
  },
  clases: {
    title: "Clases",
    qas: [
      { question: "¿Cómo administrar clases?", answer: "Crea, edita o elimina clases desde el listado de Clases. Cada clase debe pertenecer a un grupo específico.", actions: [
        { label: "Nueva clase", href: "/clases/create" }
      ] },
      { question: "¿Cómo relacionar clases con grupos?", answer: "Al crear/editar una clase, selecciona el grupo al que pertenece en el campo 'Grupo'." },
      { question: "¿Qué define una clase?", answer: "Las clases son subcategorías que especifican características como color, tamaño, híbridos vs especies naturales, etc." },
      { question: "¿Cuántas clases puede tener un grupo?", answer: "Un grupo puede tener múltiples clases. Por ejemplo, Cattleya puede tener clases para diferentes colores o tipos." }
    ]
  },
  listones: {
    title: "Listones",
    qas: [
      { question: "¿Cómo crear listones?", answer: "En Listones > Nuevo, selecciona la inscripción ganadora y el tipo de premio (1er, 2do, 3er lugar o Mención Honorífica).", actions: [
        { label: "Nuevo listón", href: "/listones/create" }
      ] },
      { question: "¿Cómo otorgar un listón?", answer: "Busca la inscripción por correlativo o nombre de planta, selecciónala y asigna el tipo de premio correspondiente." },
      { question: "¿Qué tipos de premios hay?", answer: "Hay 4 tipos: 1er Lugar, 2do Lugar, 3er Lugar y Mención Honorífica." },
      { question: "¿Puedo cambiar un listón ya asignado?", answer: "Sí, edita el registro del listón y cambia el tipo de premio o la inscripción." },
      { question: "¿Cómo generar reporte de listones?", answer: "Ve a Reportes > Listones para exportar en PDF o Excel todos los premios otorgados.", actions: [
        { label: "Ver reportes", href: "/reportes/listones" }
      ] },
      { question: "¿Cómo ver el listado simple de listones?", answer: "Usa la vista de Listones Simple para un reporte rápido sin filtros avanzados, ideal para impresión o consulta rápida.", actions: [
        { label: "Listones simple", href: "/listones/simple" }
      ] }
    ]
  },
  tipo_premios: {
    title: "Tipos de Premios",
    qas: [
      { question: "¿Qué son los tipos de premios?", answer: "Son las categorías de reconocimiento que se pueden otorgar a las orquídeas: 1er Lugar, 2do Lugar, 3er Lugar, Mención Honorífica, Premio Especial, etc." },
      { question: "¿Cómo crear un nuevo tipo de premio?", answer: "Ve a Tipos de Premios > Nuevo, ingresa el nombre del premio (ej: 'Premio Mejor Aroma'), asigna un color distintivo y opcionalmente una descripción.", actions: [
        { label: "Nuevo tipo de premio", href: "/tipo-premios/create" }
      ] },
      { question: "¿Puedo personalizar los colores de los premios?", answer: "Sí, cada tipo de premio tiene un código de color (ej: dorado para 1er lugar, plateado para 2do) que se usa en reportes y certificados para identificación visual." },
      { question: "¿Cómo editar tipos de premios existentes?", answer: "En el listado de Tipos de Premios, haz clic en editar para modificar nombre, descripción o color. Los cambios se reflejan en todos los reportes." },
      { question: "¿Puedo eliminar un tipo de premio?", answer: "Solo si no ha sido asignado a ningún ganador. Si ya se usó, debes mantenerlo para preservar el historial de premiaciones." },
      { question: "¿Cuántos tipos de premios puedo crear?", answer: "No hay límite. Puedes crear premios especiales personalizados para categorías únicas como 'Mejor Especie Nativa', 'Orquídea Más Grande', etc." }
    ]
  },
  formatos: {
    title: "Formatos y Documentos",
    qas: [
      { question: "¿Qué formatos están disponibles?", answer: "El sistema ofrece 3 formatos principales: Formato de Inscripción (para participantes), Formato de Juzgamiento (para jueces) y Listado de Clases en PDF (catálogo completo)." },
      { question: "¿Cómo descargar el formato de inscripción?", answer: "Ve a Formatos > Formato de Inscripción y haz clic en Descargar PDF. Este documento se puede imprimir para inscripciones físicas o enviar a participantes.", actions: [
        { label: "Ver formatos", href: "/participantes/formato" }
      ] },
      { question: "¿Para qué sirve el formato de juzgamiento?", answer: "Es una planilla impresa que los jueces usan durante la exposición para calificar las orquídeas. Incluye criterios de evaluación, espacios para puntajes y observaciones." },
      { question: "¿Cómo generar el listado de clases en PDF?", answer: "Desde Formatos > Listado de Clases, selecciona el evento y genera un PDF con todas las clases organizadas por grupo, ideal para catálogos del evento." },
      { question: "¿Los formatos se actualizan automáticamente?", answer: "Sí, al generar un formato, el sistema incluye automáticamente todos los datos actuales del evento seleccionado (participantes, clases, premios)." },
      { question: "¿Puedo personalizar los formatos?", answer: "Los formatos tienen un diseño estándar profesional. Para personalizaciones específicas, contacta al administrador del sistema." },
      { question: "¿En qué formato se descargan los documentos?", answer: "Todos los documentos se generan en formato PDF de alta calidad, listos para imprimir o compartir digitalmente." }
    ]
  },
  trofeos: {
    title: "Trofeos",
    qas: [
      { question: "¿Cómo registrar trofeos?", answer: "En Trofeos > Nuevo, ingresa el nombre del trofeo, descripción y criterios de selección.", actions: [
        { label: "Nuevo trofeo", href: "/trofeos/create" }
      ] },
      { question: "¿Cómo asignar trofeos?", answer: "Desde el formulario de trofeos, busca y selecciona la inscripción ganadora por correlativo o nombre de planta." },
      { question: "¿Cuál es la diferencia entre trofeos y listones?", answer: "Los trofeos son premios especiales para categorías únicas, mientras que los listones son para lugares (1°, 2°, 3°, mención)." }
    ]
  },
  ganadores: {
    title: "Ganadores",
    qas: [
      { question: "¿Cómo ver ganadores?", answer: "En Ganadores verás un listado completo de todas las orquídeas premiadas con listones y trofeos.", actions: [
        { label: "Ver ganadores", href: "/ganadores" }
      ] },
      { question: "¿Cómo registrar un ganador?", answer: "Los ganadores se registran automáticamente al asignar listones o trofeos a las inscripciones.", actions: [
        { label: "Nuevo ganador", href: "/ganadores/create" }
      ] },
      { question: "¿Puedo filtrar ganadores por tipo de premio?", answer: "Sí, usa los filtros en la parte superior para ver solo 1er lugar, 2do lugar, 3er lugar o menciones." },
      { question: "¿Cómo generar certificados de ganadores?", answer: "Desde el detalle del ganador, usa la opción 'Generar certificado' para crear un PDF oficial." }
    ]
  },
  reportes: {
    title: "Reportes",
    qas: [
      { question: "¿Cómo generar un reporte?", answer: "Ve a Reportes, selecciona el tipo (Inscripciones, Plantas por Clase, Ganadores o Participantes), define filtros y haz clic en Generar PDF o Excel.", actions: [
        { label: "Ver reportes", href: "/reportes" }
      ] },
      { question: "¿Qué reportes están disponibles?", answer: "Hay 4 reportes: Listado de Inscripciones, Plantas por Clases, Orquídeas Ganadoras, y Participantes con sus Orquídeas." },
      { question: "¿Puedo exportar a Excel?", answer: "Sí, todos los reportes tienen opción de descarga en formato Excel (.xlsx) además de PDF." },
      { question: "¿Los reportes se filtran por evento?", answer: "Sí, automáticamente se generan para el evento actualmente seleccionado." },
      { question: "¿Cómo descargar el reporte de listones?", answer: "Ve a Reportes > Listones y selecciona Excel para análisis de datos o PDF para impresión.", actions: [
        { label: "Reportes de listones", href: "/reportes/listones" }
      ] }
    ]
  },
  registro_orquideas: {
    title: "Registro de Orquídeas",
    qas: [
      { question: "¿Cómo registrar orquídeas rápidamente?", answer: "Usa el formulario de registro con autocompletado de nombres científicos para evitar errores tipográficos." },
      { question: "¿Cómo funciona el autocompletado?", answer: "Al escribir en 'Nombre de la Planta', el sistema sugiere nombres ya registrados para mantener consistencia." },
      { question: "¿Puedo subir foto al registrar?", answer: "Sí, arrastra la imagen o haz clic en el área de carga. Formatos: JPG, PNG. Tamaño máximo: 5MB." },
      { question: "¿Qué pasa si selecciono un grupo?", answer: "Al seleccionar un grupo, las clases se filtran automáticamente mostrando solo las compatibles." }
    ]
  },
  fotos: {
    title: "Fotos",
    qas: [
      { question: "¿Cómo subir fotos del evento?", answer: "Ve a Fotos > Subir, arrastra las imágenes o selecciónalas desde tu dispositivo, agrega descripción y confirma.", actions: [
        { label: "Subir foto", href: "/fotos/create" }
      ] },
      { question: "¿Qué formatos se aceptan?", answer: "Se aceptan JPG, JPEG y PNG con tamaño máximo de 5MB por imagen." },
      { question: "¿Las fotos son públicas?", answer: "Sí, hay una galería pública donde los visitantes pueden ver las fotos del evento sin necesidad de iniciar sesión." },
      { question: "¿Puedo editar o eliminar fotos?", answer: "Sí, desde el panel de administración puedes editar descripciones o eliminar fotos si tienes permisos de administrador." },
      { question: "¿Cómo organizar las fotos?", answer: "Las fotos se muestran cronológicamente. Puedes agregar títulos y descripciones para organizarlas mejor." }
    ]
  },
  eventos: {
    title: "Eventos",
    qas: [
      { question: "¿Cómo crear un nuevo evento?", answer: "Ve a Eventos > Nuevo, ingresa nombre, fecha de inicio y fin, ubicación y descripción del evento.", actions: [
        { label: "Nuevo evento", href: "/eventos/create" }
      ] },
      { question: "¿Cómo cambiar de evento activo?", answer: "En el selector de eventos de la barra superior, haz clic y selecciona el evento que deseas activar. Todos los registros y consultas se filtrarán automáticamente por ese evento." },
      { question: "¿Puedo tener varios eventos simultáneos?", answer: "Sí, puedes tener múltiples eventos registrados, pero solo uno puede estar activo a la vez para registros e inscripciones." },
      { question: "¿Los datos se separan por evento?", answer: "Sí, todos los participantes, inscripciones y ganadores se asocian al evento correspondiente. Un mismo participante puede tener registros en diferentes eventos sin duplicarse." },
      { question: "¿Cómo cerrar un evento?", answer: "En la lista de eventos, selecciona 'Cerrar evento'. Esto finaliza las inscripciones pero conserva todos los datos para consultas y reportes futuros." },
      { question: "¿Qué pasa con los participantes al crear un nuevo evento?", answer: "Los participantes no se duplican. El sistema permite reciclar participantes existentes de eventos anteriores, copiando automáticamente sus datos para el nuevo evento sin crear registros duplicados." },
      { question: "¿Puedo ver participantes de eventos pasados?", answer: "Sí, en la búsqueda de participantes puedes encontrar registros de cualquier evento. El sistema indica en qué evento(s) ha participado cada persona." }
    ]
  },
  users: {
    title: "Usuarios",
    qas: [
      { question: "¿Cómo crear un usuario?", answer: "Ve a Usuarios > Nuevo, ingresa nombre, email, contraseña y asigna un rol (Admin General o Digitador).", actions: [
        { label: "Nuevo usuario", href: "/users/create" }
      ] },
      { question: "¿Qué roles existen?", answer: "Hay 2 roles: Admin General (acceso completo) y Digitador (solo registro de datos sin eliminar)." },
      { question: "¿Cómo cambiar la contraseña de un usuario?", answer: "En la vista de usuario, usa el botón 'Restablecer contraseña' para generar una nueva." },
      { question: "¿Puedo desactivar un usuario?", answer: "Sí, edita el usuario y cambia su estado a inactivo sin eliminar sus registros." },
      { question: "¿Cómo gestionar permisos?", answer: "Los permisos se asignan por rol. Edita el rol en Roles y Permisos para ajustar qué puede hacer cada tipo de usuario." }
    ]
  },
  roles: {
    title: "Roles y Permisos",
    qas: [
      { question: "¿Qué permisos tiene Admin General?", answer: "Tiene acceso completo: crear, editar, eliminar y ver todos los módulos, incluyendo gestión de usuarios." },
      { question: "¿Qué permisos tiene Digitador?", answer: "Puede crear y editar registros de participantes, orquídeas e inscripciones, pero no puede eliminar ni gestionar usuarios." },
      { question: "¿Cómo crear un nuevo rol?", answer: "Ve a Roles > Nuevo, define el nombre y selecciona los permisos específicos de cada módulo.", actions: [
        { label: "Nuevo rol", href: "/roles/create" }
      ] },
      { question: "¿Puedo modificar permisos de roles existentes?", answer: "Sí, edita el rol y marca/desmarca los permisos según necesites. Los cambios se aplican a todos los usuarios con ese rol." }
    ]
  },
  settings: {
    title: "Configuración",
    qas: [
      { question: "¿Cómo cambiar apariencia?", answer: "En Configuración > Apariencia, elige entre modo claro, oscuro o automático según la hora del día." },
      { question: "¿Cómo gestionar mi perfil?", answer: "En Configuración > Perfil, puedes actualizar tu nombre, email y cambiar tu contraseña." },
      { question: "¿Dónde cambio mi contraseña?", answer: "Ve a Configuración > Contraseña, ingresa tu contraseña actual y la nueva dos veces para confirmar." },
      { question: "¿Cómo configurar notificaciones?", answer: "En Configuración puedes activar/desactivar notificaciones por email para eventos importantes." }
    ]
  },
  auth: {
    title: "Autenticación",
    qas: [
      { question: "¿Olvidé mi contraseña?", answer: "En la pantalla de login, haz clic en '¿Olvidaste tu contraseña?', ingresa tu email y recibirás un enlace para restablecerla." },
      { question: "¿Cómo recuperar mi cuenta?", answer: "Usa la opción de recuperación de contraseña con tu email registrado. Revisa tu bandeja de entrada y spam." },
      { question: "¿Por qué no puedo acceder?", answer: "Verifica tu email y contraseña. Si el problema persiste, contacta al administrador para verificar que tu cuenta esté activa." },
      { question: "¿Qué es 'Recordarme'?", answer: "Al marcar esta opción al iniciar sesión, no necesitarás ingresar tus credenciales cada vez que vuelvas al sistema." }
    ]
  },
  ayuda: {
    title: "Asistente Inteligente",
    qas: [
      { question: "¿Cómo funciona el chatbot de ayuda?", answer: "El chatbot utiliza búsqueda inteligente con análisis semántico. Puedes buscar usando sinónimos y términos relacionados. Por ejemplo, 'crear' también encontrará 'agregar', 'registrar' o 'nuevo'." },
      { question: "¿Qué hago si no encuentro lo que busco?", answer: "Después de 3 búsquedas sin resultados, el sistema te ofrecerá contactar directamente a soporte para ayuda personalizada. También puedes explorar otros módulos usando el botón 'Explorar otros módulos'." },
      { question: "¿El sistema recuerda mis preguntas frecuentes?", answer: "Sí, el chatbot registra las preguntas que consultas más frecuentemente y las muestra en la sección 'Preguntas más consultadas' para acceso rápido." },
      { question: "¿Puedo usar el chatbot con teclado?", answer: "Sí, presiona Alt+H para abrir/cerrar el chatbot desde cualquier parte del sistema. Esto es útil para usuarios que prefieren atajos de teclado." },
      { question: "¿Cómo mejora el chatbot con el tiempo?", answer: "El sistema aprende de tus búsquedas y muestra sugerencias contextuales basadas en el módulo actual. También destaca las preguntas más vistas por todos los usuarios." }
    ]
  },
};

export function detectModuleFromUrl(url: string): string {
  const path = url.split('?')[0].replace(/\/$/, '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return 'dashboard';
  const primary = parts[0];
  if (chatbotConfig[primary]) return primary;
  const byCase = Object.keys(chatbotConfig).find(k => k.toLowerCase() === primary.toLowerCase());
  return byCase || 'dashboard';
}
