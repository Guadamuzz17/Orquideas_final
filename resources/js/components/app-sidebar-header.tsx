import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="sticky top-0 z-20 flex h-14 md:h-16 shrink-0 items-center justify-between gap-2 border-b border-border/80 bg-background/80 backdrop-blur-md px-3 md:px-4 safe-top transition-[width,height] ease-linear">
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <SidebarTrigger className="-ml-1 h-9 w-9 text-muted-foreground hover:text-foreground" />
                <Separator orientation="vertical" className="mr-1 h-4 hidden sm:block" />
                <div className="truncate">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                <AppearanceToggleDropdown />
            </div>
        </header>
    );
}
