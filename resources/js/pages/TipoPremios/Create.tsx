import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Award, Save, ArrowLeft } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Configuración',
    href: '#',
  },
  {
    title: 'Tipos de Premios',
    href: '/tipo-premios',
  },
  {
    title: 'Crear',
    href: '/tipo-premios/create',
  },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        nombre_premio: string;
        descripcion: string;
        posicion: string;
        color: string;
        activo: boolean;
    }>({
        nombre_premio: '',
        descripcion: '',
        posicion: '',
        color: '#3b82f6',
        activo: true
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route('tipo-premios.store'), {
            onSuccess: () => {
                toast.success('Tipo de premio creado exitosamente');
                router.visit(route('tipo-premios.index'));
            },
            onError: () => {
                toast.error('Por favor corrige los errores en el formulario');
            }
        });
    };

    const predefinedColors = [
        { name: 'Oro', value: '#fbbf24' },
        { name: 'Plata', value: '#9ca3af' },
        { name: 'Bronce', value: '#cd7f32' },
        { name: 'Azul', value: '#3b82f6' },
        { name: 'Verde', value: '#10b981' },
        { name: 'Rojo', value: '#ef4444' },
        { name: 'Púrpura', value: '#8b5cf6' },
        { name: 'Rosa', value: '#ec4899' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Tipo de Premio" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Crear Tipo de Premio</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Define un nuevo tipo de premio o listón</p>
                    </div>
                    <Button variant="outline" onClick={() => router.visit(route('tipo-premios.index'))} className="w-fit">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver
                    </Button>
                </div>

                <Card className="max-w-2xl border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Información del Tipo de Premio
                        </CardTitle>
                        <CardDescription>
                            Complete la información del nuevo tipo de premio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nombre del Premio */}
                            <div className="space-y-2">
                                <Label htmlFor="nombre_premio">Nombre del Premio *</Label>
                                <Input
                                    id="nombre_premio"
                                    value={data.nombre_premio}
                                    onChange={(e) => setData('nombre_premio', e.target.value)}
                                    placeholder="Ej: Primer Lugar"
                                />
                                {errors.nombre_premio && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.nombre_premio}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    rows={3}
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    placeholder="Descripción opcional del premio"
                                />
                                {errors.descripcion && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.descripcion}</p>
                                )}
                            </div>

                            {/* Posición */}
                            <div className="space-y-2">
                                <Label htmlFor="posicion">Posición *</Label>
                                <Input
                                    id="posicion"
                                    type="number"
                                    min="1"
                                    value={data.posicion}
                                    onChange={(e) => setData('posicion', e.target.value)}
                                    placeholder="1"
                                    className="max-w-xs"
                                />
                                <p className="text-sm text-muted-foreground">Orden de visualización del premio</p>
                                {errors.posicion && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.posicion}</p>
                                )}
                            </div>

                            {/* Color */}
                            <div className="space-y-2">
                                <Label>Color *</Label>
                                <div className="flex flex-wrap gap-2">
                                    {predefinedColors.map((colorOption) => (
                                        <button
                                            key={colorOption.value}
                                            type="button"
                                            onClick={() => setData('color', colorOption.value)}
                                            className={`flex items-center gap-2 rounded-md border-2 px-3 py-2 text-sm transition-all ${
                                                data.color === colorOption.value
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                        >
                                            <span
                                                className="h-4 w-4 rounded-full border border-border"
                                                style={{ backgroundColor: colorOption.value }}
                                            ></span>
                                            <span>{colorOption.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="h-10 w-20 cursor-pointer rounded border border-border bg-transparent"
                                    />
                                    <Input
                                        type="text"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="max-w-xs font-mono text-sm"
                                        placeholder="#3b82f6"
                                        maxLength={7}
                                    />
                                </div>
                                {errors.color && (
                                    <p className="text-sm text-red-600 dark:text-red-400">{errors.color}</p>
                                )}
                            </div>

                            {/* Activo */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="activo"
                                    checked={data.activo}
                                    onChange={(e) => setData('activo', e.target.checked)}
                                    className="h-4 w-4 rounded border-border"
                                />
                                <Label htmlFor="activo" className="cursor-pointer">Activo</Label>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit(route('tipo-premios.index'))}
                                    className="w-full sm:w-auto"
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    <Save className="mr-2 h-4 w-4" />
                                    Guardar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
