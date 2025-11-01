import { PropsWithChildren } from 'react';

export default function SimpleLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-background">
            <main className="w-full">
                {children}
            </main>
        </div>
    );
}
