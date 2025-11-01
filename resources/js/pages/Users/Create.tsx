import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
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
import {
    Users,
    ArrowLeft,
    Save,
    AlertCircle
} from 'lucide-react';

interface Rol {
    id: number;
    nombre: string;
}

interface CreateFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    rol_id: number | null;
    [key: string]: any;
}

interface Props {
    roles?: Rol[];
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
    {
        title: 'Crear Usuario',
        href: '/users/create',
    },
];

export default function Create({ roles = [] }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<CreateFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol_id: null,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('users.store'), {
            onSuccess: () => {
                reset();
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
            <Head title="Crear Usuario" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="h-6 w-6" />
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Crear Nuevo Usuario
                        </h2>
                    </div>
                    <Link href={route('users.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                </div>

                {/* Formulario */}
                <div className="max-w-2xl mx-auto w-full">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Usuario</CardTitle>
                            <CardDescription>
                                Complete los datos para crear un nuevo usuario en el sistema.
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
                                </div>

                                {/* Rol */}
                                <div className="space-y-2">
                                    <Label htmlFor="rol_id">Rol (opcional)</Label>
                                    <Select
                                        value={data.rol_id?.toString() || "sin-rol"}
                                        onValueChange={(value) => setData('rol_id', value === "sin-rol" ? null : parseInt(value))}
                                    >
                                        <SelectTrigger className={errors.rol_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sin rol asignado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sin-rol">Sin rol</SelectItem>
                                            {roles.map((rol) => (
                                                <SelectItem key={rol.id} value={rol.id.toString()}>
                                                    {rol.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.rol_id && (
                                        <p className="text-red-500 text-sm">{errors.rol_id}</p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Los usuarios registrados públicamente no tendrán rol asignado
                                    </p>
                                </div>

                                {/* Contraseña */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Contraseña *</Label>
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
                                        required
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
                                    <Label htmlFor="password_confirmation">Confirmar contraseña *</Label>
                                    <Input
                                        id="password_confirmation"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirme la contraseña"
                                        className={errors.password_confirmation ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-red-500 text-sm">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Información adicional */}
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        El usuario recibirá un correo de verificación automáticamente.
                                        Podrá cambiar su contraseña en el primer inicio de sesión.
                                    </AlertDescription>
                                </Alert>

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
                                            'Creando...'
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Crear Usuario
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
