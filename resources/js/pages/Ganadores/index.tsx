import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { columns } from "./Columns"
import { DataTable } from "./data-table"
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Award, Calendar, Plus, Slash } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Ganadores',
    href: '/ganadores',
  },
];

interface Participante {
  id: number;
  nombre: string;
}

interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
}

interface Clase {
  id_clase: number;
  nombre_clase: string;
}

interface Orquidea {
  id_orquidea: number;
  nombre_planta: string;
  origen: string;
  grupo?: Grupo;
  clase?: Clase;
}

interface Inscripcion {
  id_nscr: number;
  correlativo: number;
  participante: Participante;
  orquidea: Orquidea;
}

interface Ganador {
  id_ganador: number;
  posicion: number;
  empate: boolean;
  fecha_ganador: string;
  inscripcion: Inscripcion;
}

interface GanadoresIndexProps {
  ganadores: Ganador[];
}

export default function GanadoresIndex({ ganadores }: GanadoresIndexProps) {
  const tableData = ganadores || []

  // Calcular estadísticas
  const totalGanadores = tableData.length;
  const participantesUnicos = new Set(tableData.map(g => g.inscripcion.participante.id)).size;
  const primerLugar = tableData.filter(g => g.posicion === 1).length;
  const empates = tableData.filter(g => g.empate).length;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Lista de Ganadores" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">  
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-600" />
          Lista de Ganadores
        </h1>
        
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
                <BreadcrumbPage>Lista de Ganadores</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Cards de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Ganadores
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGanadores}</div>
              <p className="text-xs text-muted-foreground">
                Premios otorgados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Participantes Premiados
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{participantesUnicos}</div>
              <p className="text-xs text-muted-foreground">
                Participantes únicos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Primeros Lugares
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{primerLugar}</div>
              <p className="text-xs text-muted-foreground">
                🥇 Medallas de oro
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Empates
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empates}</div>
              <p className="text-xs text-muted-foreground">
                Posiciones empatadas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-between items-center'>
          <div className="text-sm text-muted-foreground">
            Total de ganadores: {tableData.length}
          </div>
          
          <Button asChild className="bg-yellow-600 hover:bg-yellow-700">
            <Link href={route('ganadores.create')}>
              <Plus className="mr-2 h-4 w-4" />
              Asignar Ganador
            </Link>
          </Button>
        </div>

        <div className="container mx-auto">
          <DataTable columns={columns} data={tableData} />
        </div>
      </div>
    </AppLayout>
  );
}