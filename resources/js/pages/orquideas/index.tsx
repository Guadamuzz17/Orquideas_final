import { Link, usePage, Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Plus, Eye, Edit, Flower2 } from 'lucide-react';

interface Orquidea {
  id_orquidea: number;
  codigo_orquide: string;
  nombre_planta?: string;
  participante?: { nombre: string };
  grupo?: { Cod_Grupo: string; nombre_grupo: string };
  clase?: { nombre_clase: string };
}

interface PageProps {
  orquideas: { data: Orquidea[] };
  [key: string]: any;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Catálogo de Orquídeas', href: '/orquideas' },
];

export default function Index() {
  const { orquideas } = usePage<PageProps>().props;
  const dataList = orquideas?.data || [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Catálogo de Orquídeas" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Flower2 className="h-6 w-6 text-primary" />
              Catálogo de Orquídeas
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Inventario de plantas registradas
            </p>
          </div>
          <Button asChild className="w-fit">
            <Link href={route('orquideas.create')}>
              <Plus className="mr-1.5 h-4 w-4" />
              Registrar Nueva Orquídea
            </Link>
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader className="py-4 px-6 border-b border-border">
            <CardTitle className="text-base text-foreground font-medium">
              Total registradas: {dataList.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full overflow-x-auto touch-scroll">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/60 text-muted-foreground uppercase text-[11px] font-semibold border-b border-border">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Correlativo</th>
                    <th className="px-4 py-3">Participante</th>
                    <th className="px-4 py-3">Código Grupo</th>
                    <th className="px-4 py-3">Clase</th>
                    <th className="px-4 py-3">Nombre Grupo</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dataList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No hay orquídeas registradas en esta vista
                      </td>
                    </tr>
                  ) : (
                    dataList.map((o) => (
                      <tr key={o.id_orquidea} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{o.id_orquidea}</td>
                        <td className="px-4 py-3 text-muted-foreground">{o.codigo_orquide || '-'}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{o.participante?.nombre || '-'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{o.grupo?.Cod_Grupo || '-'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{o.clase?.nombre_clase || '-'}</td>
                        <td className="px-4 py-3 text-muted-foreground">{o.grupo?.nombre_grupo || '-'}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-blue-600 dark:text-blue-400">
                              <Link href={route('orquideas.show', o.id_orquidea)}>
                                <Eye className="h-3.5 w-3.5 mr-1" /> Ver
                              </Link>
                            </Button>
                            <Button asChild size="sm" variant="ghost" className="h-8 px-2 text-emerald-600 dark:text-emerald-400">
                              <Link href={route('orquideas.edit', o.id_orquidea)}>
                                <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                              </Link>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
