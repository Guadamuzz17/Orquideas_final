"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2, Eye, ZoomIn, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useForm, router } from '@inertiajs/react'
import { toast, Toaster } from 'sonner'
import { useState } from 'react'
import { showDeleteConfirm } from '@/utils/sweetalert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
}

interface Clase {
  id_clase: number;
  nombre_clase: string;
  id_grupo: number;
}

interface Participante {
  id_participante: number;
  nombre_participante: string;
}

export type Orquidea = {
  id_orquidea: number
  nombre_planta: string
  origen: string
  foto?: string
  id_grupo: number
  id_clase: number
  cantidad: number
  id_participante: number
  grupo?: Grupo
  clase?: Clase
  participante?: { id_participante: number; nombre_participante: string }
  created_at?: string
  updated_at?: string
}

// Factory para permitir pasar datasets necesarios para edición
export const columns = (
  participantes: Participante[],
  grupos: Grupo[],
  clases: Clase[]
): ColumnDef<Orquidea>[] => [

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
        accessorKey: "id_orquidea",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
        accessorKey: "nombre_planta",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Nombre de la Planta
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
    },
    {
      accessorKey: "origen",
      header: "Origen",
    },
    {
      accessorKey: "grupo.nombre_grupo",
      header: "Grupo",
    },
    {
      accessorKey: "clase.nombre_clase",
      header: "Clase",
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      cell: ({ row }) => {
        return <div className="text-center font-medium">{row.getValue("cantidad")}</div>
      },
    },
    {
      accessorKey: "participante.nombre_participante",
      header: "Participante",
    },
    {
      accessorKey: "foto",
      header: "Imagen",
      cell: ({ row }) => {
        const orquidea = row.original;
        const [showImageModal, setShowImageModal] = useState(false);

        const ImageModal = () => (
          <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{orquidea.nombre_planta}</DialogTitle>
                <DialogDescription>
                  Imagen de la orquídea
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-center">
                <img
                  src={orquidea.foto?.startsWith('http') ? orquidea.foto : `/storage/${orquidea.foto}`}
                  alt={orquidea.nombre_planta}
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
        );

        return (
          <div className="flex justify-center">
            {orquidea.foto ? (
              <>
                <div
                  className="relative cursor-pointer group"
                  onClick={() => setShowImageModal(true)}
                >
                  <img
                    src={orquidea.foto?.startsWith('http') ? orquidea.foto : `/storage/${orquidea.foto}`}
                    alt={orquidea.nombre_planta}
                    className="h-12 w-12 object-cover rounded-md border hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-image');
                      if (fallback) {
                        fallback.classList.remove('hidden');
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-md flex items-center justify-center">
                    <ZoomIn className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="hidden fallback-image h-12 w-12 bg-gray-100 rounded-md border flex items-center justify-center cursor-pointer">
                    <span className="text-xs text-gray-400">Error</span>
                  </div>
                </div>
                <ImageModal />
              </>
            ) : (
              <div className="h-12 w-12 bg-gray-100 rounded-md border flex items-center justify-center">
                <span className="text-xs text-gray-400">Sin foto</span>
              </div>
            )}
          </div>
        );
      },
    },

    {
        id: "actions",
        header: () => <div className="text-right pr-15">Acciones</div>,
        cell: ({ row }) => {
          const orquidea = row.original

          // Estados locales para edición avanzada
          const [searchParticipante, setSearchParticipante] = useState("")
          const [clasesFiltradas, setClasesFiltradas] = useState<Clase[]>(
            clases.filter(c => c.id_grupo === orquidea.id_grupo)
          )

          const { data, setData, put, processing, reset } = useForm({
            nombre_planta: orquidea.nombre_planta,
            origen: orquidea.origen,
            id_grupo: orquidea.id_grupo.toString(),
            id_clase: orquidea.id_clase.toString(),
            cantidad: orquidea.cantidad.toString(),
            id_participante: orquidea.id_participante.toString(),
            descripcion: '',
          })

          const handleDelete = async (id: number, nombre: string) => {
            const result = await showDeleteConfirm(nombre)
            if (result.isConfirmed) {
              router.delete(route('orquideas.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Orquídea eliminada'),
                onError: () => toast.error('Error al eliminar')
              })
            }
          }

          const handleEditSubmit = (e: React.FormEvent, id: number) => {
            e.preventDefault()
            put(route('orquideas.update', id), {
              onSuccess: () => toast.success('Orquídea actualizada correctamente'),
              onError: () => toast.error('Error al actualizar la orquídea'),
              preserveScroll: true,
            })
          }

          const handleGrupoChange = (grupoId: string) => {
            setData('id_grupo', grupoId)
            const filtered = clases.filter(c => c.id_grupo === parseInt(grupoId))
            setClasesFiltradas(filtered)
            setData('id_clase', '')
          }

          const participantesFiltrados = participantes.filter((p) =>
            p.nombre_participante.toLowerCase().includes(searchParticipante.toLowerCase()) ||
            p.id_participante.toString().includes(searchParticipante)
          )

          return (
            <div className="flex justify-end items-center gap-2">
              <Toaster position="top-right" richColors expand visibleToasts={3} />

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="ghost">Ver</Button>
                </DrawerTrigger>
                <DrawerContent>
                <div className="mx-auto w-full max-w-md">
                  <DrawerHeader>
                    <DrawerTitle>Información de la Orquídea</DrawerTitle>
                    <DrawerDescription>Información sobre "{orquidea.nombre_planta}"</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>

                  {/* Imagen de la orquídea */}
                  {orquidea.foto && (
                    <div className="mb-4 text-center">
                      <Label className="text-sm font-medium mb-2 block">
                        Foto de la Orquídea
                      </Label>
                      <div className="relative mx-auto w-48 h-48">
                        <img
                          src={orquidea.foto?.startsWith('http') ? orquidea.foto : `/storage/${orquidea.foto}`}
                          alt={orquidea.nombre_planta}
                          className="w-full h-full object-cover rounded-lg border shadow-sm"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback-image');
                            if (fallback) {
                              fallback.classList.remove('hidden');
                            }
                          }}
                        />
                        <div className="hidden fallback-image w-full h-full bg-gray-100 rounded-lg border shadow-sm flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <div className="text-2xl mb-2">📷</div>
                            <div className="text-sm">Imagen no disponible</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Label htmlFor="nombre_planta" className="text-right">
                    Nombre de la Planta
                  </Label>
                  <Input
                    disabled
                    id="nombre_planta"
                    defaultValue={orquidea.nombre_planta}
                    className="mb-4"
                    />
                    <Label htmlFor="origen" className="text-right">
                    Origen
                  </Label>
                  <Input
                    disabled
                    id="origen"
                    defaultValue={orquidea.origen}
                    className="mb-4"
                    />

                  <Label htmlFor="grupo" className="text-right">
                    Grupo
                  </Label>
                  <Input
                    disabled
                    id="grupo"
                    defaultValue={orquidea.grupo?.nombre_grupo || ""}
                    className="mb-4"
                    />

                  <Label htmlFor="clase" className="text-right">
                    Clase
                  </Label>
                  <Input
                    disabled
                    id="clase"
                    defaultValue={orquidea.clase?.nombre_clase || ""}
                    className="mb-4"
                    />

                  <Label htmlFor="cantidad" className="text-right">
                    Cantidad
                  </Label>
                  <Input
                    disabled
                    id="cantidad"
                    defaultValue={orquidea.cantidad.toString()}
                    className="mb-4"
                    />

                <Label htmlFor="participante" className="text-right">
                    Participante
                  </Label>
                  <Input
                    disabled
                    id="participante"
                    defaultValue={orquidea.participante?.nombre_participante || ""}
                    className="mb-4"
                    />

                    <DrawerClose>
                      <Button variant="outline">Cerrar</Button>
                    </DrawerClose>
                  </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>

              {/* Modal para editar orquídea */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline"
                    onClick={() => {
                      reset()
                      setData({
                        nombre_planta: orquidea.nombre_planta,
                        origen: orquidea.origen,
                        id_grupo: orquidea.id_grupo.toString(),
                        id_clase: orquidea.id_clase.toString(),
                        cantidad: orquidea.cantidad.toString(),
                        id_participante: orquidea.id_participante.toString(),
                        descripcion: '',
                      })
                      setClasesFiltradas(clases.filter(c => c.id_grupo === orquidea.id_grupo))
                      setSearchParticipante('')
                    }}>
                    <Pencil className="h-4 w-4 mr-1" /> Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Editar Orquídea</DialogTitle>
                    <DialogDescription>Modifica los campos necesarios. Puedes cambiar participante, grupo y clase.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(e, orquidea.id_orquidea) }}>
                    <div className="space-y-4 m-4">
                      {/* Nombre */}
                      <div>
                        <Label htmlFor="nombre_planta">Nombre de la Planta *</Label>
                        <Input
                          id="nombre_planta"
                          value={data.nombre_planta}
                          onChange={(e) => setData('nombre_planta', e.target.value)}
                          placeholder="Ej: Cattleya mossiae"
                          required
                        />
                      </div>
                      {/* Origen */}
                      <div>
                        <Label htmlFor="origen">Origen *</Label>
                        <Select value={data.origen} onValueChange={(value) => setData('origen', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nativa">Nativa</SelectItem>
                            <SelectItem value="hibrido">Híbrido</SelectItem>
                            <SelectItem value="importada">Importada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Participante */}
                      <div>
                        <Label>Buscar Participante *</Label>
                        <Input
                          type="text"
                          placeholder="🔍 Buscar por nombre o ID..."
                          value={searchParticipante}
                          onChange={(e) => setSearchParticipante(e.target.value)}
                          className="mb-2"
                        />
                        <Select value={data.id_participante} onValueChange={(value) => setData('id_participante', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar participante" />
                          </SelectTrigger>
                          <SelectContent>
                            {participantesFiltrados.map(p => (
                              <SelectItem key={p.id_participante} value={p.id_participante.toString()}>
                                #{p.id_participante} - {p.nombre_participante}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Grupo */}
                      <div>
                        <Label>Grupo *</Label>
                        <Select value={data.id_grupo} onValueChange={handleGrupoChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {grupos.map(g => (
                              <SelectItem key={g.id_grupo} value={g.id_grupo.toString()}>{g.nombre_grupo}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Clase */}
                      <div>
                        <Label>Clase *</Label>
                        <Select
                          value={data.id_clase}
                          onValueChange={(value) => setData('id_clase', value)}
                          disabled={!data.id_grupo}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={data.id_grupo ? 'Seleccionar clase' : 'Primero selecciona un grupo'} />
                          </SelectTrigger>
                          <SelectContent>
                            {clasesFiltradas.map(c => (
                              <SelectItem key={c.id_clase} value={c.id_clase.toString()}>{c.nombre_clase}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {/* Cantidad */}
                      <div>
                        <Label htmlFor="cantidad">Cantidad *</Label>
                        <Input
                          id="cantidad"
                          type="number"
                          min="1"
                          max="999"
                          value={data.cantidad}
                          onChange={(e) => setData('cantidad', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={processing}>{processing ? 'Guardando...' : 'Guardar Cambios'}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>


              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Eliminar</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Quieres eliminar "{orquidea.nombre_planta}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Eliminará permanentemente la orquídea de la base de datos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDelete(orquidea.id_orquidea, orquidea.nombre_planta)}>
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
