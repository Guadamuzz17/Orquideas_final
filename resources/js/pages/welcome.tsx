import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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

    useEffect(() => {
        const timer = setTimeout(() => setShowOrchid(true), 1000);
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
        <div className="min-h-screen bg-white flex">
            <Head title="Iniciar Sesión" />

            {/* Logo UMG - Superior Izquierda */}
            <motion.div
                className="absolute top-6 left-6 z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <img src="/images/umg2.png" alt="Universidad Mariano Gálvez" className="w-20 h-20 object-contain" />
            </motion.div>

            {/* Lado Izquierdo - Logo AAO y Orquídea */}
            <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-48 h-48 border border-blue-300 rounded-full"></div>
                    <div className="absolute bottom-32 right-16 w-36 h-36 border border-blue-300 rounded-full"></div>
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-blue-300 rounded-full"></div>
                </div>

                <div className="flex flex-col items-center justify-center w-full p-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="mb-8"
                    >
                        <img
                            src="/images/Logo-fotor-bg-remover-2024090519443.png"
                            alt="Asociación Altaverapacense de Orquideología"
                            className="w-64 h-auto object-contain"
                        />
                    </motion.div>

                    {/* Orquídea Animada con efecto de polvo */}
                    {showOrchid && (
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: [0, 1.2, 1],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    scale: {
                                        times: [0, 0.6, 1],
                                        duration: 1.5,
                                    },
                                    rotate: {
                                        repeat: Number.POSITIVE_INFINITY,
                                        duration: 4,
                                        ease: "easeInOut",
                                    },
                                }}
                                className="text-purple-500 relative z-10"
                            >
                                <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
                                    <motion.path
                                        d="M60 20 C40 30, 40 50, 60 60 C80 50, 80 30, 60 20 Z"
                                        fill="rgba(147, 51, 234, 0.8)"
                                        initial={{ pathLength: 0, scale: 0 }}
                                        animate={{ pathLength: 1, scale: 1 }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                    />
                                    <motion.path
                                        d="M20 60 C30 40, 50 40, 60 60 C50 80, 30 80, 20 60 Z"
                                        fill="rgba(168, 85, 247, 0.7)"
                                        initial={{ pathLength: 0, scale: 0 }}
                                        animate={{ pathLength: 1, scale: 1 }}
                                        transition={{ duration: 1, delay: 0.7 }}
                                    />
                                    <motion.path
                                        d="M100 60 C90 40, 70 40, 60 60 C70 80, 90 80, 100 60 Z"
                                        fill="rgba(168, 85, 247, 0.7)"
                                        initial={{ pathLength: 0, scale: 0 }}
                                        animate={{ pathLength: 1, scale: 1 }}
                                        transition={{ duration: 1, delay: 0.9 }}
                                    />
                                    <motion.path
                                        d="M60 100 C40 90, 40 70, 60 60 C80 70, 80 90, 60 100 Z"
                                        fill="rgba(192, 132, 252, 0.6)"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.8, delay: 1.1 }}
                                    />
                                    <motion.circle
                                        cx="60"
                                        cy="60"
                                        r="8"
                                        fill="rgba(126, 34, 206, 0.9)"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.5, 1] }}
                                        transition={{ duration: 0.8, delay: 1.3 }}
                                    />
                                </svg>
                            </motion.div>

                            {/* Partículas de polvo mágico */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-purple-400 rounded-full"
                                    style={{
                                        left: "50%",
                                        top: "50%",
                                    }}
                                    initial={{
                                        scale: 0,
                                        x: 0,
                                        y: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        scale: [0, 1, 0.5, 0],
                                        x: [
                                            0,
                                            Math.cos((i * 30 * Math.PI) / 180) * (40 + Math.random() * 30),
                                            Math.cos((i * 30 * Math.PI) / 180) * (60 + Math.random() * 40),
                                        ],
                                        y: [
                                            0,
                                            Math.sin((i * 30 * Math.PI) / 180) * (40 + Math.random() * 30),
                                            Math.sin((i * 30 * Math.PI) / 180) * (60 + Math.random() * 40),
                                        ],
                                        opacity: [0, 0.8, 0.4, 0],
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        delay: 1.5 + i * 0.1,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatDelay: 2 + Math.random() * 3,
                                        ease: "easeOut",
                                    }}
                                />
                            ))}

                            {/* Partículas más pequeñas y rápidas */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={`small-${i}`}
                                    className="absolute w-1 h-1 bg-purple-300 rounded-full"
                                    style={{
                                        left: "50%",
                                        top: "50%",
                                    }}
                                    initial={{
                                        scale: 0,
                                        x: 0,
                                        y: 0,
                                        opacity: 0,
                                    }}
                                    animate={{
                                        scale: [0, 1, 0],
                                        x: [0, Math.cos((i * 45 * Math.PI) / 180) * (20 + Math.random() * 25)],
                                        y: [0, Math.sin((i * 45 * Math.PI) / 180) * (20 + Math.random() * 25)],
                                        opacity: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 1.5 + Math.random(),
                                        delay: 2 + i * 0.15,
                                        repeat: Number.POSITIVE_INFINITY,
                                        repeatDelay: 1.5 + Math.random() * 2,
                                        ease: "easeOut",
                                    }}
                                />
                            ))}

                            {/* Brillo central */}
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.3, 0] }}
                                transition={{
                                    duration: 2,
                                    delay: 1.8,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 3,
                                }}
                            >
                                <div className="w-24 h-24 bg-purple-400 rounded-full blur-xl opacity-30" />
                            </motion.div>
                        </div>
                    )}

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                        className="text-blue-800 text-center text-lg font-light mt-6"
                    >
                        Bienvenido al Sistema de AAO
                    </motion.p>
                </div>
            </div>

            {/* Lado Derecho - Formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-600 to-blue-800">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mb-8"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h2>
                            <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
                        </motion.div>

                        {status && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-lg"
                            >
                                {status}
                            </motion.div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Correo Electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                    autoComplete="username"
                                    onChange={handleInputChange}
                                    placeholder="tu@email.com"
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                    autoComplete="current-password"
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                />
                                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                className="flex items-center justify-between"
                            >
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={handleInputChange}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                                </label>

                                {canResetPassword && (
                                    <a
                                        href={route('password.request')}
                                        className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                )}
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                            >
                                {processing ? "Iniciando sesión..." : "Iniciar Sesión"}
                            </motion.button>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-gray-600">
                                ¿No tienes una cuenta?{" "}
                                <a
                                    href={route('register')}
                                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                                >
                                    Regístrate aquí
                                </a>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}