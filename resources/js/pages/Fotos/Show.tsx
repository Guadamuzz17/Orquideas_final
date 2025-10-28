import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FotoEvento {
    id: number;
    titulo: string;
    descripcion?: string;
    fecha_evento?: string;
    ruta_imagen: string;
    url_imagen: string;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    foto: FotoEvento;
}

export default function FotosShow({ foto }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Fotografías', href: '/fotos' },
        { title: foto.titulo, href: '#' },
    ];

    const formatearFecha = (fecha?: string) => {
        if (!fecha) return 'Sin fecha';
        try {
            return format(new Date(fecha), 'dd MMMM yyyy', { locale: es });
        } catch {
            return 'Fecha inválida';
        }
    };

    const formatearFechaCompleta = (fecha: string) => {
        try {
            return format(new Date(fecha), 'dd MMMM yyyy \'a las\' HH:mm', { locale: es });
        } catch {
            return 'Fecha inválida';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Fotografía: ${foto.titulo}`} />

            <div className="py-6">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{foto.titulo}</h1>
                            <div className="flex items-center gap-4 mt-2">
                                <Badge variant="secondary">
                                    📅 {formatearFecha(foto.fecha_evento)}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    Subida el {formatearFechaCompleta(foto.created_at)}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/fotos/${foto.id}/edit`}>
                                <Button variant="outline">
                                    ✏️ Editar
                                </Button>
                            </Link>
                            <Link href="/fotos">
                                <Button variant="secondary">
                                    ← Volver
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Imagen principal */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="relative">
                                <img
                                    src={foto.url_imagen}
                                    alt={foto.titulo}
                                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg"
                                    onError={(e) => {
                                        e.currentTarget.src = '/images/placeholder-image.jpg';
                                    }}
                                />
                                <div className="absolute top-4 right-4">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = foto.url_imagen;
                                            link.download = `${foto.titulo}.jpg`;
                                            link.click();
                                        }}
                                    >
                                        💾 Descargar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Información detallada */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Descripción */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>📝 Descripción</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {foto.descripcion ? (
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {foto.descripcion}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 italic">
                                            No hay descripción disponible para esta fotografía.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Metadatos */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>ℹ️ Información</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">ID</label>
                                        <p className="text-gray-900">#{foto.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Fecha del Evento</label>
                                        <p className="text-gray-900">
                                            {formatearFecha(foto.fecha_evento)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Fecha de Subida</label>
                                        <p className="text-gray-900">
                                            {formatearFechaCompleta(foto.created_at)}
                                        </p>
                                    </div>
                                    {foto.updated_at !== foto.created_at && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-600">Última Modificación</label>
                                            <p className="text-gray-900">
                                                {formatearFechaCompleta(foto.updated_at)}
                                            </p>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">URL Pública</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={foto.url_imagen}
                                                readOnly
                                                className="text-xs bg-gray-50 border rounded px-2 py-1 flex-1"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(foto.url_imagen);
                                                }}
                                            >
                                                📋
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Acciones adicionales */}
                    <Card>
                        <CardHeader>
                            <CardTitle>🔧 Acciones</CardTitle>
                            <CardDescription>
                                Opciones disponibles para esta fotografía
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const apiUrl = `${window.location.origin}/api/fotos`;
                                        navigator.clipboard.writeText(apiUrl);
                                        alert('URL de la API copiada al portapapeles');
                                    }}
                                >
                                    🔗 Copiar URL de API
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        window.open(foto.url_imagen, '_blank');
                                    }}
                                >
                                    🔍 Ver en Nueva Pestaña
                                </Button>
                                <Link href={`/fotos/${foto.id}/edit`}>
                                    <Button variant="default">
                                        ✏️ Editar Fotografía
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
