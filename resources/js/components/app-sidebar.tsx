"use client"

import { Users, Plus, Award, BarChart3, Search, Eye, FileText, Trophy, UserPlus, Home } from "lucide-react"
import { LayoutGrid } from "lucide-react" // Icono del Dashboard original
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import AppLogo from './app-logo'
import { NavUser } from '@/components/nav-user'
import { Link } from '@inertiajs/react'

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutGrid, // Usamos el icono original del Dashboard
  },
  {
    title: "Participantes",
    url: "/participantes",
    icon: Users,
  },
  {
    title: "Gestionar Orquídeas",
    url: "/orquideas",
    icon: Plus,
  },
  {
    title: "Identificación",
    url: "/identificacion",
    icon: Search,
  },
  {
    title: "Inscripción",
    url: "/inscripcion",
    icon: UserPlus,
  },
  {
    title: "Formato Inscripción",
    url: "/formato-inscripcion",
    icon: FileText,
  },
  {
    title: "Designar Ganadores",
    url: "/ganadores",
    icon: Award,
  },
  {
    title: "Asignar Trofeos",
    url: "/trofeos",
    icon: Trophy,
  },
  {
    title: "Reportes",
    url: "/reportes",
    icon: BarChart3,
  },
  {
    title: "Estado de Orquídeas",
    url: "/estado",
    icon: Eye,
  },
]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center space-x-3" prefetch>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between p-4">
          
          <NavUser />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}