import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { columns } from "./Columns"
import { DataTable } from "./data-table"
import React from 'react';
import { Button } from "@/components/ui/button"
import { Slash, Plus, Download, FileSpreadsheet, FileText } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Registro de Orquídeas',
    href: '/orquideas',
  },
];

interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
}

interface Clase {
  id_clase: number;
  nombre_clase: string;
  id_grupo: number;
}

interface Participante {
  id_participante: number;
  nombre_participante: string;
}

interface Orquidea {
  id_orquidea: number;
  nombre_planta: string;
  origen: string;
  foto?: string;
  id_grupo: number;
  id_clase: number;
  cantidad: number;
  id_participante: number;
  grupo?: Grupo;
  clase?: Clase;
  participante?: Participante;
  created_at?: string;
  updated_at?: string;
}

interface OrquideasIndexProps {
  orquideas: Orquidea[];
  participantes: Participante[];
  grupos: Grupo[];
  clases: Clase[];
}

export default function OrquideasIndex({ orquideas, participantes, grupos, clases }: OrquideasIndexProps) {
  console.log('Datos recibidos:', orquideas);
  console.log('Tipo de datos:', typeof orquideas);
  console.log('Es array:', Array.isArray(orquideas));

  const tableData = orquideas || []

  console.log('Datos de la tabla:', tableData);
  console.log('Longitud de datos:', tableData.length);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registro de Orquídeas" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 md:p-8">
        <h1 className="text-xl sm:text-2xl font-bold">Orquideas Registradas</h1>

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
                <BreadcrumbPage>Catálogo de Orquídeas</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
          <div className="text-sm text-muted-foreground">
            Total de orquídeas registradas: {tableData.length}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Botones de descarga de reportes */}
            <Button
              onClick={() => window.open(route('orquideas.reporte.pdf'), '_blank')}
              variant="outline"
              size="sm"
              className="bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30"
            >
              <FileText className="mr-1.5 h-4 w-4" />
              PDF
            </Button>

            <Button
              onClick={() => window.open(route('orquideas.reporte.excel'), '_blank')}
              variant="outline"
              size="sm"
              className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
            >
              <FileSpreadsheet className="mr-1.5 h-4 w-4" />
              Excel
            </Button>

            <Button
              onClick={() => window.open(route('orquideas.reporte.csv'), '_blank')}
              variant="outline"
              size="sm"
              className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30"
            >
              <Download className="mr-1.5 h-4 w-4" />
              CSV
            </Button>

            <div className="hidden sm:block h-6 w-px bg-border mx-1"></div>

            <Button asChild variant="outline" size="sm">
              <a href="/docsDonwload/ClasesOrquideas.pdf" target="_blank" rel="noopener noreferrer" download>
                <Download className="mr-1.5 h-4 w-4" />
                Formato PDF
              </a>
            </Button>

            <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
              <Link href={route('orquideas.create')}>
                <Plus className="mr-1.5 h-4 w-4" />
                Registrar Orquídea
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-full overflow-hidden">
          <DataTable columns={columns(participantes, grupos, clases)} data={tableData} />
        </div>
      </div>
    </AppLayout>
  );
}
