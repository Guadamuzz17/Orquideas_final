import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Alert,
    AlertDescription,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    ArrowLeft,
    Save,
    AlertCircle,
    Calendar,
    Mail
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface EditFormData {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    [key: string]: any;
}

interface Props {
    user: User;
}

export default function Edit({ user }: Props) {
    const { data, setData, patch, processing, errors, reset } = useForm<EditFormData>({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

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
            title: 'Editar Usuario',
            href: `/users/${user.id}/edit`,
        },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = { ...data };

        // Si no se va a cambiar la contraseña, remover campos de contraseña
        if (!changePassword) {
            delete submitData.password;
            delete submitData.password_confirmation;
        }

        patch(route('users.update', user.id), {
            onSuccess: () => {
                if (changePassword) {
                    setData('password', '');
                    setData('password_confirmation', '');
                    setChangePassword(false);
                    setShowPassword(false);
                }
            },
        });
    };

    const generatePassword = () => {
        const length = 12;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';

        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        setData('password', password);
        setData('password_confirmation', password);
        setShowPassword(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Usuario - ${user.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="h-6 w-6" />
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Editar Usuario
                        </h2>
                    </div>
                    <Link href={route('users.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto w-full space-y-6">
                    {/* Información del usuario */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Información del Usuario</span>
                                <Badge variant={user.email_verified_at ? "default" : "secondary"}>
                                    {user.email_verified_at ? "Verificado" : "Sin verificar"}
                                </Badge>
                            </CardTitle>
                            <CardDescription>
                                Usuario registrado el {new Date(user.created_at).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Email actual:</span>
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium">Última actualización:</span>
                                    <span>{new Date(user.updated_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulario de edición */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Editar Datos</CardTitle>
                            <CardDescription>
                                Modifique los datos del usuario. Los campos marcados con * son obligatorios.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Mensaje de errores generales */}
                                {Object.keys(errors).length > 0 && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Por favor corrija los errores en el formulario.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre completo *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ingrese el nombre completo"
                                        className={errors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Correo electrónico *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="ejemplo@dominio.com"
                                        className={errors.email ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">{errors.email}</p>
                                    )}
                                    {data.email !== user.email && (
                                        <Alert>
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>
                                                Al cambiar el email, el usuario deberá verificar la nueva dirección.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>

                                {/* Cambiar contraseña */}
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="changePassword"
                                            checked={changePassword}
                                            onChange={(e) => {
                                                setChangePassword(e.target.checked);
                                                if (!e.target.checked) {
                                                    setData('password', '');
                                                    setData('password_confirmation', '');
                                                    setShowPassword(false);
                                                }
                                            }}
                                            className="rounded"
                                        />
                                        <Label htmlFor="changePassword">
                                            Cambiar contraseña
                                        </Label>
                                    </div>

                                    {changePassword && (
                                        <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                                            {/* Nueva contraseña */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="password">Nueva contraseña *</Label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={generatePassword}
                                                    >
                                                        Generar contraseña
                                                    </Button>
                                                </div>
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Mínimo 8 caracteres"
                                                    className={errors.password ? 'border-red-500' : ''}
                                                    required={changePassword}
                                                />
                                                {data.password && (
                                                    <div className="flex items-center space-x-2">
                                                        <input
                                                            type="checkbox"
                                                            id="showPassword"
                                                            checked={showPassword}
                                                            onChange={(e) => setShowPassword(e.target.checked)}
                                                            className="rounded"
                                                        />
                                                        <Label htmlFor="showPassword" className="text-sm">
                                                            Mostrar contraseña
                                                        </Label>
                                                    </div>
                                                )}
                                                {errors.password && (
                                                    <p className="text-red-500 text-sm">{errors.password}</p>
                                                )}
                                            </div>

                                            {/* Confirmar contraseña */}
                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation">Confirmar nueva contraseña *</Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type={showPassword ? "text" : "password"}
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Confirme la nueva contraseña"
                                                    className={errors.password_confirmation ? 'border-red-500' : ''}
                                                    required={changePassword}
                                                />
                                                {errors.password_confirmation && (
                                                    <p className="text-red-500 text-sm">{errors.password_confirmation}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <Link href={route('users.index')}>
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[120px]"
                                    >
                                        {processing ? (
                                            'Guardando...'
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Guardar Cambios
                                            </>
                                        )}
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
