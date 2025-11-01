import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function AutocompleteOrquidea({ value, onChange, placeholder, className, error }: AutocompleteInputProps) {
  const [sugerencias, setSugerencias] = useState<string[]>([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const [indiceSugerencia, setIndiceSugerencia] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const buscarSugerencias = async () => {
      if (value.length < 2) {
        setSugerencias([]);
        return;
      }

      try {
        const response = await fetch(`/orquideas/sugerencias?q=${encodeURIComponent(value)}`);
        if (response.ok) {
          const data = await response.json();
          setSugerencias(data);
          setMostrarSugerencias(data.length > 0);
        }
      } catch (error) {
        console.error('Error al buscar sugerencias:', error);
      }
    };

    const timeoutId = setTimeout(buscarSugerencias, 300);
    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!mostrarSugerencias || sugerencias.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIndiceSugerencia((prev) =>
          prev < sugerencias.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setIndiceSugerencia((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (indiceSugerencia >= 0 && indiceSugerencia < sugerencias.length) {
          seleccionarSugerencia(sugerencias[indiceSugerencia]);
        }
        break;
      case 'Escape':
        setMostrarSugerencias(false);
        setIndiceSugerencia(-1);
        break;
    }
  };

  const seleccionarSugerencia = (sugerencia: string) => {
    onChange(sugerencia);
    setMostrarSugerencias(false);
    setIndiceSugerencia(-1);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (sugerencias.length > 0) {
            setMostrarSugerencias(true);
          }
        }}
        placeholder={placeholder}
        className={cn(className, error && 'border-red-500')}
      />

      {mostrarSugerencias && sugerencias.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="py-1">
            {sugerencias.map((sugerencia, index) => (
              <button
                key={index}
                type="button"
                onClick={() => seleccionarSugerencia(sugerencia)}
                className={cn(
                  "w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between transition-colors",
                  index === indiceSugerencia && "bg-blue-50"
                )}
              >
                <span className="text-sm">{sugerencia}</span>
                {value.toLowerCase() === sugerencia.toLowerCase() && (
                  <Check className="h-4 w-4 text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {value.length >= 2 && sugerencias.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="px-4 py-2 text-sm text-gray-500">
            Nombre único - Se registrará como nuevo
          </div>
        </div>
      )}
    </div>
  );
}
