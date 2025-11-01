import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ChevronLeft, Save } from 'lucide-react';
import Swal from 'sweetalert2';

interface Permiso {
    id: number;
    nombre: string;
    descripcion: string;
    modulo: string;
}

interface PermisosAgrupados {
    [modulo: string]: Permiso[];
}

interface Rol {
    id: number;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
}

interface Props {
    rol: Rol;
    permisos: PermisosAgrupados;
    permisosAsignados: number[];
}

export default function Edit({ rol, permisos, permisosAsignados }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: rol.nombre,
        descripcion: rol.descripcion || '',
        activo: rol.activo as boolean,
        permisos: permisosAsignados,
    });

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gestión de Usuarios', href: '/users' },
        { title: 'Roles y Permisos', href: '/roles' },
        { title: `Editar: ${rol.nombre}`, href: `/roles/${rol.id}/edit` },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('roles.update', rol.id), {
            onSuccess: () => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'El rol ha sido actualizado exitosamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                });
            },
            onError: () => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al actualizar el rol. Verifica los datos.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            },
        });
    };

    const togglePermiso = (permisoId: number) => {
        setData(
            'permisos',
            data.permisos.includes(permisoId)
                ? data.permisos.filter((id) => id !== permisoId)
                : [...data.permisos, permisoId]
        );
    };

    const toggleModulo = (modulo: string) => {
        const permisosDelModulo = permisos[modulo].map((p) => p.id);
        const todosSeleccionados = permisosDelModulo.every((id) => data.permisos.includes(id));

        if (todosSeleccionados) {
            setData(
                'permisos',
                data.permisos.filter((id) => !permisosDelModulo.includes(id))
            );
        } else {
            setData('permisos', [...new Set([...data.permisos, ...permisosDelModulo])]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Rol - ${rol.nombre}`} />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 sm:p-10">
                    <form onSubmit={handleSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Información del Rol</CardTitle>
                                <CardDescription>
                                    Actualiza el nombre, descripción y permisos del rol
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">Nombre del Rol *</Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Ej: Digitador, Administrador"
                                        className={errors.nombre ? 'border-destructive' : ''}
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-destructive">{errors.nombre}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        placeholder="Descripción breve del rol..."
                                        rows={3}
                                    />
                                    {errors.descripcion && (
                                        <p className="text-sm text-destructive">{errors.descripcion}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="activo">Estado del Rol</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Define si el rol está activo o inactivo
                                        </p>
                                    </div>
                                    <Switch
                                        id="activo"
                                        checked={data.activo}
                                        onCheckedChange={(checked: boolean) => setData('activo', checked)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label>Permisos Asignados</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Selecciona los permisos que tendrá este rol
                                    </p>

                                    <div className="space-y-4">
                                        {Object.entries(permisos).map(([modulo, permisosModulo]) => {
                                            const todosSeleccionados = permisosModulo.every((p) =>
                                                data.permisos.includes(p.id)
                                            );

                                            return (
                                                <div key={modulo} className="rounded-lg border p-4">
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <Checkbox
                                                            id={`modulo-${modulo}`}
                                                            checked={todosSeleccionados}
                                                            onCheckedChange={() => toggleModulo(modulo)}
                                                        />
                                                        <Label
                                                            htmlFor={`modulo-${modulo}`}
                                                            className="font-semibold"
                                                        >
                                                            {modulo}
                                                        </Label>
                                                    </div>
                                                    <div className="ml-6 space-y-2">
                                                        {permisosModulo.map((permiso) => (
                                                            <div
                                                                key={permiso.id}
                                                                className="flex items-start gap-2"
                                                            >
                                                                <Checkbox
                                                                    id={`permiso-${permiso.id}`}
                                                                    checked={data.permisos.includes(permiso.id)}
                                                                    onCheckedChange={() => togglePermiso(permiso.id)}
                                                                />
                                                                <div className="grid gap-1">
                                                                    <Label
                                                                        htmlFor={`permiso-${permiso.id}`}
                                                                        className="text-sm font-normal"
                                                                    >
                                                                        {permiso.descripcion}
                                                                    </Label>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {permiso.nombre}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="mt-6 flex justify-end gap-4">
                            <Link href={route('roles.index')}>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Guardando...' : 'Actualizar Rol'}
                            </Button>
                        </div>
                    </form>
            </div>
        </AppLayout>
    );
}
