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
  Settings2,
  Leaf,
  FolderTree,
  Tags,
  Download,
  Camera,
  CalendarDays
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
} from "@/components/ui/sidebar"
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { url } = usePage()

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
    <Sidebar collapsible="icon" {...props}>
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
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={url === item.url || (item.items && item.items.some(subItem => url === subItem.url || url.startsWith(subItem.url + '/')))}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
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
                ) : null}
              </SidebarMenuItem>
            ))}
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
