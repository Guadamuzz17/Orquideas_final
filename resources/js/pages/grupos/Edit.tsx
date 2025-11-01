import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    title: 'Grupos de Orquídeas',
    href: '/grupos',
  },
  {
    title: 'Editar Grupo',
    href: '#',
  },
];

interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
  Cod_Grupo: string;
}

interface EditGrupoProps {
  grupo: Grupo;
}

export default function EditGrupo({ grupo }: EditGrupoProps) {
  const { data, setData, put, processing, errors } = useForm({
    nombre_grupo: grupo.nombre_grupo || '',
    Cod_Grupo: grupo.Cod_Grupo || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('grupos.update', grupo.id_grupo));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Grupo - ${grupo.nombre_grupo}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Editar Grupo</h1>
          <Button asChild variant="outline">
            <Link href={route('grupos.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Grupos
            </Link>
          </Button>
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
                <BreadcrumbPage>Editar Grupo</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle>Editar Información del Grupo</CardTitle>
              <CardDescription>
                Modifique los datos del grupo "{grupo.nombre_grupo}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre_grupo">Nombre del Grupo *</Label>
                  <Input
                    id="nombre_grupo"
                    type="text"
                    value={data.nombre_grupo}
                    onChange={(e) => setData('nombre_grupo', e.target.value)}
                    placeholder="Ej: Grupo A: Cattleya unifoliadas"
                    className={errors.nombre_grupo ? 'border-red-500' : ''}
                  />
                  {errors.nombre_grupo && (
                    <p className="text-sm text-red-600">{errors.nombre_grupo}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Cod_Grupo">Código del Grupo *</Label>
                  <Input
                    id="Cod_Grupo"
                    type="text"
                    value={data.Cod_Grupo}
                    onChange={(e) => setData('Cod_Grupo', e.target.value)}
                    placeholder="Ej: GRP-A"
                    className={errors.Cod_Grupo ? 'border-red-500' : ''}
                  />
                  {errors.Cod_Grupo && (
                    <p className="text-sm text-red-600">{errors.Cod_Grupo}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Código único que identificará este grupo
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={processing} className="flex-1">
                    {processing ? 'Actualizando...' : 'Actualizar Grupo'}
                  </Button>
                  <Button type="button" variant="outline" asChild className="flex-1">
                    <Link href={route('grupos.index')}>
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
