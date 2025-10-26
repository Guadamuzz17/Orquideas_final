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
  Camera
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
      title: "Panel Principal",
      url: "/dashboard",
      icon: LayoutGrid,
      isActive: true,
    },
    {
      title: "Gestión de Participantes",
      url: "/participantes",
      icon: Users,
      items: [
        {
          title: "Lista de Participantes",
          url: "/participantes",
        },
        {
          title: "Registrar Participante",
          url: "/participantes/create",
        },
        {
          title: "Formato de Juzgamiento",
          url: "/participantes/formato",
        },
      ],
    },
    {
      title: "Registro de Orquídeas",
      url: "/orquideas",
      icon: Leaf,
      items: [
        {
          title: "Catálogo de Orquídeas",
          url: "/orquideas",
        },
        {
          title: "Registrar Orquídea",
          url: "/orquideas/create",
        },
        {
          title: "Grupos de Orquídeas",
          url: "/grupos",
          icon: FolderTree,
        },
        {
          title: "Clases de Orquídeas",
          url: "/clases",
          icon: Tags,
        },
        {
          title: "Descargar Clases PDF",
          url: "#",
          action: "download",
          icon: Download,
        },
      ],
    },
    {
      title: "Inscripción de Orquídeas",
      url: "/inscripcion",
      icon: UserPlus,
      items: [
        {
          title: "Nueva Inscripción",
          url: "/inscripcion/create",
        },
        {
          title: "Lista de Inscripciones",
          url: "/inscripcion",
        },
      ],
    },
    {
      title: "Competición",
      url: "/competicion",
      icon: Trophy,
      items: [
        {
          title: "Inscripción",
          url: "/inscripcion",
        },
        {
          title: "Formato Inscripción",
          url: "#",
          action: "download-inscripcion",
          icon: Download,
        },
        {
          title: "Designar Ganadores",
          url: "/ganadores",
        },
        {
          title: "Asignar Trofeos",
          url: "/trofeos",
        },
        {
          title: "Otorgar Listones",
          url: "/listones",
        },
      ],
    },
    {
      title: "Fotografías",
      url: "/fotos",
      icon: Camera,
      items: [
        {
          title: "Ver Fotografías",
          url: "/fotos",
        },
        {
          title: "Subir Nueva Foto",
          url: "/fotos/create",
        },
      ],
    },
    {
      title: "Reportes y Análisis",
      url: "/reportes",
      icon: BarChart3,
      items: [
        {
          title: "Reportes de Listones",
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
