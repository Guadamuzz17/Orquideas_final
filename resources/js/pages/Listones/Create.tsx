import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Autocomplete } from '@/components/ui/autocomplete';
import { Search, Award, Save, ArrowLeft, Loader2 } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Competición',
    href: '/competicion',
  },
  {
    title: 'Listones',
    href: '/listones',
  },
  {
    title: 'Otorgar Listón',
    href: '/listones/create',
  },
];

interface Inscripcion {
  id_inscripcion: number;
  correlativo: string;
  participante_nombre: string;
  orquidea_nombre: string;
  grupo_nombre: string;
  clase_nombre: string;
}

interface CreateListonProps {
  // Las props pueden venir del backend si es necesario
}

export default function CreateListon({}: CreateListonProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedInscripcion, setSelectedInscripcion] = useState<Inscripcion | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    inscripcion_id: '',
    tipo_liston: '',
    descripcion: '',
  });

  const tiposListon = [
    { value: 'Primer Premio', label: 'Primer Premio - Oro' },
    { value: 'Segundo Premio', label: 'Segundo Premio - Plata' },
    { value: 'Tercer Premio', label: 'Tercer Premio - Bronce' },
    { value: 'Mención Honorífica', label: 'Mención Honorífica' },
    { value: 'Mención Especial', label: 'Mención Especial' },
    { value: 'Premio a la Excelencia', label: 'Premio a la Excelencia' },
    { value: 'Mejor de Grupo', label: 'Mejor de Grupo' },
    { value: 'Mejor de Clase', label: 'Mejor de Clase' },
    { value: 'Reconocimiento Especial', label: 'Reconocimiento Especial' },
  ];

  // Búsqueda de inscripciones
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setLoading(true);
      const delayedSearch = setTimeout(() => {
        fetch(route('listones.search-inscripciones', { search: searchTerm }))
          .then(response => response.json())
          .then(data => {
            setInscripciones(data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error:', error);
            setLoading(false);
            toast.error('Error al buscar inscripciones');
          });
      }, 300);

      return () => clearTimeout(delayedSearch);
    } else {
      setInscripciones([]);
      setLoading(false);
    }
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedInscripcion) {
      toast.error('Debes seleccionar una inscripción');
      return;
    }

    post(route('listones.store'), {
      onSuccess: () => {
        toast.success('Listón otorgado exitosamente');
        router.visit(route('listones.index'));
      },
      onError: () => {
        toast.error('Error al otorgar el listón');
      }
    });
  };

  const handleInscripcionSelect = (inscripcion: Inscripcion) => {
    setSelectedInscripcion(inscripcion);
    setData('inscripcion_id', inscripcion.id_inscripcion.toString());
    setSearchTerm(`${inscripcion.correlativo} - ${inscripcion.participante_nombre} - ${inscripcion.orquidea_nombre}`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Otorgar Listón" />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Otorgar Listón</h1>
            <p className="text-gray-600 mt-2">Asigna listones y menciones honoríficas a participantes</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.visit(route('listones.index'))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Información del Listón
            </CardTitle>
            <CardDescription>
              Complete la información para otorgar un listón o mención honorífica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Búsqueda de Inscripción */}
              <div className="space-y-2">
                <Label htmlFor="inscripcion">Buscar Inscripción *</Label>
                <Autocomplete
                  options={inscripciones.map(inscripcion => ({
                    id: inscripcion.id_inscripcion,
                    value: inscripcion,
                    label: `${inscripcion.correlativo} - ${inscripcion.participante_nombre} - ${inscripcion.orquidea_nombre}`,
                    description: `${inscripcion.grupo_nombre} • ${inscripcion.clase_nombre}`,
                  }))}
                  onSelect={(option) => handleInscripcionSelect(option.value as Inscripcion)}
                  onSearchChange={setSearchTerm}
                  searchValue={searchTerm}
                  loading={loading}
                  placeholder="Busca por correlativo, participante u orquídea..."
                  noResultsText="No se encontraron inscripciones"
                />
                {errors.inscripcion_id && (
                  <p className="text-sm text-red-600">{errors.inscripcion_id}</p>
                )}
              </div>

              {/* Información de la inscripción seleccionada */}
              {selectedInscripcion && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <h4 className="font-medium text-green-900 mb-2">Inscripción Seleccionada</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-700 font-medium">Correlativo:</span>
                      <span className="ml-2">#{selectedInscripcion.correlativo}</span>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Participante:</span>
                      <span className="ml-2">{selectedInscripcion.participante_nombre}</span>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Orquídea:</span>
                      <span className="ml-2">{selectedInscripcion.orquidea_nombre}</span>
                    </div>
                    <div>
                      <span className="text-green-700 font-medium">Categoría:</span>
                      <span className="ml-2">{selectedInscripcion.grupo_nombre} - {selectedInscripcion.clase_nombre}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tipo de Listón */}
              <div className="space-y-2">
                <Label htmlFor="tipo_liston">Tipo de Listón *</Label>
                <Select
                  value={data.tipo_liston}
                  onValueChange={(value) => setData('tipo_liston', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de listón" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposListon.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipo_liston && (
                  <p className="text-sm text-red-600">{errors.tipo_liston}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción (Opcional)</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Motivo o descripción del listón otorgado..."
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  rows={3}
                />
                {errors.descripcion && (
                  <p className="text-sm text-red-600">{errors.descripcion}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.visit(route('listones.index'))}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={processing || !selectedInscripcion || !data.tipo_liston}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {processing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Otorgando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Otorgar Listón
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
