import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { motion } from "framer-motion";
import {
  Users,
  Plus,
  Leaf,
  Award,
  BarChart3,
  Search,
  Calendar,
  Eye,
  ChevronRight,
  Home,
  Trophy,
  FileText,
  UserPlus,
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
    blue: "from-blue-500 to-blue-600 shadow-blue-200",
    green: "from-green-500 to-green-600 shadow-green-200",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 text-white shadow-lg ${colorClasses[color].split(" ")[2]} relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white rounded-full"></div>
        <div className="absolute top-8 right-8 w-8 h-8 border border-white rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium opacity-90">{title}</h3>
          <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
        </div>
        <div className="space-y-2">
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm opacity-80">{subtitle}</p>
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
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group relative overflow-hidden"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>

      <div className="relative z-10">
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">
          {description}
        </p>
      </div>

      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const currentYear = new Date().getFullYear()

  const stats = [
    {
      title: `Participantes Registrados (${currentYear})`,
      value: "0",
      subtitle: "Participantes",
      color: "blue" as const,
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: `Orquídeas Registradas (${currentYear})`,
      value: "0",
      subtitle: "Orquídeas",
      color: "green" as const,
      icon: <Leaf className="w-6 h-6" />,
    },
  ]

  const actions = [
    {
      title: "Participantes",
      description:
        "Gestiona los perfiles de los usuarios y administra la información de los participantes del sistema.",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      onClick: () => console.log("Navegando a Participantes"),
    },
    {
      title: "Gestionar Orquídeas",
      description: "Registra, edita y administra el catálogo completo de orquídeas en el sistema.",
      icon: <Plus className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      onClick: () => console.log("Navegando a Gestionar Orquídeas"),
    },
    {
      title: "Identificación de Orquídeas",
      description: "Sistema inteligente para identificar y clasificar orquídeas mediante características específicas.",
      icon: <Search className="w-6 h-6" />,
      color: "from-amber-500 to-orange-500",
      onClick: () => console.log("Navegando a Identificación"),
    },
    {
      title: "Designar Ganadores",
      description: "Sistema de evaluación y juzgamiento para determinar los ganadores de las competiciones.",
      icon: <Award className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      onClick: () => console.log("Navegando a Designar Ganadores"),
    },
    {
      title: "Reporte de Orquídeas",
      description: "Consulta reportes detallados, estadísticas y análisis completos del registro de orquídeas.",
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      onClick: () => console.log("Navegando a Reportes"),
    },
    {
      title: "Estado de Orquídeas",
      description: "Monitorea el estado actual, condiciones y progreso de las orquídeas en competición.",
      icon: <Eye className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
      onClick: () => console.log("Navegando a Estado"),
    },
    {
      title: "Asignar Trofeos",
      description: "Gestiona y otorga los premios de las orquídeas en las diferentes categorías de competición.",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-yellow-500 to-amber-500",
      onClick: () => console.log("Navegando a Asignar Trofeos"),
    },
    {
      title: "Formato Inscripción",
      description: "Descargar los formatos de inscripción para registrarse de forma manuscrita en el sistema.",
      icon: <FileText className="w-6 h-6" />,
      color: "from-teal-500 to-cyan-500",
      onClick: () => console.log("Navegando a Formato Inscripción"),
    },
    {
      title: "Inscripción",
      description: "Inscribe las orquídeas al concurso y gestiona el proceso de registro completo.",
      icon: <UserPlus className="w-6 h-6" />,
      color: "from-pink-500 to-rose-500",
      onClick: () => console.log("Navegando a Inscripción"),
    },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        {/* Logos superiores */}
        <div className="flex justify-center items-center gap-8 mb-6">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/images/Logo-fotor-bg-remover-2024090519443.png"
            alt="AAO"
            className="h-24 w-auto object-contain"
          />
          <motion.img
            whileHover={{ scale: 1.05 }}
            src="/images/umg2.png"
            alt="UMG"
            className="h-24 w-auto object-contain"
          />
        </div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
        >
          {stats.map((stat, index) => (
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
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
          <div className="inline-flex items-center space-x-2 text-gray-500 text-sm mb-4">
            <Calendar className="w-4 h-4" />
            <span>Sistema de Gestión de Orquídeas - {currentYear}</span>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="bg-light text-dark py-4">
          <div className="container mx-auto px-4">
            <div className="row flex flex-col md:flex-row">
              {/* Información de los creadores */}
              <div className="col-md-4 col-12 mb-3 mb-md-0">
                <h5 className="font-bold">Creado y Diseñado por:</h5>
                <ul className="list-unstyled">
                  <li>Pablo Andrés Santos González</li>
                  <li>Isaac Andony Guadamuz Ruiz</li>
                  <li>Selvyn Alberto Contreras Alvarado</li>
                  <li>Stephany Lissethe Ramírez González</li>
                </ul>
              </div>

              {/* Redes sociales y derechos */}
              <div className="col-md-4 col-12 text-center mb-3 mb-md-0 flex items-center justify-center">
                <p className="mt-3">© 2024 Ingeniería en Sistemas - Plan Diario <b>UMG Campus Cobán</b></p>
              </div>

              {/* Información de ubicación y logo */}
              <div className="col-md-4 col-12 flex justify-end items-center mt-3 md:mt-0">
                <div className="text-end me-4">
                  <h5 className="font-bold">A.A.O</h5>
                  <p className="mb-0">Cobán</p>
                  <p className="mb-0">Alta Verapaz</p>
                  <p>Guatemala</p>
                </div>
                <img 
                  src="/images/SISTEMAS_UMG-removebg-preview.png" 
                  alt="Logo Universidad" 
                  className="responsive-img w-48 md:w-56 lg:w-64"
                  style={{ marginRight: '-1rem' }}
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </AppLayout>
  );
}