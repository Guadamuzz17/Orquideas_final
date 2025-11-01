import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear">
            <div className="flex items-center gap-2 flex-1">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
        </header>
    );
}
