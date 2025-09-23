import { Leaf } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-green-600 text-white">
                <Leaf className="size-5" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Sistema Orquídeas</span>
                <span className="truncate text-xs text-sidebar-foreground/70">A.A.O Guatemala</span>
            </div>
        </>
    );
}
