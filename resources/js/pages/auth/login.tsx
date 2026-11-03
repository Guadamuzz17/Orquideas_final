import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showOrchid, setShowOrchid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowOrchid(true), 800);
        return () => clearTimeout(timer);
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setData(name as keyof typeof data, type === 'checkbox' ? (checked as false) : value);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row relative selection:bg-purple-500 selection:text-white">
            <Head title="Iniciar Sesión - Asociación de Orquideología" />

            {/* Selector de modo oscuro */}
            <div className="absolute top-4 right-4 z-30">
                <AppearanceToggleDropdown className="bg-card/80 dark:bg-card/80 backdrop-blur-md rounded-full border border-border shadow-sm p-0.5" />
            </div>

            {/* Logo UMG - Superior Izquierda */}
            <motion.div
                className="absolute top-4 left-4 z-20"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
            >
                <img src="/images/umg2.png" alt="Universidad Mariano Gálvez" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
            </motion.div>

            {/* Lado Izquierdo - Logo AAO y Orquídea */}
            <div className="hidden lg:flex lg:w-1/2 bg-card/60 dark:bg-card/30 border-r border-border relative overflow-hidden flex-col items-center justify-center p-12">
                <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
                    <div className="absolute top-20 left-20 w-48 h-48 border border-purple-400 rounded-full"></div>
                    <div className="absolute bottom-32 right-16 w-36 h-36 border border-purple-400 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-purple-400 rounded-full"></div>
                </div>

                <div className="flex flex-col items-center justify-center w-full max-w-md relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mb-6"
                    >
                        <img
                            src="/images/Logo-fotor-bg-remover-2024090519443.png"
                            alt="Asociación Altaverapacense de Orquideología"
                            className="w-56 sm:w-64 h-auto object-contain mx-auto drop-shadow-md"
                        />
                    </motion.div>

                    {/* Orquídea Animada */}
                    {showOrchid && (
                        <div className="relative my-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: [0, 1.15, 1],
                                    rotate: [0, 4, -4, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    scale: { times: [0, 0.6, 1], duration: 1.5 },
                                    rotate: { repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" },
                                }}
                                className="text-primary relative z-10"
                            >
                                <svg width="100" height="100" viewBox="0 0 120 120" className="drop-shadow-lg">
                                    <motion.path
                                        d="M60 20 C40 30, 40 50, 60 60 C80 50, 80 30, 60 20 Z"
                                        fill="rgba(168, 85, 247, 0.85)"
                                        initial={{ pathLength: 0, scale: 0 }}
                                        animate={{ pathLength: 1, scale: 1 }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                    />
                                    <motion.path
                                        d="M20 60 C30 40, 50 40, 60 60 C50 80, 30 80, 20 60 Z"
                                        fill="rgba(192, 132, 252, 0.75)"
                                        initial={{ pathLength: 0, scale: 0 }}
                                        animate={{ pathLength: 1, scale: 1 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                    <motion.path
                                        d="M100 60 C90 40, 70 40, 60 60 C70 80, 90 80, 100 60 Z"
                                        fill="rgba(192, 132, 252, 0.75)"
                                        initial={{ pathLength: 0, scale: 0 }}
                                        animate={{ pathLength: 1, scale: 1 }}
                                        transition={{ duration: 1, delay: 0.7 }}
                                    />
                                    <motion.path
                                        d="M60 100 C40 90, 40 70, 60 60 C80 70, 80 90, 60 100 Z"
                                        fill="rgba(216, 180, 254, 0.65)"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.8, delay: 0.9 }}
                                    />
                                    <motion.circle
                                        cx="60"
                                        cy="60"
                                        r="8"
                                        fill="rgba(147, 51, 234, 0.95)"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.4, 1] }}
                                        transition={{ duration: 0.8, delay: 1.1 }}
                                    />
                                </svg>
                            </motion.div>
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="mt-4"
                    >
                        <h3 className="text-xl font-semibold text-foreground">Asociación de Orquideología</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sistema de Juzgamiento y Registro de Exposiciones
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Lado Derecho - Formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 md:p-12 min-h-screen bg-gradient-to-br from-slate-900/10 via-purple-950/10 to-indigo-950/20 dark:from-slate-950 dark:via-purple-950/30 dark:to-background safe-bottom safe-top">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full max-w-md my-auto pt-12 lg:pt-0"
                >
                    {/* Header para móviles */}
                    <div className="lg:hidden text-center mb-6">
                        <img
                            src="/images/Logo-fotor-bg-remover-2024090519443.png"
                            alt="Logo AAO"
                            className="w-24 h-auto object-contain mx-auto mb-3"
                        />
                        <h1 className="text-xl font-bold text-foreground">Asociación de Orquideología</h1>
                    </div>

                    <div className="bg-card text-card-foreground rounded-2xl shadow-xl dark:shadow-2xl border border-border p-6 sm:p-8 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-center mb-6"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1.5">Iniciar Sesión</h2>
                            <p className="text-sm text-muted-foreground">Ingresa tus credenciales para continuar</p>
                        </motion.div>

                        {status && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-4 font-medium text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl"
                            >
                                {status}
                            </motion.div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-4 py-2.5 sm:py-3 text-sm bg-background text-foreground border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all placeholder:text-muted-foreground"
                                    autoComplete="username"
                                    onChange={handleInputChange}
                                    placeholder="admin@orquideas.com"
                                    required
                                />
                                {errors.email && <div className="text-destructive text-xs mt-1.5 font-medium">{errors.email}</div>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="w-full px-4 py-2.5 sm:py-3 pr-11 text-sm bg-background text-foreground border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all placeholder:text-muted-foreground"
                                        autoComplete="current-password"
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <div className="text-destructive text-xs mt-1.5 font-medium">{errors.password}</div>}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={handleInputChange}
                                        className="rounded border-input text-primary shadow-sm focus:ring-primary h-4 w-4"
                                    />
                                    <span className="ml-2 text-xs sm:text-sm text-muted-foreground">Recordarme</span>
                                </label>

                                {canResetPassword && (
                                    <a
                                        href={route('password.request')}
                                        className="text-xs sm:text-sm text-primary hover:underline transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-medium text-sm sm:text-base shadow-lg shadow-purple-500/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 cursor-pointer"
                            >
                                {processing ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
