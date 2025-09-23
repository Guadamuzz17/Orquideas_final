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

interface Orquidea {
  id_orquidea: number;
  nombre_planta: string;
  origen: string;
}

export type Inscripcion = {
  id_nscr: number
  correlativo: number
  created_at: string
  participante: Participante
  orquidea: Orquidea
}

export const columns: ColumnDef<Inscripcion>[] = [
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
    accessorKey: "correlativo",
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
          #{row.getValue("correlativo")}
        </Badge>
      )
    },
  },
  
  {
    accessorKey: "orquidea.nombre_planta",
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
      const orquidea = row.original.orquidea;
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
    accessorKey: "participante.nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Participante
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de Inscripción
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("created_at"));
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
      const inscripcion = row.original

      const handleDelete = (id: number) => {
        router.delete(route('inscripcion.destroy', id), {
          onSuccess: () => toast.success('Inscripción eliminada correctamente'),
          onError: () => toast.error('Error al eliminar la inscripción'),
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
                onClick={() => navigator.clipboard.writeText(inscripcion.correlativo.toString())}
              >
                Copiar correlativo
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.visit(route('inscripcion.show', inscripcion.id_nscr))}
              >
                Ver detalles
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
                    <AlertDialogTitle>¿Eliminar inscripción?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará la inscripción del correlativo #{inscripcion.correlativo} 
                      de la orquídea "{inscripcion.orquidea.nombre_planta}" del participante {inscripcion.participante.nombre}.
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-destructive hover:bg-destructive/90"
                      onClick={() => handleDelete(inscripcion.id_nscr)}
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