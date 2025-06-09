import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showOrchid, setShowOrchid] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowOrchid(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof typeof data, value);
    };

    return (
        <div className="min-h-screen bg-white flex">
            <Head title="Registro" />

            {/* Logo UMG - Superior Izquierda */}
            <motion.div
                className="absolute top-6 left-6 z-10"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
            >
                <img src="/images/umg2.png" alt="Universidad Mariano Gálvez" className="w-20 h-20 object-contain" />
            </motion.div>

            {/* Lado Izquierdo - Logo AAO */}
            <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden">
                {/* Patrón de fondo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-32 h-32 border border-blue-300 rounded-full"></div>
                    <div className="absolute bottom-32 left-16 w-24 h-24 border border-blue-300 rounded-full"></div>
                    <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-blue-300 rounded-full"></div>
                </div>

                <div className="flex flex-col items-center justify-center w-full p-12 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="mb-8"
                    >
                        <img
                            src="/images/Logo-fotor-bg-remover-2024090519443.png"
                            alt="Asociación Altaverapacense de Orquideología"
                            className="w-64 h-auto object-contain"
                        />
                    </motion.div>

                    {/* Orquídea Animada */}
                    {showOrchid && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, rotate: -10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                rotate: 0,
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                scale: {
                                    repeat: Number.POSITIVE_INFINITY,
                                    duration: 3,
                                    ease: "easeInOut",
                                },
                            }}
                            className="text-purple-500"
                        >
                            <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-lg">
                                <motion.path
                                    d="M60 20 C40 30, 40 50, 60 60 C80 50, 80 30, 60 20 Z"
                                    fill="rgba(147, 51, 234, 0.8)"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, delay: 1 }}
                                />
                                <motion.path
                                    d="M20 60 C30 40, 50 40, 60 60 C50 80, 30 80, 20 60 Z"
                                    fill="rgba(168, 85, 247, 0.7)"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, delay: 1.2 }}
                                />
                                <motion.path
                                    d="M100 60 C90 40, 70 40, 60 60 C70 80, 90 80, 100 60 Z"
                                    fill="rgba(168, 85, 247, 0.7)"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 2, delay: 1.4 }}
                                />
                                <motion.path
                                    d="M60 100 C40 90, 40 70, 60 60 C80 70, 80 90, 60 100 Z"
                                    fill="rgba(192, 132, 252, 0.6)"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 2 }}
                                />
                                <motion.circle
                                    cx="60"
                                    cy="60"
                                    r="8"
                                    fill="rgba(126, 34, 206, 0.9)"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.5, delay: 2 }}
                                />
                            </svg>
                        </motion.div>
                    )}

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="text-blue-800 text-center text-lg font-light mt-8"
                    >
                        Únete a nuestra comunidad
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
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h2>
                            <p className="text-gray-600">Completa los datos para registrarte</p>
                        </motion.div>

                        <form onSubmit={submit} className="space-y-6">
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre Completo
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                    autoComplete="name"
                                    onChange={handleInputChange}
                                    placeholder="Tu nombre completo"
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
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
                                    required
                                />
                                {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                    autoComplete="new-password"
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                            </motion.div>

                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-black"
                                    autoComplete="new-password"
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                    required
                                />
                                {errors.password_confirmation && (
                                    <div className="text-red-500 text-sm mt-1">{errors.password_confirmation}</div>
                                )}
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={processing}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                            >
                                {processing ? "Creando cuenta..." : "Crear Cuenta"}
                            </motion.button>
                        </form>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.1 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-gray-600">
                                ¿Ya tienes una cuenta?{" "}
                                <a
                                    href={route('login')}
                                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                                >
                                    Inicia sesión aquí
                                </a>
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}