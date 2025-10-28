import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';

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

interface PaginatedFotos {
    data: FotoEvento[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    prev_page_url?: string;
    next_page_url?: string;
}

interface PageProps {
    fotos: PaginatedFotos;
}

export default function FotosIndex({ fotos }: PageProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Fotografías', href: '#' },
    ];

    const handleDelete = async (id: number, titulo: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `Se eliminará la fotografía "${titulo}" de forma permanente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            router.delete(`/fotos/${id}`, {
                onSuccess: () => {
                    Swal.fire('¡Eliminado!', 'La fotografía ha sido eliminada.', 'success');
                },
                onError: () => {
                    Swal.fire('Error', 'No se pudo eliminar la fotografía.', 'error');
                },
            });
        }
    };

    const formatearFecha = (fecha?: string) => {
        if (!fecha) return 'Sin fecha';
        try {
            return format(new Date(fecha), 'dd MMMM yyyy', { locale: es });
        } catch {
            return 'Fecha inválida';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fotografías" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Fotografías de Eventos</h1>
                            <p className="text-gray-600">Gestiona las fotografías de los eventos</p>
                        </div>
                        <Link href="/fotos/create">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                📸 Subir Nueva Foto
                            </Button>
                        </Link>
                    </div>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Total de Fotos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">{fotos.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Página Actual</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {fotos.current_page} de {fotos.last_page}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">Por Página</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">{fotos.per_page}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Grid de fotos */}
                    {fotos.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {fotos.data.map((foto) => (
                                <Card key={foto.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                                        <img
                                            src={foto.url_imagen}
                                            alt={foto.titulo}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/placeholder-image.jpg';
                                            }}
                                        />
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg line-clamp-2">{foto.titulo}</CardTitle>
                                        {foto.descripcion && (
                                            <CardDescription className="line-clamp-2">
                                                {foto.descripcion}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex flex-col gap-2">
                                            <Badge variant="secondary" className="w-fit">
                                                {formatearFecha(foto.fecha_evento)}
                                            </Badge>
                                            <div className="flex gap-2">
                                                <Link href={`/fotos/${foto.id}`}>
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        👁️ Ver
                                                    </Button>
                                                </Link>
                                                <Link href={`/fotos/${foto.id}/edit`}>
                                                    <Button variant="outline" size="sm" className="flex-1">
                                                        ✏️ Editar
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(foto.id, foto.titulo)}
                                                    className="flex-1"
                                                >
                                                    🗑️
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="text-center py-12">
                                <div className="text-gray-500 text-lg mb-4">📸</div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay fotografías</h3>
                                <p className="text-gray-600 mb-4">Sube tu primera fotografía de evento</p>
                                <Link href="/fotos/create">
                                    <Button>Subir Primera Foto</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Paginación */}
                    {fotos.last_page > 1 && (
                        <div className="flex justify-center gap-2">
                            {fotos.prev_page_url && (
                                <Link href={fotos.prev_page_url}>
                                    <Button variant="outline">Anterior</Button>
                                </Link>
                            )}
                            <span className="flex items-center px-4 py-2 text-sm text-gray-700">
                                Página {fotos.current_page} de {fotos.last_page}
                            </span>
                            {fotos.next_page_url && (
                                <Link href={fotos.next_page_url}>
                                    <Button variant="outline">Siguiente</Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
