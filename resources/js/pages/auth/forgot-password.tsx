import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout
            title="Recuperar contraseña"
            description="Ingresa tu correo para recibir un enlace de restablecimiento"
        >
            <Head title="Recuperar Contraseña" />

            {status && (
                <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3 text-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="email"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="ejemplo@correo.com"
                            className="h-11"
                            required
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6">
                        <Button className="w-full h-11" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Enviar enlace de recuperación
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>¿Recordaste tu contraseña?</span>
                    <TextLink href={route('login')}>Iniciar sesión</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
