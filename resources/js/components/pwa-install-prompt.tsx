import { useEffect, useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isStandalone, setIsStandalone] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Detectar si ya corre como app instalada (standalone)
        const checkStandalone = window.matchMedia('(display-mode: standalone)').matches 
            || (window.navigator as unknown as { standalone?: boolean }).standalone === true;
        setIsStandalone(checkStandalone);

        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        const handleAppInstalled = () => {
            setDeferredPrompt(null);
            setIsStandalone(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
            setDeferredPrompt(null);
        }
    };

    if (isStandalone || isDismissed || !deferredPrompt) {
        return null;
    }

    return (
        <div className="mx-2 mb-2 rounded-xl border border-primary/30 bg-primary/10 p-3 text-xs text-foreground shadow-sm backdrop-blur transition-all group-data-[collapsible=icon]:hidden">
            <div className="flex items-start gap-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Smartphone className="size-4" />
                </div>
                <div className="flex-1 space-y-1">
                    <p className="font-semibold leading-tight text-foreground">Instalar App de Orquídeas</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                        Accede de forma rápida y sin conexión instalando la app en tu dispositivo.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                        <Button
                            size="sm"
                            onClick={handleInstallClick}
                            className="h-7 px-2.5 text-xs font-medium gap-1.5 shadow-sm"
                        >
                            <Download className="size-3.5" />
                            Instalar
                        </Button>
                        <button
                            type="button"
                            onClick={() => setIsDismissed(true)}
                            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors px-1 py-0.5"
                        >
                            Ahora no
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

