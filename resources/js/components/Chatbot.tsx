import React, { useEffect, useMemo, useState } from 'react';
import { chatbotConfig, detectModuleFromUrl, ModuleQA } from '../lib/chatbotConfig';
import { router } from '@inertiajs/react';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [moduleKey, setModuleKey] = useState<string>(() => detectModuleFromUrl(window.location.pathname));
  const [activeQ, setActiveQ] = useState<string | null>(null);

  const moduleData: ModuleQA | undefined = useMemo(() => chatbotConfig[moduleKey], [moduleKey]);

  useEffect(() => {
    const onNavigate = () => {
      const key = detectModuleFromUrl(window.location.pathname);
      setModuleKey(key);
      setActiveQ(null);
    };

    // Update on initial mount and on hash/popstate
    window.addEventListener('popstate', onNavigate);
    window.addEventListener('hashchange', onNavigate);

    // Inertia navigate event
    try {
      // @ts-ignore - router.on exists at runtime
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

  return (
    <div className="pointer-events-none">
      {/* Floating button */}
      <button
        type="button"
        aria-label="Ayuda"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 focus:outline-none"
        style={{ display: open ? 'none' : 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <span className="text-2xl leading-none">?</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="pointer-events-auto fixed bottom-4 right-4 z-50 w-[min(90vw,380px)] max-h-[70vh] overflow-hidden rounded-lg border bg-card text-card-foreground shadow-xl">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <div className="text-sm font-semibold">
              {moduleData?.title ?? 'Ayuda'}
            </div>
            <button
              className="h-8 w-8 rounded hover:bg-muted"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="max-h-[58vh] overflow-auto p-3 space-y-3">
            {!moduleData && (
              <div className="text-sm text-muted-foreground">No hay ayuda disponible para este módulo.</div>
            )}

            {moduleData?.qas.map((qa, idx) => (
              <div key={idx} className="rounded-md border">
                <button
                  className="w-full text-left px-3 py-2 hover:bg-muted"
                  onClick={() => setActiveQ((prev) => (prev === qa.question ? null : qa.question))}
                >
                  <div className="text-sm font-medium">{qa.question}</div>
                </button>
                {activeQ === qa.question && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="text-sm text-muted-foreground">{qa.answer}</div>
                    {qa.actions && qa.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {qa.actions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => router.visit(act.href)}
                            className="inline-flex items-center rounded-md border px-3 py-1.5 text-xs hover:bg-muted"
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
          </div>

          <div className="border-t px-3 py-2 text-xs text-muted-foreground">
            ¿Qué necesitas hacer? Selecciona una pregunta para ver las instrucciones.
          </div>
        </div>
      )}
    </div>
  );
}
