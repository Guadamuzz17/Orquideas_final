import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type BreadcrumbItem } from '@/types';

interface FotoFormData {
    titulo: string;
    descripcion: string;
    fecha_evento: string;
    imagen: File | null;
}

export default function FotosCreate() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Fotografías', href: '/fotos' },
        { title: 'Subir Nueva Foto', href: '#' },
    ];

    const { data, setData, post, processing, errors, reset } = useForm({
        titulo: '',
        descripcion: '',
        fecha_evento: '',
        imagen: null,
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
        post('/fotos', {
            onSuccess: () => {
                reset();
                setPreviewUrl(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subir Nueva Fotografía" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">📸 Subir Nueva Fotografía</CardTitle>
                            <CardDescription>
                                Agrega una nueva fotografía del evento con su información correspondiente
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
                                            <Label htmlFor="imagen">Imagen *</Label>
                                            <Input
                                                id="imagen"
                                                type="file"
                                                accept="image/jpeg,image/jpg,image/png"
                                                onChange={handleImageChange}
                                                className={errors.imagen ? 'border-red-500' : ''}
                                            />
                                            <p className="text-sm text-gray-600 mt-1">
                                                Formatos soportados: JPG, JPEG, PNG. Máximo 5MB.
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
                                                    />
                                                    <div className="absolute top-2 right-2">
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => {
                                                                setPreviewUrl(null);
                                                                setData('imagen', null);
                                                                // Reset file input
                                                                const fileInput = document.getElementById('imagen') as HTMLInputElement;
                                                                if (fileInput) fileInput.value = '';
                                                            }}
                                                        >
                                                            ✕
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12">
                                                    <div className="text-gray-400 text-4xl mb-2">📸</div>
                                                    <p className="text-gray-500">
                                                        Selecciona una imagen para ver la vista previa
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" disabled={processing} className="flex-1">
                                        {processing ? 'Subiendo...' : '📤 Subir Fotografía'}
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
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
