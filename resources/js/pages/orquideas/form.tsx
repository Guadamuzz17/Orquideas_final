import { useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Option { id:number|string; nombre_grupo?:string; nombre_clase?:string; nombre?:string; id_grupp?:number; }
interface PageProps {
  orquidea?: any;
  grupos: Option[];
  clases: Option[];
  participantes: Option[];
}

export default function Form({ orquidea, grupos, clases, participantes }: PageProps) {
  const { data, setData, post, processing, put, errors } = useForm({
    nombre_planta: orquidea?.nombre_planta || '',
    origen: orquidea?.origen || '',
    id_grupo: orquidea?.id_grupo || '',
    id_case: orquidea?.id_case || '',
    a: orquidea?.a || '',
    foto: null as File | null,
  });

  const [filteredClases, setFilteredClases] = useState<Option[]>([]);
  const [selectedGrupoName, setSelectedGrupoName] = useState('');

  // Filtrar clases cuando cambia el grupo
  useEffect(() => {
    if (data.id_grupo) {
      const filtered = clases.filter(c => String(c.id_grupp) === String(data.id_grupo));
      setFilteredClases(filtered);

      const grupo = grupos.find(g => String(g.id) === String(data.id_grupo));
      setSelectedGrupoName(grupo?.nombre_grupo || '');

      // Si la clase seleccionada no pertenece al nuevo grupo, resetearla
      if (!filtered.find(c => String(c.id) === String(data.id_case))) {
        setData('id_case', '');
      }
    } else {
      setFilteredClases([]);
      setSelectedGrupoName('');
    }
  }, [data.id_grupo, clases, grupos]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (orquidea) {
      put(route('orquideas.update', orquidea.id_orquidea));
    } else {
      post(route('orquideas.store'));
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{orquidea ? 'Editar Orquídea' : 'Registrar Nueva Orquídea'}</CardTitle>
          <CardDescription>
            Complete los datos de la orquídea. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-6">
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
                <p className="text-sm text-red-600">{errors.nombre_planta}</p>
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
                <p className="text-sm text-red-600">{errors.origen}</p>
              )}
              <p className="text-xs text-gray-500">
                Especie: Planta que existe naturalmente en la naturaleza. Híbrido: Resultado de un cruce controlado.
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
                  {grupos.map(g => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.nombre_grupo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_grupo && (
                <p className="text-sm text-red-600">{errors.id_grupo}</p>
              )}
              <p className="text-xs text-gray-500">
                Seleccione primero el grupo para ver las clases disponibles.
              </p>
            </div>

            {/* Clase */}
            <div className="space-y-2">
              <Label htmlFor="id_case">Clase Específica *</Label>
              <Select
                value={data.id_case}
                onValueChange={(v) => setData('id_case', v)}
                disabled={!data.id_grupo || filteredClases.length === 0}
              >
                <SelectTrigger className={errors.id_case ? 'border-red-500' : ''}>
                  <SelectValue placeholder={
                    !data.id_grupo
                      ? "Primero seleccione un grupo"
                      : filteredClases.length === 0
                        ? "No hay clases disponibles para este grupo"
                        : "Seleccione la clase de la orquídea"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredClases.map(c => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.nombre_clase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_case && (
                <p className="text-sm text-red-600">{errors.id_case}</p>
              )}
              {data.id_grupo && filteredClases.length > 0 && (
                <p className="text-xs text-gray-500">
                  Mostrando {filteredClases.length} clase(s) disponible(s) para: {selectedGrupoName}
                </p>
              )}
            </div>

            {/* Participante */}
            <div className="space-y-2">
              <Label htmlFor="a">Participante Propietario *</Label>
              <Select value={data.a} onValueChange={(v) => setData('a', v)}>
                <SelectTrigger className={errors.a ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccione el participante dueño de la orquídea" />
                </SelectTrigger>
                <SelectContent>
                  {participantes.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.a && (
                <p className="text-sm text-red-600">{errors.a}</p>
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
                <p className="text-sm text-red-600">{errors.foto}</p>
              )}
              <p className="text-xs text-gray-500">
                Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={processing} className="flex-1">
                {processing ? 'Guardando...' : orquidea ? 'Actualizar Orquídea' : 'Registrar Orquídea'}
              </Button>
              <Button type="button" variant="outline" asChild className="flex-1">
                <Link href={route('orquideas.index')}>Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

