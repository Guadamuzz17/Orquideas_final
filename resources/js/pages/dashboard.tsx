import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Leaf,
  Award,
  BarChart3,
  Calendar,
  ChevronRight,
  Home,
  Trophy,
  FileText,
  UserPlus,
  FolderTree,
  Tags,
  Settings,
} from "lucide-react";
//comentario
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  color: "blue" | "green"
  icon: React.ReactNode
}

interface ActionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  onClick?: () => void
}

const StatCard = ({ title, value, subtitle, color, icon }: StatCardProps) => {
  const colorClasses = {
    blue: "from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 shadow-blue-500/20 dark:shadow-none",
    green: "from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-900 shadow-emerald-500/20 dark:shadow-none",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute top-8 right-8 w-8 h-8 border border-white rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-medium opacity-90">{title}</h3>
          <div className="p-2.5 bg-white/20 dark:bg-black/20 rounded-xl backdrop-blur-sm">{icon}</div>
        </div>
        <div className="space-y-1 md:space-y-2">
          <p className="text-2xl md:text-3xl font-bold tracking-tight">{value}</p>
          <p className="text-xs md:text-sm opacity-80">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  )
}

const ActionCard = ({ title, description, icon, color, onClick }: ActionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card text-card-foreground rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-xl dark:shadow-black/40 transition-all duration-300 cursor-pointer border border-border hover:border-primary/50 group relative overflow-hidden"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>

      <div className="relative z-10">
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}
        >
          {icon}
        </div>
        <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
      </div>
    </motion.div>
  )
}

interface DashboardProps {
  stats?: {
    participantes: number;
    orquideas: number;
    year: number;
  };
  eventoActivo?: {
    id: number;
    nombre: string;
  };
}

