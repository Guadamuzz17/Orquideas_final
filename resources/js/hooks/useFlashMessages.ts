import { useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

interface FlashMessages {
  success?: string;
  error?: string;
  warning?: string;
  info?: string;
  errors?: Record<string, string | string[]>;
}

export const useFlashMessages = () => {
  const { props } = usePage<{ flash?: FlashMessages }>();
  const lastFlashRef = useRef<string>('');

  useEffect(() => {
    const flash = props.flash;

    if (!flash) return;

    // Crear un identificador único para este conjunto de mensajes
    const flashId = JSON.stringify(flash);

    // Si es el mismo mensaje que antes, no mostrarlo de nuevo
    if (flashId === lastFlashRef.current) {
      return;
    }

    lastFlashRef.current = flashId;

    if (flash.success) {
      toast.success(flash.success);
    }

    if (flash.error) {
      toast.error(flash.error);
    }

    if (flash.warning) {
      toast.warning(flash.warning);
    }

    if (flash.info) {
      toast.info(flash.info);
    }

    if (flash.errors && Object.keys(flash.errors).length > 0) {
      const errorList = Object.entries(flash.errors)
        .map(([field, messages]) => {
          const arr = Array.isArray(messages) ? messages : [messages];
          return `${field}: ${arr.join(', ')}`;
        })
        .join('\n');
      toast.error('Errores de validación', {
        description: errorList,
      });
    }
  }, [props.flash]);
};
