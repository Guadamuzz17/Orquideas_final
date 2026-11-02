import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function TestReportes() {
    const breadcrumbs = [
        { title: 'Dashboard', label: 'Dashboard', href: '/dashboard' },
        { title: 'Test', label: 'Test', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Test Reportes" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-card border border-border overflow-hidden shadow-xs rounded-xl">
                        <div className="p-6 text-foreground">
                            <h1 className="text-xl font-bold mb-2">Test de Reportes</h1>
                            <p className="text-muted-foreground">Esta página de prueba carga correctamente.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