export default function Dashboard({ stats, eventoActivo }: DashboardProps) {
  // Valores por defecto en caso de que no se pasen los stats
  const defaultStats = {
    participantes: 0,
    orquideas: 0,
    year: new Date().getFullYear()
  };

  const currentStats = stats || defaultStats;
  const statsCards = [
    {
      title: eventoActivo ? `Participantes - ${eventoActivo.nombre}` : `Participantes Registrados (${currentStats.year})`,
      value: currentStats.participantes.toLocaleString(),
      subtitle: currentStats.participantes === 1 ? "Participante" : "Participantes",
      color: "blue" as const,
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: eventoActivo ? `Orquídeas - ${eventoActivo.nombre}` : `Orquídeas Registradas (${currentStats.year})`,
      value: currentStats.orquideas.toLocaleString(),
      subtitle: currentStats.orquideas === 1 ? "Orquídea" : "Orquídeas",
      color: "green" as const,
      icon: <Leaf className="w-6 h-6" />,
    },
  ]

  const actions = [
    {
      title: "Participantes",
      description:
        "Gestiona los perfiles y administra la información de los participantes del sistema.",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      onClick: () => router.visit(route('participantes.index')),
    },
    {
      title: "Catálogo de Orquídeas",
      description: "Registra, edita y administra el catálogo completo de orquídeas en el sistema.",
      icon: <Leaf className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      onClick: () => router.visit(route('orquideas.index')),
    },
    {
      title: "Grupos de Clasificación",
      description: "Gestiona los grupos y categorías principales de clasificación de orquídeas.",
      icon: <FolderTree className="w-6 h-6" />,
      color: "from-orange-500 to-red-500",
      onClick: () => router.visit(route('grupos.index')),
    },
    {
      title: "Clases de Orquídeas",
      description: "Administra las clases específicas de orquídeas dentro de cada grupo.",
      icon: <Tags className="w-6 h-6" />,
      color: "from-violet-500 to-purple-600",
      onClick: () => router.visit(route('clases.index')),
    },
    {
      title: "Inscripciones al Concurso",
      description: "Inscribe las orquídeas al concurso y gestiona el proceso de registro completo.",
      icon: <UserPlus className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500",
      onClick: () => router.visit(route('inscripcion.index')),
    },
    {
      title: "Designar Ganadores",
      description: "Sistema de evaluación y juzgamiento para determinar los ganadores de las competiciones.",
      icon: <Award className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      onClick: () => router.visit(route('ganadores.index')),
    },
    {
      title: "Reportes por Eventos",
      description: "Genera reportes específicos del evento activo con filtros y análisis detallados.",
      icon: <FileText className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      onClick: () => router.visit(route('reportes.evento.index')),
    },
    {
      title: "Reportes y Estadísticas",
      description: "Consulta reportes detallados, estadísticas y análisis completos del registro de orquídeas.",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      onClick: () => router.visit(route('reportes.index')),
    },
    {
      title: "Formatos y Documentos",
      description: "Accede y descarga los formatos necesarios para el registro y evaluación.",
      icon: <FileText className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500",
      onClick: () => {
        // Descargar el PDF FormatoInscripcion.pdf
        const link = document.createElement('a');
        link.href = '/docsDonwload/FormatoInscripcion.pdf';
        link.download = 'FormatoInscripcion.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    },
    {
      title: "Gestión de Usuarios",
      description: "Administra las cuentas de usuario del sistema, permisos y configuraciones de acceso.",
      icon: <Settings className="w-6 h-6" />,
      color: "from-gray-500 to-gray-600",
      onClick: () => router.visit(route('users.index')),
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">

        {/* Banner de Evento Activo */}
        {eventoActivo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-800 dark:via-purple-900 dark:to-indigo-950 text-white rounded-2xl shadow-lg p-5 md:p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/20 dark:bg-black/30 rounded-xl backdrop-blur-sm">
                  <Calendar className="h-6 w-6 flex-shrink-0" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-medium opacity-90">Evento Activo:</p>
                  <h3 className="text-lg md:text-xl font-bold">{eventoActivo.nombre}</h3>
                </div>
              </div>
              <button
                onClick={() => router.visit(route('eventos.index'))}
                className="bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 transition-colors px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 whitespace-nowrap backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" />
                Salir de Evento
              </button>
            </div>
          </motion.div>
        )}

        {/* Logos superiores */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 py-4">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/images/Logo-fotor-bg-remover-2024090519443.png"
            alt="AAO"
            className="h-20 sm:h-24 w-auto object-contain"
          />
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/images/umg2.png"
            alt="UMG"
            className="h-20 sm:h-24 w-auto object-contain"
          />
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            >
              <ActionCard {...action} />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>Sistema de Gestión de Orquídeas - {currentStats.year}</span>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="bg-card text-card-foreground py-6 mt-8 rounded-2xl border border-border/80 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Información de los creadores */}
              <div className="text-center md:text-left">
                <h5 className="font-semibold text-foreground mb-3">Creado y Diseñado por:</h5>
                <ul className="list-none space-y-1 text-sm text-muted-foreground">
                  <li>Pablo Andrés Santos González</li>
                  <li>Isaac Andony Guadamuz Ruiz</li>
                  <li>Selvyn Alberto Contreras Alvarado</li>
                  <li>Stephany Lissethe Ramírez González</li>
                </ul>
              </div>

              {/* Redes sociales y derechos */}
              <div className="text-center flex items-center justify-center">
                <p className="text-sm text-muted-foreground">© 2024 Ingeniería en Sistemas - Plan Diario <b className="text-foreground">UMG Campus Cobán</b></p>
              </div>

              {/* Información de ubicación y logo */}
              <div className="flex flex-col sm:flex-row justify-center md:justify-end items-center gap-4">
                <div className="text-center md:text-right">
                  <h5 className="font-bold text-foreground">A.A.O</h5>
                  <p className="mb-0 text-sm text-muted-foreground">Cobán</p>
                  <p className="mb-0 text-sm text-muted-foreground">Alta Verapaz</p>
                  <p className="text-sm text-muted-foreground">Guatemala</p>
                </div>
                <img
                  src="/images/SISTEMAS_UMG-removebg-preview.png"
                  alt="Logo Universidad"
                  className="w-36 sm:w-44 md:w-52 object-contain opacity-90 dark:opacity-80 dark:brightness-110"
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}
