import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { columns } from "./Columns"
import { DataTable } from "./data-table"
import React from 'react';
import { Button } from "@/components/ui/button"
import { Slash, Plus, Download } from "lucide-react"
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
  Cod_Grupo: string;
}

interface Clase {
  id_clase: number;
  nombre_clase: string;
  id_grupp: number;
}

interface Participante {
  id: number;
  nombre: string;
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
}

export default function OrquideasIndex({ orquideas }: OrquideasIndexProps) {
  console.log('Datos recibidos:', orquideas);
  console.log('Tipo de datos:', typeof orquideas);
  console.log('Es array:', Array.isArray(orquideas));

  const tableData = orquideas || []

  console.log('Datos de la tabla:', tableData);
  console.log('Longitud de datos:', tableData.length);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registro de Orquídeas" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <h1 className="text-2xl font-bold">Registro de Orquídeas</h1>

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

        <div className='flex justify-between items-center'>
          <div className="text-sm text-muted-foreground">
            Total de orquídeas registradas: {tableData.length}
          </div>

          <div className="flex items-center gap-2">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="/docsDonwload/ClasesOrquideas.pdf" target="_blank" rel="noopener noreferrer" download>
                <Download className="mr-2 h-4 w-4" />
                Descargar Formato Inscripción
              </a>
            </Button>

            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href={route('orquideas.create')}>
                <Plus className="mr-2 h-4 w-4" />
                Registrar Orquídea
              </Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto">
          <DataTable columns={columns} data={tableData} />
        </div>
      </div>
    </AppLayout>
  );
}
