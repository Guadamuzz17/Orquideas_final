import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Users, ArrowLeft } from "lucide-react";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import AppLayout from '@/layouts/app-layout';

export default function Formato() {
  const handleDownloadFormat = () => {
    // Descargar el archivo PDF desde la ruta especificada
    console.log('Descargando formato de juzgamiento...');
    
    const link = document.createElement('a');
    link.href = '/docsDonwload/FormatoJuzgamiento.pdf'; // Ruta al archivo PDF
    link.download = 'FormatoJuzgamiento.pdf';
    link.target = '_blank'; // Abrir en nueva pestaña si es necesario
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Descargar automáticamente al cargar el componente
  React.useEffect(() => {
    // Pequeño delay para que la página cargue completamente
    const timer = setTimeout(() => {
      handleDownloadFormat();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <Head title="Formato de Juzgamiento - Participantes" />
      
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Formato de Juzgamiento</h1>
          <Button asChild variant="outline">
            <Link href={route('participantes.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Participantes
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
                <BreadcrumbLink href={route('participantes.index')}>Participantes</BreadcrumbLink>
              </li>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <li>
                <BreadcrumbPage>Formato de Juzgamiento</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {/* Card principal del reporte */}
          <Card className="col-span-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Reporte de Orquídeas Asignadas y Registradas</CardTitle>
              <CardDescription className="text-lg">
                Formato oficial para el juzgamiento de orquídeas por participante
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Información del Reporte
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Lista completa de participantes registrados</li>
                  <li>• Orquídeas asignadas a cada participante</li>
                  <li>• Categorías y clasificaciones</li>
                  <li>• Criterios de evaluación</li>
                  <li>• Espacios para puntuación y observaciones</li>
                  <li>• Formato oficial para jueces</li>
                </ul>
              </div>

              <div className="rounded-lg border-2 border-dashed border-blue-200 p-6 text-center">
                <Download className="mx-auto h-12 w-12 text-blue-500 mb-4" />
                <h4 className="text-lg font-semibold mb-2">Descarga en Progreso</h4>
                <p className="text-gray-600 mb-4">
                  El formato oficial en PDF se está descargando automáticamente...
                </p>
                <Button 
                  onClick={handleDownloadFormat}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Descargar Nuevamente
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards adicionales con información */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instrucciones de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Descarga el formato en PDF</li>
                <li>Imprime una copia por cada juez</li>
                <li>Completa la información del participante</li>
                <li>Evalúa cada orquídea según los criterios</li>
                <li>Registra puntuaciones y observaciones</li>
                <li>Entrega el formato completado</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Criterios de Evaluación</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Forma y estructura:</strong> 25 puntos</li>
                <li>• <strong>Color y presentación:</strong> 25 puntos</li>
                <li>• <strong>Tamaño y proporción:</strong> 20 puntos</li>
                <li>• <strong>Calidad general:</strong> 15 puntos</li>
                <li>• <strong>Rareza y singularidad:</strong> 15 puntos</li>
              </ul>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Total máximo:</strong> 100 puntos
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}