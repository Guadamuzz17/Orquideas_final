import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slash, ArrowLeft, Edit, Calendar, Tag } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Clases de Orquídeas',
    href: '/clases',
  },
  {
    title: 'Ver Clase',
    href: '#',
  },
];

interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
  Cod_Grupo: string;
}

interface Clase {
  id_clase: number;
  nombre_clase: string;
  id_grupp: number;
  grupo?: Grupo;
  created_at?: string;
  updated_at?: string;
}

interface ShowClaseProps {
  clase: Clase;
}

export default function ShowClase({ clase }: ShowClaseProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Ver Clase - ${clase.nombre_clase}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Detalles de la Clase</h1>
          <div className="flex gap-2">
            <Button asChild variant="default">
              <Link href={route('clases.edit', clase.id_clase)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Clase
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={route('clases.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Clases
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <li>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </li>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <li>
                <BreadcrumbLink href={route('clases.index')}>Clases</BreadcrumbLink>
              </li>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <li>
                <BreadcrumbPage>Ver Clase</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-6">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{clase.nombre_clase}</CardTitle>
                  <CardDescription className="mt-2">
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      Clase ID: {clase.id_clase}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Nombre de la Clase</p>
                    <p className="text-lg">{clase.nombre_clase}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">ID de la Clase</p>
                    <p className="text-lg">#{clase.id_clase}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Fecha de Creación
                    </div>
                    <p className="text-sm">{formatDate(clase.created_at)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Última Actualización
                    </div>
                    <p className="text-sm">{formatDate(clase.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Grupo */}
          <Card>
            <CardHeader>
              <CardTitle>Grupo Asociado</CardTitle>
              <CardDescription>
                Información del grupo al que pertenece esta clase
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clase.grupo ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600">
                        <Tag className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{clase.grupo.nombre_grupo}</p>
                        <p className="text-sm text-gray-500">
                          Código: <Badge variant="outline">{clase.grupo.Cod_Grupo}</Badge>
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={route('grupos.show', clase.grupo.id_grupo)}>
                        Ver Grupo
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Nombre del Grupo</p>
                      <p className="text-base">{clase.grupo.nombre_grupo}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Código del Grupo</p>
                      <p className="text-base">{clase.grupo.Cod_Grupo}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No hay grupo asociado a esta clase</p>
                  <Button asChild variant="outline">
                    <Link href={route('clases.edit', clase.id_clase)}>
                      Asignar Grupo
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estadísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    #{clase.id_clase}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">ID de la Clase</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {clase.grupo ? '1' : '0'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Grupo Asignado</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {clase.grupo?.Cod_Grupo || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Código del Grupo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button asChild variant="outline" className="h-auto py-4">
                  <Link href={route('clases.edit', clase.id_clase)}>
                    <div className="flex flex-col items-center gap-2">
                      <Edit className="h-5 w-5" />
                      <span>Editar Clase</span>
                    </div>
                  </Link>
                </Button>
                {clase.grupo && (
                  <Button asChild variant="outline" className="h-auto py-4">
                    <Link href={route('grupos.show', clase.grupo.id_grupo)}>
                      <div className="flex flex-col items-center gap-2">
                        <Tag className="h-5 w-5" />
                        <span>Ver Grupo</span>
                      </div>
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
