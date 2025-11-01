import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    title: 'Clases de Orquídeas',
    href: '/clases',
  },
  {
    title: 'Editar Clase',
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
}

interface EditClaseProps {
  clase: Clase;
  grupos: Grupo[];
}

export default function EditClase({ clase, grupos }: EditClaseProps) {
  const { data, setData, put, processing, errors } = useForm({
    nombre_clase: clase.nombre_clase || '',
    id_grupo: clase.id_grupp?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('clases.update', clase.id_clase));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Editar Clase - ${clase.nombre_clase}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Editar Clase</h1>
          <Button asChild variant="outline">
            <Link href={route('clases.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Clases
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
                <BreadcrumbLink href={route('clases.index')}>Clases</BreadcrumbLink>
              </li>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <li>
                <BreadcrumbPage>Editar Clase</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <Card>
            <CardHeader>
              <CardTitle>Editar Información de la Clase</CardTitle>
              <CardDescription>
                Modifique los datos de la clase "{clase.nombre_clase}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre_clase">Nombre de la Clase *</Label>
                  <Input
                    id="nombre_clase"
                    type="text"
                    value={data.nombre_clase}
                    onChange={(e) => setData('nombre_clase', e.target.value)}
                    placeholder="Ej: Clase 1: Cattleya labiata alba"
                    className={errors.nombre_clase ? 'border-red-500' : ''}
                  />
                  {errors.nombre_clase && (
                    <p className="text-sm text-red-600">{errors.nombre_clase}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_grupo">Grupo *</Label>
                  <Select
                    value={data.id_grupo}
                    onValueChange={(value) => setData('id_grupo', value)}
                  >
                    <SelectTrigger className={errors.id_grupo ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecciona un grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {grupos.map((grupo) => (
                        <SelectItem key={grupo.id_grupo} value={grupo.id_grupo.toString()}>
                          {grupo.Cod_Grupo} - {grupo.nombre_grupo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.id_grupo && (
                    <p className="text-sm text-red-600">{errors.id_grupo}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Selecciona el grupo al que pertenecerá esta clase
                  </p>
                </div>

                {grupos.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      No hay grupos disponibles.
                      <Link href={route('grupos.create')} className="underline ml-1">
                        Crear un grupo primero
                      </Link>
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={processing || grupos.length === 0}
                    className="flex-1"
                  >
                    {processing ? 'Actualizando...' : 'Actualizar Clase'}
                  </Button>
                  <Button type="button" variant="outline" asChild className="flex-1">
                    <Link href={route('clases.index')}>
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
