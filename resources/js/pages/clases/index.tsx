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
    title: 'Clases de Orquídeas',
    href: '/clases',
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
  id_grupo: number;
  grupo?: Grupo;
  created_at?: string;
  updated_at?: string;
}

interface ClasesIndexProps {
  clases: {
    data: Clase[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  grupos: Grupo[];
}

export default function ClasesIndex({ clases, grupos }: ClasesIndexProps) {
  const handleDelete = (id: number) => {
    router.delete(route('clases.destroy', id), {
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
      <Head title="Clases de Orquídeas" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <h1 className="text-2xl font-bold">Gestión de Clases de Orquídeas</h1>

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
                <BreadcrumbPage>Clases de Orquídeas</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='flex justify-between items-center'>
          <div className="text-sm text-muted-foreground">
            Total de clases registradas: {clases.total}
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
              <Download className="mr-2 h-4 w-4" />
              Descargar Clases PDF
            </Button>

            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link href={route('grupos.index')}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Grupos
              </Link>
            </Button>

            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href={route('clases.create')}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Clase
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {clases.data.map((clase) => (
            <Card key={clase.id_clase} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{clase.nombre_clase}</CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Grupo:</span>
                        <Badge variant="secondary">
                          {clase.grupo ? `${clase.grupo.Cod_Grupo} - ${clase.grupo.nombre_grupo}` : 'Sin grupo'}
                        </Badge>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={route('clases.show', clase.id_clase)}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={route('clases.edit', clase.id_clase)}>
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
                            Esta acción no se puede deshacer. Se eliminará permanentemente la clase "{clase.nombre_clase}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(clase.id_clase)}
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
            </Card>
          ))}
        </div>

        {clases.data.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 text-center">
                <h3 className="text-lg font-semibold mb-2">No hay clases registradas</h3>
                <p className="text-sm mb-4">Comienza creando la primera clase de orquídeas</p>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <Link href={route('grupos.index')}>
                      Ver Grupos
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={route('clases.create')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Crear Primera Clase
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {clases.last_page > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: clases.last_page }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === clases.current_page ? "default" : "outline"}
                  size="sm"
                  asChild
                >
                  <Link href={route('clases.index', { page })}>
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
