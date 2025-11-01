"use client"

import * as React from "react"
import {
  Users,
  Plus,
  Award,
  BarChart3,
  Search,
  Eye,
  FileText,
  Trophy,
  UserPlus,
  LayoutGrid,
  ChevronUp,
  ChevronDown,
  Settings2,
  Leaf,
  FolderTree,
  Tags,
  Download,
  Camera,
  CalendarDays,
  UserCog
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavUser } from '@/components/nav-user'
import { Link, usePage } from '@inertiajs/react'

// Datos del sistema
const data = {
  user: {
    name: "Sistema Orquídeas",
    email: "admin@aao.guatemala",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "A.A.O Guatemala",
      logo: Leaf,
      plan: "Sistema de Gestión",
    }
  ],
  navMain: [
    {
      title: "Gestión de Eventos",
      url: "/eventos",
      icon: CalendarDays,
      items: [
        {
          title: "Panel de Eventos",
          url: "/eventos",
        },
        {
          title: "Crear Nuevo Evento",
          url: "/eventos/create",
        },
      ],
    },
    {
      title: "Panel Principal",
      url: "/dashboard",
      icon: LayoutGrid,
      isActive: true,
    },
    {
      title: "Participantes",
      url: "/participantes",
      icon: Users,
      items: [
        {
          title: "Ver Todos los Participantes",
          url: "/participantes",
        },
        {
          title: "Agregar Nuevo Participante",
          url: "/participantes/create",
        },
      ],
    },
    {
      title: "Catálogo de Orquídeas",
      url: "/orquideas",
      icon: Leaf,
      items: [
        {
          title: "Ver Todas las Orquídeas",
          url: "/orquideas",
        },
        {
          title: "Registrar Nueva Orquídea",
          url: "/orquideas/create",
        },
      ],
    },
    {
      title: "Clasificación",
      url: "/grupos",
      icon: FolderTree,
      items: [
        {
          title: "Grupos de Orquídeas",
          url: "/grupos",
        },
        {
          title: "Clases de Orquídeas",
          url: "/clases",
        },
      ],
    },
    {
      title: "Inscripciones al Concurso",
      url: "/inscripcion",
      icon: UserPlus,
      items: [
        {
          title: "Crear Nueva Inscripción",
          url: "/inscripcion/create",
        },
        {
          title: "Ver Todas las Inscripciones",
          url: "/inscripcion",
        },
      ],
    },
    {
      title: "Resultados del Concurso",
      url: "/ganadores",
      icon: Trophy,
      items: [
        {
          title: "Designar Ganadores",
          url: "/ganadores",
        },
        {
          title: "Otorgar Listones",
          url: "/listones",
        },
        {
          title: "Tipos de Premios",
          url: "/tipo-premios",
        },
      ],
    },
    {
      title: "Galería de Fotos",
      url: "/fotos",
      icon: Camera,
      items: [
        {
          title: "Ver Todas las Fotografías",
          url: "/fotos",
        },
        {
          title: "Subir Nueva Fotografía",
          url: "/fotos/create",
        },
      ],
    },
    {
      title: "Formatos y Documentos",
      url: "/formatos",
      icon: FileText,
      items: [
        {
          title: "Formato de Inscripción",
          url: "#",
          action: "download-inscripcion",
          icon: Download,
        },
        {
          title: "Formato de Juzgamiento",
          url: "/participantes/formato",
        },
        {
          title: "Listado de Clases (PDF)",
          url: "#",
          action: "download",
          icon: Download,
        },
      ],
    },
    {
      title: "Reportes y Estadísticas",
      url: "/reportes",
      icon: BarChart3,
      items: [
        {
          title: "Reporte General",
          url: "/reportes",
        },
        {
          title: "Reporte de Listones",
          url: "/reportes/listones",
        },
      ],
    },
    {
      title: "Gestión de Usuarios",
      url: "/users",
      icon: UserCog,
      items: [
        {
          title: "Ver Todos los Usuarios",
          url: "/users",
        },
        {
          title: "Crear Nuevo Usuario",
          url: "/users/create",
        },
        {
          title: "Roles y Permisos",
          url: "/roles",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { url, props: pageProps } = usePage()
  const { auth } = pageProps as any
  const userPermissions = auth?.permissions || []

  // Mapeo de permisos a rutas del sidebar
  const permissionMap: Record<string, string> = {
    'dashboard.ver': '/dashboard',
    'eventos.ver': '/eventos',
    'participantes.ver': '/participantes',
    'orquideas.ver': '/orquideas',
    'grupos.ver': '/grupos',
    'clases.ver': '/clases',
    'inscripciones.ver': '/inscripcion',
    'ganadores.ver': '/ganadores',
    'listones.ver': '/listones',
    'tipos-premios.ver': '/tipo-premios',
    'fotos.ver': '/fotos',
    'reportes.ver': '/reportes',
    'usuarios.ver': '/users',
  }

  // Función para verificar si el usuario tiene permiso para ver un item
  const hasPermission = (itemUrl: string): boolean => {
    // Si no hay permisos definidos, mostrar todo (para mantener compatibilidad)
    if (!userPermissions || userPermissions.length === 0) {
      return true
    }

    // Buscar el permiso correspondiente a la URL
    for (const [permission, route] of Object.entries(permissionMap)) {
      if (itemUrl.startsWith(route)) {
        return userPermissions.includes(permission)
      }
    }

    // Por defecto, permitir acceso si no hay mapeo específico
    return true
  }

  // Filtrar items del menú basándose en permisos
  const filteredNavMain = data.navMain.filter(item => {
    // Verificar si el usuario tiene permiso para el item principal
    if (!hasPermission(item.url)) {
      return false
    }

    // Si tiene subitems, filtrarlos también
    if (item.items) {
      item.items = item.items.filter(subItem => hasPermission(subItem.url))
      // Si no quedan subitems después de filtrar, no mostrar el item principal
      return item.items.length > 0
    }

    return true
  })

  // Función para descargar PDF de Clases Orquídeas
  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/docsDonwload/ClasesOrquideas.pdf';
    link.download = 'ClasesOrquideas.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Función para descargar PDF de Formato de Inscripción
  const handleDownloadFormatoInscripcion = () => {
    const link = document.createElement('a');
    link.href = '/docsDonwload/FormatoInscripcion.pdf';
    link.download = 'FormatoInscripcion.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Sidebar collapsible="none" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-green-600 text-white">
                    <Leaf className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.teams[0].name}
                    </span>
                    <span className="truncate text-xs">
                      {data.teams[0].plan}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Settings2 className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span>Acerca del Sistema</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarMenu>
            {filteredNavMain.map((item) => {
              const isItemActive = url === item.url || (item.items && item.items.some(subItem => url === subItem.url || url.startsWith(subItem.url + '/')));

              // Si no tiene subitems, mostrar enlace simple
              if (!item.items?.length) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isItemActive}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }

              // Si tiene subitems, mostrarlos siempre abiertos
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title} isActive={isItemActive}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild={!subItem.action}
                          isActive={url === subItem.url || url.startsWith(subItem.url + '/')}
                          onClick={
                            subItem.action === 'download' ? handleDownloadPDF :
                            subItem.action === 'download-inscripcion' ? handleDownloadFormatoInscripcion :
                            undefined
                          }
                        >
                          {subItem.action === 'download' || subItem.action === 'download-inscripcion' ? (
                            <div className="flex items-center cursor-pointer">
                              <Download className="mr-2 h-4 w-4" />
                              <span>{subItem.title}</span>
                            </div>
                          ) : (
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
