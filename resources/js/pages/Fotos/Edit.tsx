import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';

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

export default function FotosEdit({ foto }: PageProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(foto.url_imagen);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Fotografías', href: '/fotos' },
        { title: foto.titulo, href: `/fotos/${foto.id}` },
        { title: 'Editar', href: '#' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        titulo: foto.titulo,
        descripcion: foto.descripcion || '',
        fecha_evento: foto.fecha_evento || '',
        imagen: null as File | null,
        _method: 'PUT',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('imagen', file as any);

            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/fotos/${foto.id}`);
    };

    const resetImage = () => {
        setPreviewUrl(foto.url_imagen);
        setData('imagen', null);
        // Reset file input
        const fileInput = document.getElementById('imagen') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Fotografía: ${foto.titulo}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">✏️ Editar Fotografía</CardTitle>
                            <CardDescription>
                                Modifica la información de la fotografía "{foto.titulo}"
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Columna izquierda - Formulario */}
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="titulo">Título *</Label>
                                            <Input
                                                id="titulo"
                                                type="text"
                                                value={data.titulo}
                                                onChange={(e) => setData('titulo', e.target.value)}
                                                placeholder="Ej: Festival de Primavera 2025"
                                                className={errors.titulo ? 'border-red-500' : ''}
                                            />
                                            {errors.titulo && (
                                                <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="descripcion">Descripción</Label>
                                            <Textarea
                                                id="descripcion"
                                                value={data.descripcion}
                                                onChange={(e) => setData('descripcion', e.target.value)}
                                                placeholder="Describe el evento o la fotografía..."
                                                rows={4}
                                                className={errors.descripcion ? 'border-red-500' : ''}
                                            />
                                            {errors.descripcion && (
                                                <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="fecha_evento">Fecha del Evento</Label>
                                            <Input
                                                id="fecha_evento"
                                                type="date"
                                                value={data.fecha_evento}
                                                onChange={(e) => setData('fecha_evento', e.target.value)}
                                                className={errors.fecha_evento ? 'border-red-500' : ''}
                                            />
                                            {errors.fecha_evento && (
                                                <p className="text-red-500 text-sm mt-1">{errors.fecha_evento}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="imagen">Cambiar Imagen (Opcional)</Label>
                                            <Input
                                                id="imagen"
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png"
                                                onChange={handleImageChange}
                                                className={errors.imagen ? 'border-red-500' : ''}
                                            />
                                            <p className="text-sm text-gray-600 mt-1">
                                                Deja en blanco para mantener la imagen actual. Formatos: JPG, JPEG, PNG. Máximo 5MB.
                                            </p>
                                            {errors.imagen && (
                                                <p className="text-red-500 text-sm mt-1">{errors.imagen}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Columna derecha - Preview */}
                                    <div>
                                        <Label>Vista Previa</Label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mt-2">
                                            {previewUrl ? (
                                                <div className="relative">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Vista previa"
                                                        className="w-full h-64 object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/images/placeholder-image.jpg';
                                                        }}
                                                    />
                                                    {data.imagen && (
                                                        <div className="absolute top-2 right-2">
                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={resetImage}
                                                            >
                                                                ↺ Restaurar
                                                            </Button>
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-2 left-2">
                                                        <span className="bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                            {data.imagen ? 'Nueva imagen' : 'Imagen actual'}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="text-gray-400 text-4xl mb-2">📸</div>
                                                    <p className="text-gray-500">
                                                        No se pudo cargar la imagen
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" disabled={processing} className="flex-1">
                                        {processing ? 'Guardando...' : '💾 Guardar Cambios'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                </div>

                                {/* Información adicional */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">ℹ️ Información de la fotografía</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">ID:</span> #{foto.id}
                                        </div>
                                        <div>
                                            <span className="font-medium">Archivo actual:</span> {foto.ruta_imagen.split('/').pop()}
                                        </div>
                                        <div>
                                            <span className="font-medium">Subida:</span> {new Date(foto.created_at).toLocaleDateString()}
                                        </div>
                                        <div>
                                            <span className="font-medium">Última modificación:</span> {new Date(foto.updated_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
