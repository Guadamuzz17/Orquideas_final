import { Link, usePage, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Flower2, Image as ImageIcon } from 'lucide-react';

interface PageProps {
  orquidea: {
    id_orquidea: number;
    nombre_planta?: string;
    origen?: string;
    foto?: string;
    grupo?: { Cod_Grupo?: string; nombre_grupo?: string };
    clase?: { nombre_clase?: string };
    participante?: { nombre?: string };
  };
  [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Catálogo de Orquídeas', href: '/orquideas' },
  { title: 'Detalle de Orquídea', href: '#' },
];

export default function Show() {
  const { orquidea } = usePage<PageProps>().props;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Orquídea: ${orquidea?.nombre_planta || 'Detalle'}`} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Flower2 className="h-6 w-6 text-primary" />
            Detalle de Orquídea
          </h1>
          <Button asChild variant="outline">
            <Link href={route('orquideas.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Información de la Planta</CardTitle>
              <CardDescription>Datos taxonómicos y de registro</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Nombre:</span>
                <span className="font-semibold text-foreground">{orquidea?.nombre_planta || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Origen:</span>
                <span className="font-medium text-foreground">{orquidea?.origen || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Grupo:</span>
                <span className="font-medium text-foreground">
                  {orquidea?.grupo ? `${orquidea.grupo.Cod_Grupo || ''} ${orquidea.grupo.nombre_grupo || ''}` : '-'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Clase:</span>
                <span className="font-medium text-foreground">{orquidea?.clase?.nombre_clase || '-'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border">
                <span className="text-muted-foreground">Participante:</span>
                <span className="font-medium text-foreground">{orquidea?.participante?.nombre || '-'}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Fotografía</CardTitle>
              <CardDescription>Imagen registrada</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[220px]">
              {orquidea?.foto ? (
                <img
                  src={`/storage/orquideas/${orquidea.foto}`}
                  alt={orquidea.nombre_planta || 'Foto orquídea'}
                  className="rounded-lg max-h-64 w-auto object-cover border border-border shadow-sm"
                />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/40 mb-2" />
                  <p>No hay foto disponible</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
