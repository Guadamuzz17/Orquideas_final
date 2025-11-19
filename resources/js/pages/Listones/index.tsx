import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Trash2, Award, Calendar, User, Leaf } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Competición',
    href: '/competicion',
  },
  {
    title: 'Listones',
    href: '/listones',
  },
];

interface Liston {
  id_liston: number;
  correlativo: string;
  participante: string;
  orquidea: string;
  grupo: string;
  clase: string;
  tipo_liston: string;
  descripcion: string;
  fecha_otorgado: string;
}

interface ListonesIndexProps {
  listones: Liston[];
  error?: string;
}

export default function ListonesIndex({ listones = [], error }: ListonesIndexProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedListon, setSelectedListon] = useState<Liston | null>(null);

  const filteredListones = useMemo(() => {
    if (!searchTerm || !listones || listones.length === 0) return listones || [];

    return listones.filter(liston => {
      if (!liston) return false;

      const correlativo = (liston.correlativo || '').toLowerCase();
      const participante = (liston.participante || '').toLowerCase();
      const orquidea = (liston.orquidea || '').toLowerCase();
      const tipo_liston = (liston.tipo_liston || '').toLowerCase();
      const grupo = (liston.grupo || '').toLowerCase();
      const clase = (liston.clase || '').toLowerCase();
      const search = searchTerm.toLowerCase();

      return correlativo.includes(search) ||
        participante.includes(search) ||
        orquidea.includes(search) ||
        tipo_liston.includes(search) ||
        grupo.includes(search) ||
        clase.includes(search);
    });
  }, [listones, searchTerm]);

  const handleDelete = (liston: Liston) => {
    router.delete(route('listones.destroy', liston.id_liston), {
      onSuccess: () => {
        toast.success('Listón eliminado exitosamente');
      },
      onError: () => {
        toast.error('Error al eliminar el listón');
      }
    });
  };

  const getTipoListonColor = (tipo: string) => {
    if (!tipo) return 'bg-green-100 text-green-800 border-green-200';

    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('oro') || tipoLower.includes('primero')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (tipoLower.includes('plata') || tipoLower.includes('segundo')) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (tipoLower.includes('bronce') || tipoLower.includes('tercero')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (tipoLower.includes('mención')) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Listones - Menciones Honoríficas" />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-10">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            <p className="font-medium">Error al cargar listones:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Listones y Menciones Honoríficas</h1>
            <p className="text-gray-600 mt-2">Gestiona los listones y menciones otorgados a participantes</p>
          </div>
          <Link href={route('listones.create')}>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              Otorgar Listón
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por correlativo, participante, orquídea o tipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Total: {filteredListones.length} listones
          </Badge>
        </div>

        {filteredListones.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron resultados' : 'No hay listones otorgados'}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                {searchTerm
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Comienza otorgando listones y menciones honoríficas a los participantes'
                }
              </p>
              {!searchTerm && (
                <Link href={route('listones.create')}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Otorgar Primer Listón
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListones.map((liston) => (
              <Card key={liston.id_liston} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">#{liston.correlativo}</CardTitle>
                      <Badge className={getTipoListonColor(liston.tipo_liston)}>
                        {liston.tipo_liston}
                      </Badge>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setSelectedListon(liston)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar listón?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el listón otorgado a "{liston.participante}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => selectedListon && handleDelete(selectedListon)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="mr-2 h-4 w-4" />
                      <span className="font-medium">{liston.participante}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Leaf className="mr-2 h-4 w-4" />
                      <span>{liston.orquidea}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{liston.grupo}</span>
                      <span>{liston.clase}</span>
                    </div>

                    {liston.descripcion && (
                      <>
                        <Separator />
                        <p className="text-sm text-gray-600 italic">
                          "{liston.descripcion}"
                        </p>
                      </>
                    )}

                    <div className="flex items-center text-xs text-gray-500 pt-2">
                      <Calendar className="mr-2 h-3 w-3" />
                      <span>{liston.fecha_otorgado}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
