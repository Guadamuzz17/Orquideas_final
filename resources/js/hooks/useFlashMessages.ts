import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { showSuccessAlert, showErrorAlert, showWarningAlert, showInfoAlert, showValidationErrors } from '@/utils/sweetalert';

interface FlashMessages {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  errors?: Record<string, string | string[]>;
}

export const useFlashMessages = () => {
  const { props } = usePage<{ flash?: FlashMessages }>();

  useEffect(() => {
    const flash = props.flash;

    if (!flash) return;

    if (flash.success) {
      showSuccessAlert('¡Éxito!', flash.success);
    }

    if (flash.error) {
      showErrorAlert('Error', flash.error);
    }

    if (flash.warning) {
      showWarningAlert('Advertencia', flash.warning);
    }

    if (flash.info) {
      showInfoAlert('Información', flash.info);
    }

    if (flash.errors && Object.keys(flash.errors).length > 0) {
      showValidationErrors(flash.errors);
    }
  }, [props.flash]);
};
