import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slash, ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Eventos',
    href: '/eventos',
  },
  {
    title: 'Crear Evento',
    href: '/eventos/create',
  },
];

export default function CreateEvento() {
  const { data, setData, post, processing, errors } = useForm({
    nombre_evento: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'programado',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('eventos.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Crear Evento" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Crear Nuevo Evento</h1>
          <Button asChild variant="outline">
            <Link href={route('eventos.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Eventos
            </Link>
          </Button>
        </div>

        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <li>
                <BreadcrumbLink href={route('eventos.index')}>Eventos</BreadcrumbLink>
              </li>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <li>
                <BreadcrumbPage>Crear Evento</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle>Información del Evento</CardTitle>
              <CardDescription>
                Complete los datos del nuevo evento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre_evento">Nombre del Evento *</Label>
                  <Input
                    id="nombre_evento"
                    type="text"
                    value={data.nombre_evento}
                    onChange={(e) => setData('nombre_evento', e.target.value)}
                    placeholder="Ej: Exposición de Orquídeas 2025"
                    className={errors.nombre_evento ? 'border-red-500' : ''}
                  />
                  {errors.nombre_evento && (
                    <p className="text-sm text-red-600">{errors.nombre_evento}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={data.descripcion}
                    onChange={(e) => setData('descripcion', e.target.value)}
                    placeholder="Descripción del evento..."
                    rows={4}
                    className={errors.descripcion ? 'border-red-500' : ''}
                  />
                  {errors.descripcion && (
                    <p className="text-sm text-red-600">{errors.descripcion}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
                    <Input
                      id="fecha_inicio"
                      type="date"
                      value={data.fecha_inicio}
                      onChange={(e) => setData('fecha_inicio', e.target.value)}
                      className={errors.fecha_inicio ? 'border-red-500' : ''}
                    />
                    {errors.fecha_inicio && (
                      <p className="text-sm text-red-600">{errors.fecha_inicio}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fecha_fin">Fecha de Fin</Label>
                    <Input
                      id="fecha_fin"
                      type="date"
                      value={data.fecha_fin}
                      onChange={(e) => setData('fecha_fin', e.target.value)}
                      min={data.fecha_inicio}
                      className={errors.fecha_fin ? 'border-red-500' : ''}
                    />
                    {errors.fecha_fin && (
                      <p className="text-sm text-red-600">{errors.fecha_fin}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado del Evento *</Label>
                  <Select
                    value={data.estado}
                    onValueChange={(value) => setData('estado', value)}
                  >
                    <SelectTrigger className={errors.estado ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programado">Programado</SelectItem>
                      <SelectItem value="en curso">En Curso</SelectItem>
                      <SelectItem value="finalizado">Finalizado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.estado && (
                    <p className="text-sm text-red-600">{errors.estado}</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={processing} className="flex-1">
                    {processing ? 'Creando...' : 'Crear Evento'}
                  </Button>
                  <Button type="button" variant="outline" asChild className="flex-1">
                    <Link href={route('eventos.index')}>
                      Cancelar
                    </Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
