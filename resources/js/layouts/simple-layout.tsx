import { PropsWithChildren } from 'react';
import { useFlashMessages } from '@/hooks/useFlashMessages';

export default function SimpleLayout({ children }: PropsWithChildren) {
    useFlashMessages();

    return (
        <div className="min-h-screen bg-background">
            <main className="w-full">
                {children}
            </main>
        </div>
    );
}
