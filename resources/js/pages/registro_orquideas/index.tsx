import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Payment, columns } from "./Columns"
import { DataTable } from "./data-table"
import React from 'react';
import { Button } from "@/components/ui/button"


import { Slash } from "lucide-react"
 
import {
  Breadcrumb,
  
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventario',
        href: '/inventario',
    },
];

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "m5gr84i9",
      amount: 316,
      status: "success",
      email: "ken99@example.com",
    },
    {
      id: "3u1reuv4",
      amount: 242,
      status: "success",
      email: "Abe45@example.com",
    },
    {
      id: "derv1ws0",
      amount: 837,
      status: "processing",
      email: "Monserrat44@example.com",
    },
    {
      id: "5kma53ae",
      amount: 874,
      status: "success",
      email: "Silas22@example.com",
    },
    {
      id: "bhqecj4p",
      amount: 721,
      status: "failed",
      email: "carmella@example.com",
    },
    
    // ...
  ]
}

export default function Dashboard() {

    const [data, setData] = React.useState<Payment[]>([]);

    React.useEffect(() => {
        getData().then((fetchedData) => setData(fetchedData));
    }, []);
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Compras" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
            <h1 className="text-2xl font-bold">Inventario</h1>  
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
                    <BreadcrumbPage>Tabla Inventario</BreadcrumbPage>
                  </li>
                  
                </BreadcrumbList>
              </Breadcrumb>
            </div>
              <div className='text-right'>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Nuevo Inventario
                </Button>
              </div>
              <div className="container mx-auto  ">
                <DataTable columns={columns} data={data} />
              </div>

                  {/* Cuarta fila con contenido principal */}
                  <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                  </div>
              </div>
        </AppLayout>
    );
}