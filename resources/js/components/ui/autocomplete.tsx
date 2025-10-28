import React, { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { Search, Loader2 } from 'lucide-react';

export interface AutocompleteOption {
  id: string | number;
  label: string;
  value: any;
  description?: string;
  badge?: string;
}

interface AutocompleteProps {
  options: AutocompleteOption[];
  onSelect: (option: AutocompleteOption) => void;
  onSearch?: (searchTerm: string) => void;
  placeholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  noResultsText?: string;
  className?: string;
}

export function Autocomplete({
  options,
  onSelect,
  onSearch,
  placeholder = "Buscar...",
  searchValue = "",
  onSearchChange,
  loading = false,
  disabled = false,
  noResultsText = "No se encontraron resultados",
  className = ""
}: AutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Cerrar el autocompletado cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && options.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && options[highlightedIndex]) {
          handleSelect(options[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange?.(value);
    onSearch?.(value);

    if (value.trim() !== '') {
      setIsOpen(true);
      setHighlightedIndex(-1);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelect = (option: AutocompleteOption) => {
    onSelect(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (searchValue.trim() !== '' && options.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          disabled={disabled}
          className="pl-10 pr-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
        )}
      </div>

      {isOpen && (
        <Card className="absolute z-50 w-full mt-1 max-h-60 overflow-auto shadow-lg">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-3 text-center text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                Buscando...
              </div>
            ) : options.length > 0 ? (
              <div ref={optionsRef}>
                {options.map((option, index) => (
                  <div
                    key={option.id}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      index === highlightedIndex ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-gray-500">{option.description}</div>
                        )}
                      </div>
                      {option.badge && (
                        <Badge variant="secondary" className="ml-2">
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : searchValue.trim() !== '' ? (
              <div className="p-3 text-center text-gray-500">
                {noResultsText}
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
