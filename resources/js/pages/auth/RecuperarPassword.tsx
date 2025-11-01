import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail } from 'lucide-react';

export default function RecuperarPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="Recuperar Contraseña" description="Sistema de Gestión de Orquídeas">
            <Head title="Recuperar Contraseña" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500">
                            <Mail className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Recuperar Contraseña</h1>
                        <p className="mt-2 text-gray-600">
                            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
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
                                    className="mt-1"
                                    autoComplete="username"
                                    placeholder="tu-email@ejemplo.com"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                disabled={processing}
                            >
                                {processing ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href={route('login')}
                                    className="text-sm text-purple-600 hover:text-purple-800"
                                >
                                    ← Volver al inicio de sesión
                                </Link>
                            </div>
                        </form>
                    </div>

                    <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                        <p className="font-semibold">💡 Nota:</p>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                            <li>El enlace expirará en 1 hora</li>
                            <li>Revisa tu bandeja de spam si no lo encuentras</li>
                            <li>Solo puedes usar el enlace una vez</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
