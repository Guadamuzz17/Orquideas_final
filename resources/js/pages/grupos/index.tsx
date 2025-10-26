import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slash, Plus, Download, Edit, Trash2, Eye } from "lucide-react";
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
    title: 'Grupos de Orquídeas',
    href: '/grupos',
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

interface GruposIndexProps {
  grupos: {
    data: Grupo[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default function GruposIndex({ grupos }: GruposIndexProps) {
  const handleDelete = (id: number) => {
    router.delete(route('grupos.destroy', id), {
      onSuccess: () => {
        // Success message will be handled by the flash message system
      },
    });
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/docsDonwload/ClasesOrquideas.pdf';
    link.download = 'ClasesOrquideas.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Grupos de Orquídeas" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <h1 className="text-2xl font-bold">Gestión de Grupos de Orquídeas</h1>

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
                <BreadcrumbPage>Grupos de Orquídeas</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='flex justify-between items-center'>
          <div className="text-sm text-muted-foreground">
            Total de grupos registrados: {grupos.total}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Descargar Clases PDF
            </Button>

            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href={route('grupos.create')}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Grupo
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {grupos.data.map((grupo) => (
            <Card key={grupo.id_grupo} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{grupo.nombre_grupo}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="mt-1">
                        {grupo.Cod_Grupo}
                      </Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={route('grupos.show', grupo.id_grupo)}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={route('grupos.edit', grupo.id_grupo)}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el grupo "{grupo.nombre_grupo}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(grupo.id_grupo)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Clases asociadas:</p>
                    <p className="text-lg font-semibold">
                      {grupo.clases ? grupo.clases.length : 0} clase(s)
                    </p>
                  </div>

                  {grupo.clases && grupo.clases.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Primeras clases:</p>
                      <div className="flex flex-wrap gap-1">
                        {grupo.clases.slice(0, 3).map((clase) => (
                          <Badge key={clase.id_clase} variant="secondary" className="text-xs">
                            {clase.nombre_clase}
                          </Badge>
                        ))}
                        {grupo.clases.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{grupo.clases.length - 3} más
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button asChild size="sm" className="w-full" variant="secondary">
                      <Link href={route('clases.index', { grupo: grupo.id_grupo })}>
                        Ver Clases
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {grupos.data.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 text-center">
                <h3 className="text-lg font-semibold mb-2">No hay grupos registrados</h3>
                <p className="text-sm mb-4">Comienza creando el primer grupo de orquídeas</p>
                <Button asChild>
                  <Link href={route('grupos.create')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primer Grupo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {grupos.last_page > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: grupos.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === grupos.current_page ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={route('grupos.index', { page })}>
                    {page}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
