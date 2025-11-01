import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slash, ArrowLeft, Edit, Calendar } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Grupos de Orquídeas',
    href: '/grupos',
  },
  {
    title: 'Ver Grupo',
    href: '#',
  },
];

interface Clase {
  id_clase: number;
  nombre_clase: string;
  id_grupo: number;
}

interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
  Cod_Grupo: string;
  clases?: Clase[];
  created_at?: string;
  updated_at?: string;
}

interface ShowGrupoProps {
  grupo: Grupo;
}

export default function ShowGrupo({ grupo }: ShowGrupoProps) {
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
      <Head title={`Ver Grupo - ${grupo.nombre_grupo}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Detalles del Grupo</h1>
          <div className="flex gap-2">
            <Button asChild variant="default">
              <Link href={route('grupos.edit', grupo.id_grupo)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Grupo
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={route('grupos.index')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Grupos
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
                <BreadcrumbLink href={route('grupos.index')}>Grupos</BreadcrumbLink>
              </li>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <li>
                <BreadcrumbPage>Ver Grupo</BreadcrumbPage>
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
                  <CardTitle className="text-2xl">{grupo.nombre_grupo}</CardTitle>
                  <CardDescription className="mt-2">
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {grupo.Cod_Grupo}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Nombre del Grupo</p>
                    <p className="text-lg">{grupo.nombre_grupo}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Código del Grupo</p>
                    <p className="text-lg">{grupo.Cod_Grupo}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Fecha de Creación
                    </div>
                    <p className="text-sm">{formatDate(grupo.created_at)}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Última Actualización
                    </div>
                    <p className="text-sm">{formatDate(grupo.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clases Asociadas */}
          <Card>
            <CardHeader>
              <CardTitle>Clases Asociadas</CardTitle>
              <CardDescription>
                Este grupo tiene {grupo.clases ? grupo.clases.length : 0} clase(s) asociada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {grupo.clases && grupo.clases.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {grupo.clases.map((clase, index) => (
                      <div
                        key={clase.id_clase}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{clase.nombre_clase}</p>
                            <p className="text-sm text-gray-500">ID: {clase.id_clase}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Clase</Badge>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button asChild className="w-full" variant="outline">
                      <Link href={route('clases.index', { grupo: grupo.id_grupo })}>
                        Ver Todas las Clases
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No hay clases asociadas a este grupo</p>
                  <Button asChild variant="outline">
                    <Link href={route('clases.create', { grupo: grupo.id_grupo })}>
                      Crear Primera Clase
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
                    {grupo.clases ? grupo.clases.length : 0}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Clases Totales</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {grupo.Cod_Grupo}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Código de Grupo</p>
                </div>
                <div className="p-4 border rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    #{grupo.id_grupo}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">ID del Grupo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
