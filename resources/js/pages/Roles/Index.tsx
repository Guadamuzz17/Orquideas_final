import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, ShieldCheck } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Rol {
    id: number;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
    permisos_count: number;
    usuarios_count: number;
}

interface Props {
    roles: Rol[];
}

export default function Index({ roles }: Props) {
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Gestión de Usuarios', href: '/users' },
        { title: 'Roles y Permisos', href: '/roles' },
    ];

    const handleDelete = (id: number) => {
        router.delete(route('roles.destroy', id), {
            onSuccess: () => {
                toast.success('El rol ha sido eliminado exitosamente');
                setDeleteId(null);
            },
            onError: (errors) => {
                toast.error(errors[0] || 'No se pudo eliminar el rol. Puede que tenga usuarios asignados.');
                setDeleteId(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles y Permisos" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6 md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Roles y Permisos</h1>
                        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gestiona los roles y permisos del sistema</p>
                    </div>
                    <Link href={route('roles.create')} className="w-fit">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Rol
                        </Button>
                    </Link>
                </div>

                <Card className="border-border">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Roles del Sistema
                        </CardTitle>
                        <CardDescription>
                            Gestiona los roles y sus permisos asociados
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6">
                        <div className="overflow-x-auto touch-scroll">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead className="text-center">Estado</TableHead>
                                        <TableHead className="text-center">Permisos</TableHead>
                                        <TableHead className="text-center">Usuarios</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                No hay roles registrados
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        roles.map((rol) => (
                                            <TableRow key={rol.id}>
                                                <TableCell className="font-medium">{rol.nombre}</TableCell>
                                                <TableCell>{rol.descripcion || '-'}</TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={rol.activo ? 'default' : 'secondary'}>
                                                        {rol.activo ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">{rol.permisos_count}</Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline">{rol.usuarios_count}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={route('roles.edit', rol.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setDeleteId(rol.id)}
                                                            disabled={rol.usuarios_count > 0}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. El rol será eliminado permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </div>
        </AppLayout>
    );
}
