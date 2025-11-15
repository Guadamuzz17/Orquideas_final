import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, Calendar, Users, Leaf, Trophy, FileSpreadsheet } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Reportes por Eventos',
    href: '/reportes-evento',
  },
];

interface Evento {
  id_evento: number;
  nombre_evento: string;
  fecha_inicio: string;
  fecha_fin?: string;
}

interface Props {
  evento: Evento;
}

export default function ReportesEventoIndex({ evento }: Props) {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const reportes = [
    {
      title: "Inscripciones del Evento",
      description: `Listado completo de todas las inscripciones realizadas en ${evento.nombre_evento}`,
      icon: <FileText className="h-8 w-8" />,
      color: "from-blue-500 to-blue-600",
      route: 'reportes.evento.inscripciones.pdf',
      useFechas: true,
    },
    {
      title: "Plantas por Clases",
      description: "Clasificación de plantas por grupo y clase del evento",
      icon: <Leaf className="h-8 w-8" />,
      color: "from-green-500 to-green-600",
      route: 'reportes.evento.plantas_por_clases.pdf',
      useFechas: false,
    },
    {
      title: "Orquídeas Ganadoras",
      description: "Listado de ganadores y posiciones del evento",
      icon: <Trophy className="h-8 w-8" />,
      color: "from-yellow-500 to-yellow-600",
      route: 'reportes.evento.ganadores.pdf',
      useFechas: false,
    },
  ];

  const handleDescargar = (routeName: string, useFechas: boolean) => {
    let url = route(routeName);

    if (useFechas && (fechaInicio || fechaFin)) {
      const params = new URLSearchParams();
      if (fechaInicio) params.append('from', fechaInicio);
      if (fechaFin) params.append('to', fechaFin);
      url = `${url}?${params.toString()}`;
    }

    window.open(url, '_blank');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Reportes - ${evento.nombre_evento}`} />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-10">
        {/* Header con información del evento */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-4">
            <FileSpreadsheet className="h-12 w-12" />
            <div>
              <h1 className="text-3xl font-bold">Reportes por Eventos</h1>
              <p className="text-blue-100 mt-1">
                Generando reportes para: <span className="font-semibold">{evento.nombre_evento}</span>
              </p>
              {evento.fecha_inicio && (
                <p className="text-sm text-blue-100 mt-1">
                  Período: {new Date(evento.fecha_inicio).toLocaleDateString('es-ES')}
                  {evento.fecha_fin && ` - ${new Date(evento.fecha_fin).toLocaleDateString('es-ES')}`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Filtros de fecha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtros de Fecha (Opcional)
            </CardTitle>
            <CardDescription>
              Aplicar filtros de fecha para reportes de inscripciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_fin">Fecha Fin</Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={fechaInicio}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportes.map((reporte, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${reporte.color} flex items-center justify-center text-white mb-4`}>
                  {reporte.icon}
                </div>
                <CardTitle>{reporte.title}</CardTitle>
                <CardDescription>{reporte.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleDescargar(reporte.route, reporte.useFechas)}
                  className="w-full"
                  variant="default"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Botón para volver */}
        <div className="flex justify-center mt-6">
          <Button asChild variant="outline" size="lg">
            <Link href={route('dashboard')}>
              Volver al Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
