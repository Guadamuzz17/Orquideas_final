import Swal, { SweetAlertOptions } from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'sonner';

const MySwal = withReactContent(Swal);

const getThemeOptions = (): Partial<SweetAlertOptions> => {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  return {
    background: isDark ? 'hsl(222.2 84% 4.9%)' : '#ffffff',
    color: isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)',
    buttonsStyling: false,
    customClass: {
      popup: 'rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-6 font-sans',
      title: 'text-lg font-bold text-foreground mb-1',
      htmlContainer: 'text-sm text-muted-foreground mb-4',
      confirmButton: 'inline-flex items-center justify-center rounded-xl font-medium text-sm px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow transition-colors mx-1.5 focus:outline-none focus:ring-2 focus:ring-primary',
      cancelButton: 'inline-flex items-center justify-center rounded-xl font-medium text-sm px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border shadow-sm transition-colors mx-1.5 focus:outline-none focus:ring-2 focus:ring-muted',
    },
  };
};

export const showSuccessAlert = (title: string, text?: string) => {
  toast.success(title, {
    description: text,
  });
  return Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false });
};

export const showErrorAlert = (title: string, text?: string) => {
  toast.error(title, {
    description: text || 'Ha ocurrido un error. Por favor, intente nuevamente.',
  });
  return Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false });
};

export const showWarningAlert = (title: string, text?: string) => {
  toast.warning(title, {
    description: text,
  });
  return Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false });
};

export const showInfoAlert = (title: string, text?: string) => {
  toast.info(title, {
    description: text,
  });
  return Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false });
};

export const showConfirmDialog = (title: string, text?: string) => {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  return MySwal.fire({
    ...getThemeOptions(),
    icon: 'question',
    iconColor: '#10b981',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-6 font-sans',
      title: 'text-lg font-bold text-foreground mb-1',
      htmlContainer: 'text-sm text-muted-foreground mb-4',
      confirmButton: 'inline-flex items-center justify-center rounded-xl font-medium text-sm px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow transition-colors mx-1.5 focus:outline-none focus:ring-2 focus:ring-primary',
      cancelButton: 'inline-flex items-center justify-center rounded-xl font-medium text-sm px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border shadow-sm transition-colors mx-1.5 focus:outline-none focus:ring-2 focus:ring-muted',
    },
  });
};

export const showDeleteConfirm = (itemName?: string) => {
  return MySwal.fire({
    ...getThemeOptions(),
    icon: 'warning',
    iconColor: '#ef4444',
    title: '¿Está seguro de eliminar?',
    text: itemName
      ? `Se eliminará permanentemente: "${itemName}". Esta acción no se puede deshacer.`
      : 'Esta acción es permanente y no se puede deshacer.',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-6 font-sans',
      title: 'text-lg font-bold text-foreground mb-1',
      htmlContainer: 'text-sm text-muted-foreground mb-4',
      confirmButton: 'inline-flex items-center justify-center rounded-xl font-medium text-sm px-4 py-2 bg-red-600 text-white hover:bg-red-700 shadow transition-colors mx-1.5 focus:outline-none focus:ring-2 focus:ring-red-500',
      cancelButton: 'inline-flex items-center justify-center rounded-xl font-medium text-sm px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border shadow-sm transition-colors mx-1.5 focus:outline-none focus:ring-2 focus:ring-muted',
    },
  });
};

export const showLoadingAlert = (title: string = 'Procesando...') => {
  return MySwal.fire({
    ...getThemeOptions(),
    title,
    html: 'Por favor espere un momento...',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Helper para mostrar errores de validación
export const showValidationErrors = (errors: Record<string, string | string[]>) => {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => {
      const messageArray = Array.isArray(messages) ? messages : [messages];
      return `${field}: ${messageArray.join(', ')}`;
    })
    .join('\n');

  toast.error('Errores de Validación', {
    description: errorMessages,
  });

  return Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false });
};
