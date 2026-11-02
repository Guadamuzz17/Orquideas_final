import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Perfil',
        href: '/settings/profile',
        icon: null,
    },
    {
        title: 'Contraseña',
        href: '/settings/password',
        icon: null,
    },
    {
        title: 'Apariencia',
        href: '/settings/appearance',
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6 md:px-8">
            <Heading title="Configuración" description="Administra tu perfil, seguridad y apariencia" />

            <div className="flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-12 mt-6">
                <aside className="w-full lg:w-48 overflow-x-auto touch-scroll">
                    <nav className="flex flex-row gap-1 lg:flex-col min-w-max lg:min-w-0">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('justify-start', {
                                    'bg-muted font-semibold text-foreground': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-2 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-8">{children}</section>
                </div>
            </div>
        </div>
    );
}
