import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Lock } from 'lucide-react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.update'));
    };

    return (
        <AuthLayout title="Nueva Contraseña" description="Sistema de Gestión de Orquídeas">
            <Head title="Restablecer Contraseña" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Nueva Contraseña</h1>
                        <p className="mt-2 text-gray-600">
                            Ingresa tu nueva contraseña para restablecer el acceso a tu cuenta
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-8 shadow-xl">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <Label htmlFor="email">Correo Electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 bg-gray-50"
                                    disabled
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Nueva Contraseña</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1"
                                    placeholder="Mínimo 8 caracteres"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1"
                                    placeholder="Repite la contraseña"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                disabled={processing}
                            >
                                {processing ? 'Actualizando...' : 'Restablecer Contraseña'}
                            </Button>
                        </form>
                    </div>

                    <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm text-green-800">
                        <p className="font-semibold">✅ Consejos de seguridad:</p>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                            <li>Usa al menos 8 caracteres</li>
                            <li>Combina letras mayúsculas y minúsculas</li>
                            <li>Incluye números y símbolos</li>
                            <li>No uses información personal</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
