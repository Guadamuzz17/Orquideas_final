export type Action = { label: string; href: string };
export type QA = { question: string; answer: string; actions?: Action[] };
export type ModuleQA = { title: string; qas: QA[] };

export const chatbotConfig: Record<string, ModuleQA> = {
  dashboard: {
    title: "Panel de control",
    qas: [
      { question: "¿Qué veo en el panel?", answer: "Un resumen de métricas y accesos rápidos a los módulos." },
      { question: "¿Cómo navegar a un módulo?", answer: "Usa el menú lateral o los accesos rápidos del panel." }
    ]
  },
  participantes: {
    title: "Participantes",
    qas: [
      { question: "¿Cómo registrar un participante?", answer: "Ve a Participantes > Nuevo, completa el formulario y guarda.", actions: [
        { label: "Nuevo participante", href: "/participantes/create" }
      ] },
      { question: "¿Cómo editar un participante?", answer: "Busca el participante y selecciona Editar para actualizar sus datos." }
    ]
  },
  orquideas: {
    title: "Orquídeas",
    qas: [
      { question: "¿Cómo agregar una orquídea?", answer: "En Orquídeas, presiona Añadir, llena los datos y guarda.", actions: [
        { label: "Nueva orquídea", href: "/orquideas/create" }
      ] },
      { question: "¿Cómo asociar a un participante?", answer: "En el formulario, selecciona el participante propietario de la orquídea." }
    ]
  },
  inscripcion: {
    title: "Inscripción",
    qas: [
      { question: "¿Cómo crear una inscripción?", answer: "Desde Inscripción, elige participante y orquídea, luego confirma.", actions: [
        { label: "Nueva inscripción", href: "/inscripcion/create" }
      ] },
      { question: "¿Cómo ver el estado de inscripción?", answer: "Abre el listado de inscripciones para revisar estado y detalles." }
    ]
  },
  grupos: {
    title: "Grupos",
    qas: [
      { question: "¿Cómo crear un grupo?", answer: "En Grupos, usa Nuevo grupo, define nombre y guarda.", actions: [
        { label: "Nuevo grupo", href: "/grupos/create" }
      ] },
      { question: "¿Cómo asignar orquídeas a grupos?", answer: "Desde el grupo, utiliza la opción Asignar y selecciona las orquídeas." }
    ]
  },
  clases: {
    title: "Clases",
    qas: [
      { question: "¿Cómo administrar clases?", answer: "Crea, edita o elimina clases desde el listado de Clases.", actions: [
        { label: "Nueva clase", href: "/clases/create" }
      ] },
      { question: "¿Cómo relacionar clases con grupos?", answer: "Edita la clase y asigna el grupo correspondiente." }
    ]
  },
  Listones: {
    title: "Listones",
    qas: [
      { question: "¿Cómo crear listones?", answer: "En Listones, agrega un nuevo listón y define su categoría.", actions: [
        { label: "Nuevo listón", href: "/listones/create" }
      ] },
      { question: "¿Cómo otorgar un listón?", answer: "Selecciona la orquídea y aplica el listón desde la vista de detalles." }
    ]
  },
  Trofeos: {
    title: "Trofeos",
    qas: [
      { question: "¿Cómo registrar trofeos?", answer: "En Trofeos, crea un nuevo registro con nombre y criterios.", actions: [
        { label: "Nuevo trofeo", href: "/trofeos/create" }
      ] },
      { question: "¿Cómo asignar trofeos?", answer: "Desde resultados, elige la orquídea ganadora y asigna el trofeo." }
    ]
  },
  Ganadores: {
    title: "Ganadores",
    qas: [
      { question: "¿Cómo ver ganadores?", answer: "Abre Ganadores para listar los resultados por categoría.", actions: [
        { label: "Nuevo ganador", href: "/ganadores/create" }
      ] },
      
    ]
  },
  Reportes: {
    title: "Reportes",
    qas: [
      { question: "¿Cómo generar un reporte?", answer: "Selecciona el tipo de reporte, define filtros y genera el PDF o Excel.", actions: [
        { label: "Ver reportes", href: "/reportes" }
      ] },
      { question: "¿Cómo programar reportes?", answer: "Define parámetros y guarda una plantilla para reutilizarla." }
    ]
  },
  registro_orquideas: {
    title: "Registro de Orquídeas",
    qas: [
      { question: "¿Cómo registrar orquídeas masivamente?", answer: "Usa la importación desde archivo siguiendo el formato indicado." },
      { question: "¿Cómo validar datos?", answer: "El sistema muestra errores por fila para corregir antes de guardar." }
    ]
  },
  Fotos: {
    title: "Fotos",
    qas: [
      { question: "¿Cómo subir fotos?", answer: "Arrastra imágenes o selecciona archivos y confirma la subida.", actions: [
        { label: "Subir foto", href: "/fotos/create" }
      ] },
      { question: "¿Qué formatos se aceptan?", answer: "Se aceptan JPG y PNG con tamaño máximo según configuración." }
    ]
  },
  settings: {
    title: "Configuración",
    qas: [
      { question: "¿Cómo cambiar apariencia?", answer: "Desde Configuración, elige modo claro/oscuro según preferencia." },
      { question: "¿Cómo gestionar usuarios?", answer: "Accede a usuarios, crea o edita roles y permisos." }
    ]
  },
  auth: {
    title: "Autenticación",
    qas: [
      { question: "¿Olvidé mi contraseña?", answer: "Usa la opción Recuperar contraseña en la pantalla de inicio de sesión." },
      { question: "¿Cómo registrarme?", answer: "Si está habilitado, completa el formulario de registro." }
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
