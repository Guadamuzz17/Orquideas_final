import SimpleLayout from '@/layouts/simple-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slash, Plus, Calendar, Eye, Edit, Trash2, Play, EyeOff, Lock, AlertTriangle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
} from "@/components/ui/alert-dialog";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Eventos',
    href: '/eventos',
  },
];

interface Evento {
  id_evento: number;
  nombre_evento: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: 'en curso' | 'finalizado' | 'programado';
  created_at?: string;
}

interface EventosIndexProps {
  eventos: {
    data: Evento[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function EventosIndex({ eventos }: EventosIndexProps) {
  const [mostrarFinalizados, setMostrarFinalizados] = useState(false);

  // Filtrar eventos según el toggle
  const eventosFiltrados = mostrarFinalizados
    ? eventos.data
    : eventos.data.filter(evento => evento.estado !== 'finalizado');

  const eventosFinalizadosCount = eventos.data.filter(e => e.estado === 'finalizado').length;

  const handleDelete = (id: number) => {
    router.delete(route('eventos.destroy', id));
  };

  const handleSeleccionar = (id: number, estado: string) => {
    if (estado === 'finalizado') {
      // Advertencia pero permitir selección
      if (confirm('⚠️ Este evento está finalizado. No podrás registrar nuevas orquídeas ni participantes. ¿Deseas continuar?')) {
        router.post(route('eventos.seleccionar', id));
      }
    } else {
      router.post(route('eventos.seleccionar', id));
    }
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      'en curso': { variant: 'default' as const, color: 'bg-green-500' },
      'finalizado': { variant: 'secondary' as const, color: 'bg-gray-500' },
      'programado': { variant: 'outline' as const, color: 'bg-blue-500' },
    };
    return variants[estado as keyof typeof variants] || variants.programado;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <SimpleLayout>
      <Head title="Gestión de Eventos" />

      {/* Header con Logo y Logout */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">Sistema de Eventos - Orquídeas</h1>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={route('logout')} method="post" as="button">
              Cerrar Sesión
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col gap-4 mb-8">
          {/* Botón crear primero */}
          <Button asChild className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            <Link href={route('eventos.create')}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Nuevo Evento
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">Gestión de Eventos</h2>
              <p className="text-gray-500 mt-2">Seleccione el evento con el que desea trabajar</p>
            </div>

            {/* Toggle para mostrar/ocultar finalizados */}
            <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border shadow-sm">
              <Switch
                id="mostrar-finalizados"
                checked={mostrarFinalizados}
                onCheckedChange={setMostrarFinalizados}
              />
              <Label htmlFor="mostrar-finalizados" className="cursor-pointer flex items-center gap-2">
                {mostrarFinalizados ? (
                  <><Eye className="h-4 w-4" /> Mostrar finalizados ({eventosFinalizadosCount})</>
                ) : (
                  <><EyeOff className="h-4 w-4" /> Ocultar finalizados ({eventosFinalizadosCount})</>
                )}
              </Label>
            </div>
          </div>
        </div>        <div className="text-sm text-muted-foreground mb-4">
          Mostrando {eventosFiltrados.length} de {eventos.total} eventos
          {!mostrarFinalizados && eventosFinalizadosCount > 0 && (
            <span className="text-amber-600 ml-2">
              ({eventosFinalizadosCount} finalizado{eventosFinalizadosCount !== 1 ? 's' : ''} oculto{eventosFinalizadosCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {eventosFiltrados.map((evento) => (
            <Card key={evento.id_evento} className={`hover:shadow-lg transition-shadow ${
              evento.estado === 'finalizado' ? 'border-amber-300 bg-amber-50/30' : ''
            }`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      {evento.nombre_evento}
                      {evento.estado === 'finalizado' && <Lock className="h-4 w-4 text-amber-600" />}
                    </CardTitle>
                    <Badge className={getEstadoBadge(evento.estado).variant === 'default' ? 'bg-green-500' : ''} variant={getEstadoBadge(evento.estado).variant}>
                      {evento.estado}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {evento.descripcion && (
                    <p className="text-sm text-gray-600 line-clamp-2">{evento.descripcion}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Inicio: {formatDate(evento.fecha_inicio)}</span>
                    </div>
                    {evento.fecha_fin && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Fin: {formatDate(evento.fecha_fin)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    {/* Advertencia para eventos finalizados */}
                    {evento.estado === 'finalizado' && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-xs">
                        <p className="text-amber-800 font-medium flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Evento finalizado - Solo lectura
                        </p>
                      </div>
                    )}

                    {/* Botón seleccionar - siempre habilitado pero con advertencia */}
                    <Button
                      onClick={() => handleSeleccionar(evento.id_evento, evento.estado)}
                      className={`w-full ${
                        evento.estado === 'finalizado'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      size="sm"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {evento.estado === 'finalizado' ? 'Seleccionar (Solo lectura)' : 'Seleccionar Evento'}
                    </Button>

                    {/* Botones editar/eliminar - BLOQUEADOS para finalizados */}
                    <div className="flex gap-2">
                      <Button
                        asChild={evento.estado !== 'finalizado'}
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        disabled={evento.estado === 'finalizado'}
                      >
                        {evento.estado === 'finalizado' ? (
                          <div className="flex items-center justify-center gap-2 text-gray-400 cursor-not-allowed">
                            <Lock className="h-4 w-4" />
                            <span>Editar</span>
                          </div>
                        ) : (
                          <Link href={route('eventos.edit', evento.id_evento)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        )}
                      </Button>

                      {evento.estado === 'finalizado' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-400 cursor-not-allowed"
                          disabled
                        >
                          <Lock className="h-4 w-4" />
                        </Button>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente el evento "{evento.nombre_evento}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(evento.id_evento)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {eventosFiltrados.length === 0 && eventos.data.length > 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 text-center">
                <EyeOff className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Todos los eventos activos están ocultos</h3>
                <p className="text-sm mb-4">Activa el interruptor "Mostrar finalizados" para ver los eventos completados</p>
              </div>
            </CardContent>
          </Card>
        )}

        {eventos.data.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 text-center">
                <h3 className="text-lg font-semibold mb-2">No hay eventos registrados</h3>
                <p className="text-sm mb-4">Cree el primer evento para comenzar</p>
                <Button asChild>
                  <Link href={route('eventos.create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primer Evento
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {eventos.last_page > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: eventos.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === eventos.current_page ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={route('eventos.index', { page })}>
                    {page}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </SimpleLayout>
  );
}
