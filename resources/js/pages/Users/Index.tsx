import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Users,
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    KeyRound,
    Filter
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
        verified?: string;
        sort?: string;
        direction?: string;
    };
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Gestión de Usuarios',
        href: '/users',
    },
];

export default function Index({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [verified, setVerified] = useState(filters.verified || 'all');
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [processing, setProcessing] = useState(false);

    // Aplicar filtros
    const applyFilters = () => {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (verified !== 'all') params.set('verified', verified);

        router.get(route('users.index'), Object.fromEntries(params));
    };

    // Limpiar filtros
    const clearFilters = () => {
        setSearch('');
        setVerified('all');
        router.get(route('users.index'));
    };

    // Eliminar usuario
    const handleDelete = (user: User) => {
        setDeleteUser(user);
    };

    const confirmDelete = () => {
        if (!deleteUser) return;

        setProcessing(true);
        router.delete(route('users.destroy', deleteUser.id), {
            onFinish: () => {
                setProcessing(false);
                setDeleteUser(null);
            },
        });
    };

    // Cambiar verificación
    const toggleVerification = (user: User) => {
        router.patch(route('users.toggle-verification', user.id), {}, {
            preserveScroll: true,
        });
    };

    // Reset password
    const resetPassword = (user: User) => {
        router.patch(route('users.reset-password', user.id), {}, {
            preserveScroll: true,
        });
    };

    // Estadísticas resumidas
    const stats = useMemo(() => {
        const total = users.total;
        const verified = users.data.filter(user => user.email_verified_at).length;
        const unverified = users.data.filter(user => !user.email_verified_at).length;

        return { total, verified, unverified };
    }, [users]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="h-6 w-6" />
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Gestión de Usuarios
                        </h2>
                    </div>
                    <Link href={route('users.create')}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Usuario
                        </Button>
                    </Link>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Verificados</CardTitle>
                            <UserCheck className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sin Verificar</CardTitle>
                            <UserX className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.unverified}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Filter className="h-4 w-4" />
                            <span>Filtros</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Input
                                    placeholder="Buscar por nombre o email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                />
                            </div>

                            <Select value={verified} onValueChange={setVerified}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Estado de verificación" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="verified">Verificados</SelectItem>
                                    <SelectItem value="unverified">Sin verificar</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex space-x-2">
                                <Button onClick={applyFilters} className="flex-1">
                                    <Search className="h-4 w-4 mr-2" />
                                    Filtrar
                                </Button>
                                <Button onClick={clearFilters} variant="outline">
                                    Limpiar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de usuarios */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usuarios Registrados</CardTitle>
                        <CardDescription>
                            Mostrando {users.data.length} de {users.total} usuarios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.data.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{user.name}</h3>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            <p className="text-xs text-gray-400">
                                                Registrado: {new Date(user.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Badge variant={user.email_verified_at ? "default" : "secondary"}>
                                            {user.email_verified_at ? "Verificado" : "Sin verificar"}
                                        </Badge>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('users.show', user.id)}>
                                                        <Users className="h-4 w-4 mr-2" />
                                                        Ver detalles
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={route('users.edit', user.id)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => toggleVerification(user)}
                                                >
                                                    {user.email_verified_at ? (
                                                        <>
                                                            <UserX className="h-4 w-4 mr-2" />
                                                            Desverificar
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserCheck className="h-4 w-4 mr-2" />
                                                            Verificar
                                                        </>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => resetPassword(user)}
                                                >
                                                    <KeyRound className="h-4 w-4 mr-2" />
                                                    Reset contraseña
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(user)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}

                            {users.data.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No se encontraron usuarios con los filtros aplicados.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Paginación */}
                {users.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex space-x-1">
                            {users.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Dialog de confirmación de eliminación */}
            <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el usuario{' '}
                            <strong>{deleteUser?.name}</strong> y todos sus datos asociados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={processing}
                        >
                            {processing ? 'Eliminando...' : 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
