import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { columns } from "./Columns"
import { DataTable } from "./data-table"
import React from 'react';
import { Button } from "@/components/ui/button"
import { Slash, Plus } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Participantes',
    href: '/participantes',
  },
];

interface TipoParticipante {
  id_tipo: number;
  Clase: string;
}

interface Departamento {
  id_departamento: number;
  nombre_departamento: string;
}

interface Municipio {
  id_municipio: number;
  nombre_municipio: string;
}

interface Asociacion {
  id_aso: number;
  Clase: string;
}

interface Participante {
  id: number;
  nombre: string;
  numero_telefonico: string;
  direccion: string;
  id_tipo: number;
  id_departamento: number;
  id_municipio: number;
  id_aso: number;
  tipo?: TipoParticipante;
  departamento?: Departamento;
  municipio?: Municipio;
  aso?: Asociacion;
}

interface ParticipantesIndexProps {
  participantes: Participante[];
}

export default function ParticipantesIndex({ participantes }: ParticipantesIndexProps) {
  const tableData = participantes || []

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Participantes" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">  
        <h1 className="text-2xl font-bold">Participantes</h1>
        
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
                <BreadcrumbPage>Tabla Participantes</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='flex justify-between items-center'>
          <Button asChild variant="outline">
            <Link href={route('participantes.formato')}>
              <Plus className="mr-2 h-4 w-4" />
              Formato de Juzgamiento
            </Link>
          </Button>
          
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href={route('participantes.create')}>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Participante
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