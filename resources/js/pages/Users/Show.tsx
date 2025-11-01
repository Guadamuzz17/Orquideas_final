import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Users,
    ArrowLeft,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    KeyRound,
    Mail,
    Calendar,
    Clock
} from 'lucide-react';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    user: User;
}

export default function Show({ user }: Props) {
    const [processing, setProcessing] = useState(false);

    const breadcrumbs = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Gestión de Usuarios',
            href: '/users',
        },
        {
            title: user.name,
            href: `/users/${user.id}`,
        },
    ];

    // Cambiar verificación
    const toggleVerification = () => {
        setProcessing(true);
        router.patch(route('users.toggle-verification', user.id), {}, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    // Reset password
    const resetPassword = () => {
        setProcessing(true);
        router.patch(route('users.reset-password', user.id), {}, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    // Eliminar usuario
    const deleteUser = () => {
        setProcessing(true);
        router.delete(route('users.destroy', user.id), {
            onFinish: () => setProcessing(false),
        });
    };

    // Calcular tiempo transcurrido
    const getTimeAgo = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Hace menos de un minuto';
        if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
        if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
        if (diffInSeconds < 2592000) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
        if (diffInSeconds < 31536000) return `Hace ${Math.floor(diffInSeconds / 2592000)} meses`;
        return `Hace ${Math.floor(diffInSeconds / 31536000)} años`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Usuario - ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="h-6 w-6" />
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Detalles del Usuario
                        </h2>
                    </div>
                    <div className="flex space-x-3">
                        <Link href={route('users.edit', user.id)}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </Button>
                        </Link>
                        <Link href={route('users.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto w-full space-y-6">
                    {/* Información principal */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 font-bold text-xl">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                                        <CardDescription className="text-lg">{user.email}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant={user.email_verified_at ? "default" : "secondary"} className="text-sm">
                                    {user.email_verified_at ? "Verificado" : "Sin verificar"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Información de contacto */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Información de Contacto</h3>

                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Correo electrónico</p>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <UserCheck className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Estado de verificación</p>
                                            <p className="text-sm text-gray-600">
                                                {user.email_verified_at
                                                    ? `Verificado el ${new Date(user.email_verified_at).toLocaleDateString()}`
                                                    : 'Correo sin verificar'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Información de actividad */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg border-b pb-2">Información de Actividad</h3>

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Fecha de registro</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(user.created_at).toLocaleDateString()} a las{' '}
                                                {new Date(user.created_at).toLocaleTimeString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {getTimeAgo(user.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Clock className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">Última actualización</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(user.updated_at).toLocaleDateString()} a las{' '}
                                                {new Date(user.updated_at).toLocaleTimeString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {getTimeAgo(user.updated_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Acciones administrativas */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones Administrativas</CardTitle>
                            <CardDescription>
                                Gestione la cuenta del usuario desde aquí.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Cambiar verificación */}
                                <Button
                                    variant="outline"
                                    onClick={toggleVerification}
                                    disabled={processing}
                                    className="h-auto p-4 text-left justify-start"
                                >
                                    <div className="flex items-center space-x-3">
                                        {user.email_verified_at ? (
                                            <UserX className="h-5 w-5 text-orange-600" />
                                        ) : (
                                            <UserCheck className="h-5 w-5 text-green-600" />
                                        )}
                                        <div>
                                            <p className="font-medium">
                                                {user.email_verified_at ? 'Desverificar' : 'Verificar'} Usuario
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {user.email_verified_at
                                                    ? 'Marcar email como no verificado'
                                                    : 'Marcar email como verificado'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </Button>

                                {/* Reset contraseña */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            disabled={processing}
                                            className="h-auto p-4 text-left justify-start"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <KeyRound className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <p className="font-medium">Reset Contraseña</p>
                                                    <p className="text-sm text-gray-500">
                                                        Generar nueva contraseña temporal
                                                    </p>
                                                </div>
                                            </div>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Reset la contraseña?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Se generará una nueva contraseña temporal y se enviará al usuario por correo electrónico.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={resetPassword}>
                                                Confirmar Reset
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                                {/* Eliminar usuario */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            disabled={processing}
                                            className="h-auto p-4 text-left justify-start border-red-200 hover:border-red-300"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Trash2 className="h-5 w-5 text-red-600" />
                                                <div>
                                                    <p className="font-medium text-red-600">Eliminar Usuario</p>
                                                    <p className="text-sm text-gray-500">
                                                        Eliminar permanentemente la cuenta
                                                    </p>
                                                </div>
                                            </div>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
                                                <strong>{user.name}</strong> y todos sus datos asociados.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={deleteUser}
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Eliminar Usuario
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
