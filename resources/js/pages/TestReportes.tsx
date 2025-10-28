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
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1>Test de Reportes</h1>
                            <p>Esta página de prueba carga correctamente.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
