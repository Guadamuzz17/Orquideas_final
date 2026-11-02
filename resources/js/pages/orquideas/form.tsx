import { useForm, Link, Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Flower2, ArrowLeft } from 'lucide-react';

interface Option {
  id?: number | string;
  id_grupo?: number | string;
  id_clase?: number | string;
  id_participante?: number | string;
  nombre_grupo?: string;
  nombre_clase?: string;
  nombre?: string;
  nombre_participante?: string;
  id_grupp?: number;
}

interface PageProps {
  orquidea?: any;
  grupos: any[];
  clases: any[];
  participantes: any[];
}

export default function Form({ orquidea, grupos = [], clases = [], participantes = [] }: PageProps) {
  const { data, setData, post, processing, errors } = useForm({
    nombre_planta: orquidea?.nombre_planta || '',
    origen: orquidea?.origen || '',
    id_grupo: orquidea?.id_grupo ? String(orquidea.id_grupo) : '',
    id_clase: orquidea?.id_clase ? String(orquidea.id_clase) : (orquidea?.id_case ? String(orquidea.id_case) : ''),
    cantidad: orquidea?.cantidad || 1,
    id_participante: orquidea?.id_participante ? String(orquidea.id_participante) : (orquidea?.id ? String(orquidea.id) : (orquidea?.a ? String(orquidea.a) : '')),
    foto: null as File | null,
    _method: orquidea ? 'put' : undefined,
  });

  const [filteredClases, setFilteredClases] = useState<any[]>([]);
  const [selectedGrupoName, setSelectedGrupoName] = useState('');

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Catálogo de Orquídeas', href: '/orquideas' },
    { title: orquidea ? 'Editar' : 'Registrar', href: '#' },
  ];

  // Filtrar clases cuando cambia el grupo
  useEffect(() => {
    if (data.id_grupo) {
      const filtered = clases.filter(c => String(c.id_grupp || c.id_grupo) === String(data.id_grupo));
      setFilteredClases(filtered);

      const grupo = grupos.find(g => String(g.id_grupo || g.id) === String(data.id_grupo));
      setSelectedGrupoName(grupo?.nombre_grupo || '');

      // Si la clase seleccionada no pertenece al nuevo grupo, resetearla
      if (!filtered.find(c => String(c.id_clase || c.id) === String(data.id_clase))) {
        setData('id_clase', '');
      }
    } else {
      setFilteredClases([]);
      setSelectedGrupoName('');
    }
  }, [data.id_grupo, clases, grupos]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (orquidea) {
      post(route('orquideas.update', orquidea.id_orquidea || orquidea.id), {
        forceFormData: true,
      });
    } else {
      post(route('orquideas.store'), {
        forceFormData: true,
      });
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={orquidea ? 'Editar Orquídea' : 'Registrar Nueva Orquídea'} />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Flower2 className="h-6 w-6 text-primary" />
            {orquidea ? 'Editar Orquídea' : 'Registrar Nueva Orquídea'}
          </h1>
          <Button asChild variant="outline">
            <Link href={route('orquideas.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">Formulario de Orquídea</CardTitle>
              <CardDescription>
                Complete los datos de la planta. Los campos marcados con * son obligatorios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-5">
                {/* Nombre de la Planta */}
                <div className="space-y-2">
                  <Label htmlFor="nombre_planta">Nombre de la Planta *</Label>
                  <Input
                    id="nombre_planta"
                    value={data.nombre_planta}
                    onChange={(e) => setData('nombre_planta', e.target.value)}
                    placeholder="Ej: Cattleya labiata"
                    required
                    className={errors.nombre_planta ? 'border-red-500' : ''}
                  />
                  {errors.nombre_planta && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.nombre_planta}</p>
                  )}
                </div>

                {/* Origen */}
                <div className="space-y-2">
                  <Label htmlFor="origen">Origen *</Label>
                  <Select value={data.origen} onValueChange={(v) => setData('origen', v)}>
                    <SelectTrigger className={errors.origen ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione el origen de la orquídea" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="especie">Especie (Planta natural)</SelectItem>
                      <SelectItem value="hibrido">Híbrido (Cruza artificial)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.origen && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.origen}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Especie: Planta que existe naturalmente. Híbrido: Resultado de cruce controlado.
                  </p>
                </div>

                {/* Grupo */}
                <div className="space-y-2">
                  <Label htmlFor="id_grupo">Grupo de Clasificación *</Label>
                  <Select value={data.id_grupo} onValueChange={(v) => setData('id_grupo', v)}>
                    <SelectTrigger className={errors.id_grupo ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione el grupo de la orquídea" />
                    </SelectTrigger>
                    <SelectContent>
                      {grupos.map(g => {
                        const val = String(g.id_grupo ?? g.id);
                        return (
                          <SelectItem key={val} value={val}>
                            {g.nombre_grupo}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.id_grupo && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.id_grupo}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Seleccione primero el grupo para ver las clases disponibles.
                  </p>
                </div>

                {/* Clase */}
                <div className="space-y-2">
                  <Label htmlFor="id_clase">Clase Específica *</Label>
                  <Select
                    value={data.id_clase}
                    onValueChange={(v) => setData('id_clase', v)}
                    disabled={!data.id_grupo || filteredClases.length === 0}
                  >
                    <SelectTrigger className={errors.id_clase ? 'border-red-500' : ''}>
                      <SelectValue placeholder={
                        !data.id_grupo
                          ? "Primero seleccione un grupo"
                          : filteredClases.length === 0
                            ? "No hay clases disponibles para este grupo"
                            : "Seleccione la clase de la orquídea"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredClases.map(c => {
                        const val = String(c.id_clase ?? c.id);
                        return (
                          <SelectItem key={val} value={val}>
                            {c.nombre_clase}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.id_clase && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.id_clase}</p>
                  )}
                  {data.id_grupo && filteredClases.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Mostrando {filteredClases.length} clase(s) disponible(s) para: {selectedGrupoName}
                    </p>
                  )}
                </div>

                {/* Cantidad */}
                <div className="space-y-2">
                  <Label htmlFor="cantidad">Cantidad de Plantas *</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min={1}
                    value={data.cantidad}
                    onChange={(e) => setData('cantidad', parseInt(e.target.value) || 1)}
                    className={errors.cantidad ? 'border-red-500' : ''}
                  />
                  {errors.cantidad && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.cantidad}</p>
                  )}
                </div>

                {/* Participante */}
                <div className="space-y-2">
                  <Label htmlFor="id_participante">Participante Propietario *</Label>
                  <Select value={data.id_participante} onValueChange={(v) => setData('id_participante', v)}>
                    <SelectTrigger className={errors.id_participante ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Seleccione el participante dueño de la orquídea" />
                    </SelectTrigger>
                    <SelectContent>
                      {participantes.map(p => {
                        const val = String(p.id_participante ?? p.id);
                        return (
                          <SelectItem key={val} value={val}>
                            {p.nombre_participante || p.nombre}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.id_participante && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.id_participante}</p>
                  )}
                </div>

                {/* Foto */}
                <div className="space-y-2">
                  <Label htmlFor="foto">Fotografía de la Orquídea (Opcional)</Label>
                  <Input
                    id="foto"
                    type="file"
                    accept="image/*"
                    onChange={e => setData('foto', e.target.files?.[0] || null)}
                    className={errors.foto ? 'border-red-500' : ''}
                  />
                  {errors.foto && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.foto}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                  </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button type="submit" disabled={processing} className="w-full sm:flex-1">
                    {processing ? 'Guardando...' : orquidea ? 'Actualizar Orquídea' : 'Registrar Orquídea'}
                  </Button>
                  <Button type="button" variant="outline" asChild className="w-full sm:flex-1">
                    <Link href={route('orquideas.index')}>Cancelar</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
