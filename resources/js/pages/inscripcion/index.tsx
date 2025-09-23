import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { columns } from "./Columns"
import { DataTable } from "./data-table"
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Leaf, Calendar, Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inscripciones',
    href: '/inscripcion',
  },
];

interface Participante {
  id: number;
  nombre: string;
}

interface Orquidea {
  id_orquidea: number;
  nombre_planta: string;
  origen: string;
}

interface Inscripcion {
  id_nscr: number;
  correlativo: number;
  created_at: string;
  participante: Participante;
  orquidea: Orquidea;
}

interface InscripcionIndexProps {
  inscripciones: Inscripcion[];
}

export default function InscripcionIndex({ inscripciones }: InscripcionIndexProps) {
  const inscripcionesData = inscripciones || [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lista de Inscripciones" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <h1 className="text-2xl font-bold">Lista de Inscripciones</h1>
        
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
                <BreadcrumbPage>Lista de Inscripciones</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Cards de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inscripciones
              </CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inscripcionesData.length}</div>
              <p className="text-xs text-muted-foreground">
                Orquídeas inscritas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Participantes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(inscripcionesData.map(i => i.participante.id)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Participantes únicos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Último Correlativo
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inscripcionesData.length > 0 ? Math.max(...inscripcionesData.map(i => i.correlativo)) : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Número más alto asignado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-between items-center'>
          <div className="text-sm text-muted-foreground">
            Total de inscripciones: {inscripcionesData.length}
          </div>
          
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href={route('inscripcion.create')}>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Inscripción
            </Link>
          </Button>
        </div>

        <div className="container mx-auto">
          <DataTable columns={columns} data={inscripcionesData} />
        </div>
      </div>
    </AppLayout>
  );
}