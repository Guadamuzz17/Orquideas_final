import React, { useEffect, useMemo, useState } from 'react';
import { chatbotConfig, detectModuleFromUrl, ModuleQA } from '../lib/chatbotConfig';
import { router } from '@inertiajs/react';
import { HelpCircle, X, Search, ChevronDown, ChevronRight, Sparkles, MessageCircle, AlertCircle, TrendingUp, Lightbulb } from 'lucide-react';

// Tipos para estadísticas de búsqueda
type SearchAttempt = {
  query: string;
  timestamp: number;
  found: boolean;
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [moduleKey, setModuleKey] = useState<string>(() => detectModuleFromUrl(window.location.pathname));
  const [activeQ, setActiveQ] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllModules, setShowAllModules] = useState(false);
  const [searchAttempts, setSearchAttempts] = useState<SearchAttempt[]>([]);
  const [showSupportContact, setShowSupportContact] = useState(false);
  const [questionViews, setQuestionViews] = useState<Record<string, number>>({});

  const moduleData: ModuleQA | undefined = useMemo(() => chatbotConfig[moduleKey], [moduleKey]);

  // Cargar historial de vistas desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem('chatbot-question-views');
    if (stored) {
      try {
        setQuestionViews(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading question views:', e);
      }
    }
  }, []);

  // Guardar historial de vistas
  useEffect(() => {
    if (Object.keys(questionViews).length > 0) {
      localStorage.setItem('chatbot-question-views', JSON.stringify(questionViews));
    }
  }, [questionViews]);

  // Función de búsqueda inteligente con análisis semántico
  const intelligentSearch = (query: string, text: string): boolean => {
    const normalizeText = (str: string) => str.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const queryNorm = normalizeText(query);
    const textNorm = normalizeText(text);

    // Búsqueda exacta
    if (textNorm.includes(queryNorm)) return true;

    // Búsqueda por palabras clave
    const queryWords = queryNorm.split(/\s+/).filter(w => w.length > 2);
    const matchCount = queryWords.filter(word => textNorm.includes(word)).length;

    // Si coinciden al menos el 60% de las palabras
    if (queryWords.length > 0 && matchCount / queryWords.length >= 0.6) return true;

    // Sinónimos y términos relacionados
    const synonyms: Record<string, string[]> = {
      'crear': ['agregar', 'nuevo', 'registrar', 'añadir', 'crear'],
      'editar': ['modificar', 'cambiar', 'actualizar', 'corregir'],
      'eliminar': ['borrar', 'quitar', 'remover', 'suprimir'],
      'ver': ['mostrar', 'visualizar', 'consultar', 'listar'],
      'buscar': ['encontrar', 'localizar', 'filtrar', 'consultar'],
      'participante': ['expositor', 'inscrito', 'persona', 'usuario'],
      'orquidea': ['planta', 'flor', 'especie', 'ejemplar'],
      'premio': ['listón', 'trofeo', 'galardón', 'reconocimiento'],
      'evento': ['exposición', 'muestra', 'exhibición', 'feria'],
      'inscripcion': ['registro', 'correlativo', 'inscrito']
    };

    for (const queryWord of queryWords) {
      for (const [key, syns] of Object.entries(synonyms)) {
        if (syns.includes(queryWord) && textNorm.includes(key)) {
          return true;
        }
        if (queryWord === key && syns.some(syn => textNorm.includes(syn))) {
          return true;
        }
      }
    }

    return false;
  };

  // Filtrar preguntas con búsqueda inteligente
  const filteredQAs = useMemo(() => {
    if (!moduleData || !searchQuery) return moduleData?.qas || [];

    const results = moduleData.qas.filter(qa =>
      intelligentSearch(searchQuery, qa.question) ||
      intelligentSearch(searchQuery, qa.answer)
    );

    // Registrar intento de búsqueda
    if (searchQuery.length > 2) {
      const newAttempt: SearchAttempt = {
        query: searchQuery,
        timestamp: Date.now(),
        found: results.length > 0
      };
      setSearchAttempts(prev => [...prev.slice(-4), newAttempt]);
    }

    return results;
  }, [moduleData, searchQuery]);

  // Obtener sugerencias de otros módulos
  const relatedModules = useMemo(() => {
    const related: { key: string; title: string; qas: any[] }[] = [];
    Object.entries(chatbotConfig).forEach(([key, data]) => {
      if (key !== moduleKey && data.qas.length > 0) {
        related.push({ key, title: data.title, qas: data.qas });
      }
    });
    return related;
  }, [moduleKey]);

  // Detectar búsquedas fallidas consecutivas
  const failedSearchCount = useMemo(() => {
    const recentAttempts = searchAttempts.filter(a => Date.now() - a.timestamp < 60000); // Últimos 60 segundos
    const failedAttempts = recentAttempts.filter(a => !a.found);
    return failedAttempts.length;
  }, [searchAttempts]);

  // Mostrar contacto de soporte si hay 3+ búsquedas fallidas
  useEffect(() => {
    if (failedSearchCount >= 3) {
      setShowSupportContact(true);
    }
  }, [failedSearchCount]);

  // Obtener preguntas más vistas
  const topQuestions = useMemo(() => {
    if (!moduleData) return [];

    return moduleData.qas
      .map(qa => ({
        ...qa,
        views: questionViews[qa.question] || 0
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
  }, [moduleData, questionViews]);

  // Sugerencias contextuales basadas en el módulo
  const contextualSuggestions = useMemo(() => {
    const suggestions: Record<string, string[]> = {
      participantes: ['crear participante', 'qué es ASO', 'buscar participante'],
      orquideas: ['agregar orquídea', 'grupos y clases', 'autocompletado'],
      inscripcion: ['correlativo', 'múltiples plantas', 'crear inscripción'],
      listones: ['otorgar listón', 'tipos de premios', 'reporte listones'],
      eventos: ['crear evento', 'cambiar evento', 'varios eventos'],
      users: ['crear usuario', 'roles', 'cambiar contraseña']
    };

    return suggestions[moduleKey] || [];
  }, [moduleKey]);

  // Registrar vista de pregunta
  const handleQuestionView = (question: string) => {
    setActiveQ((prev) => {
      const newActive = prev === question ? null : question;

      if (newActive === question) {
        setQuestionViews(prev => ({
          ...prev,
          [question]: (prev[question] || 0) + 1
        }));
      }

      return newActive;
    });
  };

  useEffect(() => {
    const onNavigate = () => {
      const key = detectModuleFromUrl(window.location.pathname);
      setModuleKey(key);
      setActiveQ(null);
      setSearchQuery('');
      setShowAllModules(false);
      setShowSupportContact(false);
    };

    window.addEventListener('popstate', onNavigate);
    window.addEventListener('hashchange', onNavigate);

    try {
      // @ts-ignore
      router?.on?.('navigate', onNavigate);
    } catch {}

    return () => {
      window.removeEventListener('popstate', onNavigate);
      window.removeEventListener('hashchange', onNavigate);
      try {
        // @ts-ignore
        router?.off?.('navigate', onNavigate);
      } catch {}
    };
  }, []);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + H para abrir/cerrar chatbot
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      // Escape para cerrar
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div className="pointer-events-none">
      {/* Floating button con tooltip */}
      <div className="pointer-events-auto fixed bottom-4 right-4 z-50 group">
        <button
          type="button"
          aria-label="Ayuda (Alt + H)"
          onClick={() => setOpen((v) => !v)}
          className={`h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300 ${open ? 'hidden' : 'flex items-center justify-center'}`}
        >
          <HelpCircle className="h-7 w-7" />
        </button>
        {!open && (
          <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ayuda (Alt + H)
          </div>
        )}
      </div>

      {/* Panel mejorado */}
      {open && (
        <div className="pointer-events-auto fixed bottom-4 right-4 z-50 w-[min(90vw,400px)] max-h-[80vh] overflow-hidden rounded-xl border-2 bg-white dark:bg-gray-800 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          {/* Header con degradado */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <div>
                <div className="text-sm font-bold">
                  {moduleData?.title ?? 'Ayuda General'}
                </div>
                <div className="text-xs opacity-90">
                  Asistente Inteligente
                </div>
              </div>
            </div>
            <button
              className="h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Barra de búsqueda mejorada */}
          <div className="border-b px-4 py-3 bg-gray-50 dark:bg-gray-700 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar pregunta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Sugerencias contextuales */}
            {!searchQuery && contextualSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  Prueba:
                </span>
                {contextualSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchQuery(suggestion)}
                    className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contenido con scroll personalizado */}
          <div className="max-h-[55vh] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {!moduleData && (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-500">No hay ayuda disponible para este módulo.</p>
              </div>
            )}

            {/* Mensaje de búsqueda sin resultados con soporte */}
            {searchQuery && filteredQAs.length === 0 && (
              <div className="text-center py-8 space-y-4">
                <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <div>
                  <p className="text-sm text-gray-500 mb-2">No se encontraron resultados para "{searchQuery}"</p>
                  <p className="text-xs text-gray-400">Intenta con otros términos o palabras relacionadas</p>
                </div>

                {/* Mostrar contacto de soporte después de 3 búsquedas fallidas */}
                {showSupportContact && (
                  <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg animate-in slide-in-from-top-2 duration-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2">
                          💬 No encontré una respuesta para tu consulta
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mb-3">
                          ¿Deseas contactar a soporte para obtener ayuda personalizada?
                        </p>
                        <button
                          onClick={() => {
                            // Aquí podrías abrir un modal de contacto o redireccionar
                            alert('Funcionalidad de contacto a soporte.\n\nEn producción, esto abriría un formulario de contacto o chat en vivo.');
                            setShowSupportContact(false);
                            setSearchAttempts([]);
                          }}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-medium transition-colors shadow-sm"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Contactar soporte
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Preguntas más vistas (solo sin búsqueda) */}
            {!searchQuery && topQuestions.some(q => q.views > 0) && (
              <div className="mb-4 p-3 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-semibold text-purple-900 dark:text-purple-200">
                    Preguntas más consultadas
                  </span>
                </div>
                <div className="space-y-1">
                  {topQuestions.filter(q => q.views > 0).map((qa, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuestionView(qa.question)}
                      className="w-full text-left text-xs text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 hover:underline flex items-center gap-1.5"
                    >
                      <span className="text-purple-400">•</span>
                      {qa.question}
                      <span className="ml-auto text-[10px] text-purple-400">({qa.views})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredQAs.map((qa, idx) => (
              <div key={idx} className="rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-md transition-shadow">
                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between gap-2 group"
                  onClick={() => handleQuestionView(qa.question)}
                >
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200 flex-1">{qa.question}</div>
                  {activeQ === qa.question ? (
                    <ChevronDown className="h-4 w-4 text-blue-500 transition-transform" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  )}
                </button>
                {activeQ === qa.question && (
                  <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{qa.answer}</div>
                    {qa.actions && qa.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {qa.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              router.visit(act.href);
                              setOpen(false);
                            }}
                            className="inline-flex items-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-xs font-medium transition-colors shadow-sm hover:shadow"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Módulos relacionados */}
            {!searchQuery && filteredQAs.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowAllModules(!showAllModules)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                >
                  <span>Explorar otros módulos ({relatedModules.length})</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${showAllModules ? 'rotate-180' : ''}`} />
                </button>
                {showAllModules && (
                  <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                    {relatedModules.slice(0, 5).map(({ key, title, qas }) => (
                      <button
                        key={key}
                        onClick={() => {
                          setModuleKey(key);
                          setShowAllModules(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</div>
                        <div className="text-xs text-gray-500">{qas.length} preguntas disponibles</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-4 py-3 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              💡 Presiona <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-600 rounded border text-xs">Alt+H</kbd> para abrir/cerrar
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
