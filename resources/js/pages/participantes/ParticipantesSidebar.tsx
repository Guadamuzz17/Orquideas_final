"use client"

import * as React from "react"
import { Link, usePage } from '@inertiajs/react';
import { 
  Home, 
  Users, 
  FileText, 
  Download,
  Settings,
  ChevronUp,
  Plus,
  ArrowLeft,
  UserPlus
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
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

// Datos del módulo de participantes
const participantesData = {
  module: {
    name: "Participantes",
    description: "Gestión de Participantes",
    version: "v1.0",
  },
  navMain: [
    {
      title: "Dashboard Principal",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Gestión de Participantes",
      url: "/participantes",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Lista de Participantes",
          url: "/participantes",
        },
        {
          title: "Registrar Participante",
          url: "/participantes/create",
        },
      ],
    },
    {
      title: "Formatos y Documentos",
      url: "/participantes/formato",
      icon: FileText,
      items: [
        {
          title: "Formato de Juzgamiento",
          url: "/participantes/formato",
        },
      ],
    },
  ],
  quickActions: [
    {
      title: "Nuevo Participante",
      url: "/participantes/create",
      icon: UserPlus,
      description: "Registrar participante",
      color: "blue",
    },
    {
      title: "Descarga Rápida",
      action: "download",
      icon: Download,
      description: "Formato PDF",
      color: "green",
    },
  ],
}

export default function ParticipantesSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { url } = usePage()
  
  const handleQuickDownload = () => {
    console.log('Descarga rápida de formato');
    // Aquí implementarías la lógica de descarga
  }

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
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Users className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {participantesData.module.name}
                    </span>
                    <span className="truncate text-xs">
                      {participantesData.module.description}
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
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span>Volver al Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración del Módulo</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarMenu>
            {participantesData.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  tooltip={item.title}
                  isActive={url.startsWith(item.url)}
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
                          asChild
                          isActive={url === subItem.url}
                        >
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Acciones Rápidas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {participantesData.quickActions.map((action) => (
                <SidebarMenuItem key={action.title}>
                  <SidebarMenuButton 
                    asChild={action.url ? true : false}
                    tooltip={action.title}
                    onClick={action.action === 'download' ? handleQuickDownload : undefined}
                    className={`${action.color === 'blue' ? 'hover:bg-blue-50 hover:text-blue-600' : 'hover:bg-green-50 hover:text-green-600'}`}
                  >
                    {action.url ? (
                      <Link href={action.url}>
                        <action.icon />
                        <span>{action.title}</span>
                      </Link>
                    ) : (
                      <>
                        <action.icon />
                        <span>{action.title}</span>
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          <div className="flex items-center justify-between text-xs text-sidebar-foreground/70">
            <span>{participantesData.module.version}</span>
            <Settings className="h-3 w-3" />
          </div>
        </div>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
