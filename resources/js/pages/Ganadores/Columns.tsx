"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { router } from '@inertiajs/react'
import { toast } from 'sonner'
import React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Participante {
  id: number;
  nombre: string;
}

interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
}

interface Clase {
  id_clase: number;
  nombre_clase: string;
}

interface Orquidea {
  id_orquidea: number;
  nombre_planta: string;
  origen: string;
  grupo?: Grupo;
  clase?: Clase;
}

interface Inscripcion {
  id_nscr: number;
  correlativo: number;
  participante: Participante;
  orquidea: Orquidea;
}

export type Ganador = {
  id_ganador: number
  posicion: number
  empate: boolean
  fecha_ganador: string
  inscripcion: Inscripcion
}

const getPosicionBadge = (posicion: number, empate: boolean) => {
  const badges = {
    1: { emoji: "🥇", text: "1° Lugar", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
    2: { emoji: "🥈", text: "2° Lugar", color: "bg-gray-100 text-gray-800 border-gray-300" },
    3: { emoji: "🥉", text: "3° Lugar", color: "bg-orange-100 text-orange-800 border-orange-300" }
  };
  
  const badge = badges[posicion as keyof typeof badges];
  const empateText = empate ? " (Empate)" : "";
  
  return (
    <Badge className={badge.color}>
      {badge.emoji} {badge.text}{empateText}
    </Badge>
  );
};

export const columns: ColumnDef<Ganador>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  
  {
    accessorKey: "id_ganador",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID Ganador
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="font-mono">
          #{row.getValue("id_ganador")}
        </Badge>
      )
    },
  },
  
  {
    accessorKey: "inscripcion.participante.nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.inscripcion.participante.nombre}</div>
    },
  },
  
  {
    accessorKey: "inscripcion.orquidea.nombre_planta",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Orquídea
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const orquidea = row.original.inscripcion.orquidea;
      return (
        <div>
          <div className="font-medium">{orquidea.nombre_planta}</div>
          <div className="text-sm text-muted-foreground">
            Origen: {orquidea.origen}
          </div>
        </div>
      )
    },
  },
  
  {
    accessorKey: "inscripcion.orquidea.grupo.nombre_grupo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Grupo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const grupo = row.original.inscripcion.orquidea.grupo;
      return grupo ? (
        <Badge variant="secondary">{grupo.nombre_grupo}</Badge>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      );
    },
  },
  
  {
    accessorKey: "inscripcion.orquidea.clase.nombre_clase",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clase
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const clase = row.original.inscripcion.orquidea.clase;
      return clase ? (
        <Badge variant="outline">{clase.nombre_clase}</Badge>
      ) : (
        <span className="text-muted-foreground">N/A</span>
      );
    },
  },
  
  {
    accessorKey: "inscripcion.correlativo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Correlativo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <Badge variant="secondary" className="font-mono text-lg">
          #{row.original.inscripcion.correlativo}
        </Badge>
      )
    },
  },
  
  {
    accessorKey: "posicion",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Posición
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return getPosicionBadge(row.getValue("posicion"), row.original.empate);
    },
  },
  
  {
    accessorKey: "empate",
    header: "Empate",
    cell: ({ row }) => {
      return row.getValue("empate") ? (
        <Badge variant="destructive">Sí</Badge>
      ) : (
        <Badge variant="secondary">No</Badge>
      );
    },
  },
  
  {
    accessorKey: "fecha_ganador",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de Ganador
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("fecha_ganador"));
      return (
        <div className="text-sm">
          <div>{fecha.toLocaleDateString('es-ES')}</div>
          <div className="text-muted-foreground">
            {fecha.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      )
    },
  },

  {
    id: "actions",
    header: () => <div className="text-right pr-15">Acciones</div>,
    cell: ({ row }) => {
      const ganador = row.original

      const handleDelete = (id: number) => {
        router.delete(route('ganadores.destroy', id), {
          onSuccess: () => toast.success('Ganador eliminado correctamente'),
          onError: () => toast.error('Error al eliminar el ganador'),
          preserveScroll: true
        });
      }

      return (
        <div className="flex justify-end items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(ganador.inscripcion.correlativo.toString())}
              >
                Copiar correlativo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.visit(route('ganadores.show', ganador.id_ganador))}
              >
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.visit(route('ganadores.edit', ganador.id_ganador))}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <span className="text-red-600">Eliminar</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar ganador?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará el registro del ganador de la orquídea "{ganador.inscripcion.orquidea.nombre_planta}" 
                      del participante {ganador.inscripcion.participante.nombre}.
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={() => handleDelete(ganador.id_ganador)}
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
