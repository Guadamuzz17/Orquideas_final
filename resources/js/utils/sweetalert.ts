import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showSuccessAlert = (title: string, text?: string) => {
  return MySwal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#10b981',
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showErrorAlert = (title: string, text?: string) => {
  return MySwal.fire({
    icon: 'error',
    title,
    text: text || 'Ha ocurrido un error. Por favor, intente nuevamente.',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#ef4444',
  });
};

export const showWarningAlert = (title: string, text?: string) => {
  return MySwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#f59e0b',
  });
};

export const showInfoAlert = (title: string, text?: string) => {
  return MySwal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#3b82f6',
  });
};

export const showConfirmDialog = (title: string, text?: string) => {
  return MySwal.fire({
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  });
};

export const showDeleteConfirm = (itemName?: string) => {
  return MySwal.fire({
    icon: 'warning',
    title: '¿Está seguro?',
    text: itemName
      ? `Se eliminará permanentemente: ${itemName}`
      : 'Esta acción no se puede deshacer',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
  });
};

export const showLoadingAlert = (title: string = 'Procesando...') => {
  return MySwal.fire({
    title,
    html: 'Por favor espere',
    allowOutsideClick: false,
    allowEscapeKey: false,
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
      return `<strong>${field}:</strong> ${messageArray.join(', ')}`;
    })
    .join('<br>');

  return MySwal.fire({
    icon: 'error',
    title: 'Errores de Validación',
    html: errorMessages,
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#ef4444',
  });
};
