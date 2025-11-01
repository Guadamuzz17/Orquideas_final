"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { router, useForm } from '@inertiajs/react'
import { Toaster, toast } from 'sonner'
import React, { useState } from 'react'
import { showDeleteConfirm } from '@/utils/sweetalert'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
interface TipoParticipante {
  id_tipo: number;
  Clase: string;
}

interface Departamento {
  id_departamento: number;
  nombre_departamento: string;
}

interface Municipio {
  id_municipio: number;
  nombre_municipio: string;
}

interface Asociacion {
  id_aso: number;
  Clase: string;
}

export type Participante = {
  id: number
  nombre: string
  numero_telefonico: string
  direccion: string
  id_tipo: number
  id_departamento: number
  id_municipio: number
  id_aso: number
  tipo?: TipoParticipante
  departamento?: Departamento
  municipio?: Municipio
  aso?: Asociacion
}

export const columns: ColumnDef<Participante>[] = [

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
        accessorKey: "id",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Id
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
        accessorKey: "nombre",
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
    },
    {
      accessorKey: "numero_telefonico",
      header: "Teléfono",
    },
    {
      accessorKey: "direccion",
      header: "Dirección",
    },
    {
      accessorKey: "tipo.Clase",
      header: "Tipo",
    },
    {
      accessorKey: "departamento.nombre_departamento",
      header: "Departamento",
    },
    {
      accessorKey: "municipio.nombre_municipio",
      header: "Municipio",
    },
    {
      accessorKey: "aso.Clase",
      header: "Asociación",
    },

    {
        id: "actions",
        header: () => <div className="text-right pr-15">Acciones</div>,
        cell: ({ row }) => {

          const participante = row.original

          const { data, setData, put, processing, reset } = useForm({
              nombre: participante.nombre,
              numero_telefonico: participante.numero_telefonico,
              direccion: participante.direccion,
              id_tipo: participante.id_tipo.toString(),
              id_departamento: participante.id_departamento.toString(),
              id_municipio: participante.id_municipio.toString(),
              id_aso: participante.id_aso.toString(),
          });

          const handleDelete = async (id: number, nombre: string) => {
              const result = await showDeleteConfirm(nombre);
              if (result.isConfirmed) {
                router.delete(route('participantes.destroy', id), {
                  preserveScroll: true
                });
              }
            }

            const handleEditSubmit = (e: React.FormEvent, id: number) => {
              e.preventDefault();
              put(route('participantes.update', id), {
                onSuccess: () => toast.success('Participante actualizado correctamente'),
                onError: () => toast.error('Error al actualizar el participante'),
                preserveScroll: true
              });
            };

          return (
            <div className="flex justify-end items-center gap-2">
              <Toaster position="top-right" richColors expand visibleToasts={3} />

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost">Ver</Button>
                </DrawerTrigger>
                <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Información del Participante</DrawerTitle>
                    <DrawerDescription>Información sobre "{participante.nombre}"</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                  <Label htmlFor="nombre" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    disabled
                    id="nombre"
                    defaultValue={participante.nombre}
                    className="mb-4"
                    />
                    <Label htmlFor="numero_telefonico" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    disabled
                    id="numero_telefonico"
                    defaultValue={participante.numero_telefonico ?? ""}
                    className="mb-4"
                    />

                  <Label htmlFor="direccion" className="text-right">
                    Dirección
                  </Label>
                  <Textarea
                    disabled
                    id="direccion"
                    defaultValue={participante.direccion}
                    className="mb-4"
                    />

                  <Label htmlFor="tipo" className="text-right">
                    Tipo de Participante
                  </Label>
                  <Input
                    disabled
                    id="tipo"
                    defaultValue={participante.tipo?.Clase || ""}
                    className="mb-4"
                    />

                  <Label htmlFor="departamento" className="text-right">
                    Departamento
                  </Label>
                  <Input
                    disabled
                    id="departamento"
                    defaultValue={participante.departamento?.nombre_departamento || ""}
                    className="mb-4"
                    />

                <Label htmlFor="municipio" className="text-right">
                    Municipio
                  </Label>
                  <Input
                    disabled
                    id="municipio"
                    defaultValue={participante.municipio?.nombre_municipio || ""}
                    className="mb-4"
                    />

                <Label htmlFor="asociacion" className="text-right">
                    Asociación
                  </Label>
                  <Input
                    disabled
                    id="asociacion"
                    defaultValue={participante.aso?.Clase || ""}
                    className="mb-4"
                    />

                    <DrawerClose>
                      <Button variant="outline">Cerrar</Button>
                    </DrawerClose>
                  </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>

              {/* Modal para editar participante */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline"
                  onClick={() => {
                    reset();
                    setData({
                      nombre: participante.nombre,
                      numero_telefonico: participante.numero_telefonico,
                      direccion: participante.direccion,
                      id_tipo: participante.id_tipo.toString(),
                      id_departamento: participante.id_departamento.toString(),
                      id_municipio: participante.id_municipio.toString(),
                      id_aso: participante.id_aso.toString(),
                    });
                  }}>
                    Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edición de Participante</DialogTitle>
                    <DialogDescription>
                    Modifica los campos necesarios.
                    </DialogDescription>
                  </DialogHeader>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleEditSubmit(e, participante.id);
                        }}>
                      <div className="space-y-4 m-4">
                      <Label htmlFor="nombre" className="text-right">
                        Nombre
                      </Label>
                      <Input
                        id="nombre"
                        value={data.nombre}
                        onChange={(e) => setData('nombre', e.target.value)}
                        className="mb-4"
                        />
                        <Label htmlFor="numero_telefonico" className="text-right">
                        Teléfono
                      </Label>
                      <Input
                        id="numero_telefonico"
                        value={data.numero_telefonico ?? ""}
                        onChange={(e) => setData('numero_telefonico', e.target.value)}
                        className="mb-4"
                        />
                      <Label htmlFor="direccion" className="text-right">
                        Dirección
                      </Label>
                      <Textarea
                        id="direccion"
                        value={data.direccion}
                        onChange={(e) => setData('direccion', e.target.value)}
                        className="mb-4"
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={processing} >
                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                      </DialogFooter>
                    </form>
                </DialogContent>
              </Dialog>


              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="destructive">Eliminar</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Quieres eliminar "{participante.nombre}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Eliminará permanentemente el participante de la base de datos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDelete(participante.id, participante.nombre)}>
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
              </AlertDialog>
            </div>

          )
        },
      },
]
