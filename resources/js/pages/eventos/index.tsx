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
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
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
  const [eventoParaConfirmar, setEventoParaConfirmar] = useState<Evento | null>(null);

  // Filtrar eventos según el toggle
  const eventosFiltrados = mostrarFinalizados
    ? eventos.data
    : eventos.data.filter(evento => evento.estado !== 'finalizado');

  const eventosFinalizadosCount = eventos.data.filter(e => e.estado === 'finalizado').length;

  const handleDelete = (id: number) => {
    router.delete(route('eventos.destroy', id));
  };

  const handleSeleccionar = (evento: Evento) => {
    if (evento.estado === 'finalizado') {
      setEventoParaConfirmar(evento);
    } else {
      router.post(route('eventos.seleccionar', evento.id_evento));
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

      {/* Header con Logo, Theme Toggle y Logout */}
      <div className="bg-card text-card-foreground border-b border-border shadow-sm sticky top-0 z-20 backdrop-blur-md safe-top">
        <div className="container mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Calendar className="h-7 w-7 text-primary shrink-0" />
            <h1 className="text-lg sm:text-2xl font-bold truncate">Gestión de Eventos</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AppearanceToggleDropdown />
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href={route('logout')} method="post" as="button">
                Cerrar Sesión
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col gap-4 mb-8">
          {/* Botón crear primero */}
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto self-start rounded-xl shadow-md">
            <Link href={route('eventos.create')}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Nuevo Evento
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Eventos de Orquídeas</h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">Seleccione el evento con el que desea trabajar</p>
            </div>

            {/* Toggle para mostrar/ocultar finalizados */}
            <div className="flex items-center space-x-3 bg-card text-card-foreground p-3.5 rounded-xl border border-border shadow-sm">
              <Switch
                id="mostrar-finalizados"
                checked={mostrarFinalizados}
                onCheckedChange={setMostrarFinalizados}
              />
              <Label htmlFor="mostrar-finalizados" className="cursor-pointer flex items-center gap-2 text-sm">
                {mostrarFinalizados ? (
                  <><Eye className="h-4 w-4 text-primary" /> Mostrar finalizados ({eventosFinalizadosCount})</>
                ) : (
                  <><EyeOff className="h-4 w-4 text-muted-foreground" /> Ocultar finalizados ({eventosFinalizadosCount})</>
                )}
              </Label>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-4">
          Mostrando {eventosFiltrados.length} de {eventos.total} eventos
          {!mostrarFinalizados && eventosFinalizadosCount > 0 && (
            <span className="text-amber-500 ml-2 font-medium">
              ({eventosFinalizadosCount} finalizado{eventosFinalizadosCount !== 1 ? 's' : ''} oculto{eventosFinalizadosCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {eventosFiltrados.map((evento) => (
            <Card key={evento.id_evento} className={`rounded-2xl transition-all duration-200 border-border hover:shadow-lg ${
              evento.estado === 'finalizado' ? 'border-amber-500/30 bg-amber-500/5' : 'hover:border-primary/40'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg sm:text-xl mb-1.5 flex items-center gap-2 font-bold truncate">
                      {evento.nombre_evento}
                      {evento.estado === 'finalizado' && <Lock className="h-4 w-4 text-amber-500 shrink-0" />}
                    </CardTitle>
                    <Badge className={getEstadoBadge(evento.estado).variant === 'default' ? 'bg-emerald-600 text-white' : ''} variant={getEstadoBadge(evento.estado).variant}>
                      {evento.estado}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {evento.descripcion && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{evento.descripcion}</p>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>Inicio: {formatDate(evento.fecha_inicio)}</span>
                    </div>
                    {evento.fecha_fin && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>Fin: {formatDate(evento.fecha_fin)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border/80 space-y-2">
                    {/* Advertencia para eventos finalizados */}
                    {evento.estado === 'finalizado' && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        <span>Evento finalizado - Solo lectura</span>
                      </div>
                    )}

                    {/* Botón seleccionar */}
                    <Button
                      onClick={() => handleSeleccionar(evento)}
                      className={`w-full rounded-xl ${
                        evento.estado === 'finalizado'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md'
                      }`}
                      size="sm"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {evento.estado === 'finalizado' ? 'Seleccionar (Solo lectura)' : 'Seleccionar Evento'}
                    </Button>

                    {/* Botones editar/eliminar */}
                    <div className="flex gap-2">
                      <Button
                        asChild={evento.estado !== 'finalizado'}
                        size="sm"
                        variant="outline"
                        className="flex-1 rounded-xl"
                        disabled={evento.estado === 'finalizado'}
                      >
                        {evento.estado === 'finalizado' ? (
                          <div className="flex items-center justify-center gap-2 text-muted-foreground cursor-not-allowed">
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

        {/* Modal estético para confirmación de evento finalizado */}
        <AlertDialog
          open={!!eventoParaConfirmar}
          onOpenChange={(open) => !open && setEventoParaConfirmar(null)}
        >
          <AlertDialogContent className="rounded-2xl border-border bg-card shadow-2xl max-w-md">
            <AlertDialogHeader className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <AlertDialogTitle className="text-center text-lg font-bold">
                Evento Finalizado (Modo Consulta)
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-muted-foreground text-sm">
                Este evento ha concluido. Podrás consultar el catálogo de orquídeas, participantes, premiaciones y reportes en modo de solo lectura.
              </AlertDialogDescription>
              {eventoParaConfirmar && (
                <div className="p-3 bg-muted/60 rounded-xl border border-border/60 text-sm font-semibold text-foreground text-center">
                  {eventoParaConfirmar.nombre_evento}
                </div>
              )}
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-center gap-2 mt-4">
              <AlertDialogCancel className="rounded-xl">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (eventoParaConfirmar) {
                    router.post(route('eventos.seleccionar', eventoParaConfirmar.id_evento));
                  }
                }}
                className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md"
              >
                Acceder al Evento
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SimpleLayout>
  );
}
