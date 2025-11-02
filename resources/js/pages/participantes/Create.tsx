import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slash, ArrowLeft, Search, User, Recycle, AlertCircle } from "lucide-react";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from 'sonner';
import axios from 'axios';
import Swal from 'sweetalert2';

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
  id_departamento: number;
  nombre_municipio: string;
}

interface Asociacion {
  id_aso: number;
  Clase: string;
}

interface ParticipantePrevio {
  id_participante: number;
  nombre: string;
  numero_telefonico: string;
  direccion: string;
  id_tipo: number;
  id_departamento: number;
  id_municipio: number;
  id_aso: number;
  tipo: { Clase: string };
  departamento: { nombre_departamento: string };
  municipio: { nombre_municipio: string };
  aso: { Clase: string };
  evento_previo: string;
  eventos_participados: number;
}

interface CreateParticipanteProps {
  tiposParticipante: TipoParticipante[];
  departamentos: Departamento[];
  municipios: Municipio[];
  asociaciones: Asociacion[];
}

export default function CreateParticipante({
  tiposParticipante,
  departamentos,
  municipios: initialMunicipios,
  asociaciones
}: CreateParticipanteProps) {
  const [municipios, setMunicipios] = useState<Municipio[]>(initialMunicipios);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ParticipantePrevio[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    nombre: '',
    numero_telefonico: '',
    direccion: '',
    id_tipo: '',
    id_departamento: '',
    id_municipio: '',
    id_aso: '',
  });

  // Buscar participantes de eventos anteriores
  useEffect(() => {
    if (searchQuery.length >= 2) { // Reducido de 3 a 2 caracteres
      setIsSearching(true);
      const timer = setTimeout(async () => {
        try {
          console.log('Buscando participantes con query:', searchQuery);
          const response = await axios.get('/participantes/search-recycle', {
            params: { query: searchQuery }
          });
          console.log('Resultados recibidos:', response.data);
          setSearchResults(response.data);
          setShowSearchResults(true); // Siempre mostrar sección (aunque esté vacía)
        } catch (error) {
          console.error('Error searching participants:', error);
          toast.error('Error al buscar participantes');
        } finally {
          setIsSearching(false);
        }
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Función para reciclar datos de participante
  const handleRecycleParticipant = async (participante: ParticipantePrevio) => {
    const result = await Swal.fire({
      title: '♻️ ¿Reciclar datos de participante?',
      html: `
        <div class="text-left space-y-2">
          <p class="font-semibold text-lg mb-3">${participante.nombre}</p>
          <p><strong>Teléfono:</strong> ${participante.numero_telefonico}</p>
          <p><strong>Dirección:</strong> ${participante.direccion}</p>
          <p><strong>Tipo:</strong> ${participante.tipo.Clase}</p>
          <p><strong>Asociación:</strong> ${participante.aso.Clase}</p>
          <p><strong>Ubicación:</strong> ${participante.municipio.nombre_municipio}, ${participante.departamento.nombre_departamento}</p>
          <p class="mt-4 text-sm text-gray-600">
            <i class="fas fa-info-circle"></i> Este participante ha estado en <strong>${participante.eventos_participados}</strong> evento(s) anterior(es).
            <br>Último evento: <strong>${participante.evento_previo}</strong>
          </p>
          <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
            <p class="text-sm text-blue-800">
              <i class="fas fa-lightbulb"></i> <strong>Nota:</strong> Esto copiará automáticamente todos los datos del participante para crear un nuevo registro en el evento actual. No se modificará la información original.
            </p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: '<i class="fas fa-recycle"></i> Sí, reciclar datos',
      cancelButtonText: '<i class="fas fa-times"></i> No, crear nuevo',
      width: '600px',
      customClass: {
        popup: 'text-left'
      }
    });

    if (result.isConfirmed) {
      // Cargar municipios del departamento seleccionado
      try {
        const response = await axios.get(`/participantes/municipios/${participante.id_departamento}`);
        setMunicipios(response.data);
      } catch (error) {
        console.error('Error loading municipios:', error);
      }

      // Autocompletar formulario con datos reciclados
      setData({
        nombre: participante.nombre,
        numero_telefonico: participante.numero_telefonico,
        direccion: participante.direccion,
        id_tipo: participante.id_tipo.toString(),
        id_departamento: participante.id_departamento.toString(),
        id_municipio: participante.id_municipio.toString(),
        id_aso: participante.id_aso.toString(),
      });

      // Limpiar búsqueda
      setSearchQuery('');
      setSearchResults([]);
      setShowSearchResults(false);

      toast.success('✅ Datos reciclados exitosamente. Revisa y confirma antes de guardar.', {
        duration: 4000
      });
    }
  };

  const handleDepartamentoChange = async (departamentoId: string) => {
    setData('id_departamento', departamentoId);
    setData('id_municipio', ''); // Reset municipio when departamento changes

    if (departamentoId) {
      try {
        const response = await axios.get(`/participantes/municipios/${departamentoId}`);
        setMunicipios(response.data);
      } catch (error) {
        console.error('Error fetching municipios:', error);
        toast.error('Error al cargar los municipios');
      }
    } else {
      setMunicipios([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('participantes.store'), {
      onSuccess: () => {
        toast.success('Participante creado exitosamente');
        reset();
      },
      onError: () => {
        toast.error('Error al crear el participante');
      }
    });
  };

  return (
    <AppLayout>
      <Head title="Crear Participante" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Crear Participante</h1>
          <Button asChild variant="outline">
            <Link href={route('participantes.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
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
                <BreadcrumbPage>Crear Participante</BreadcrumbPage>
              </li>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Formulario de Registro</CardTitle>
            <CardDescription>
              Complete todos los campos para registrar un nuevo participante
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Búsqueda de Participantes Previos */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Recycle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-1">
                    ♻️ Reciclar Datos de Eventos Anteriores
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                    Si el participante ya estuvo en eventos previos, búscalo por nombre o teléfono (mín. 2 caracteres) para autocompletar sus datos
                  </p>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar por nombre o teléfono..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white dark:bg-gray-800"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Resultados de búsqueda */}
                  {showSearchResults && (
                    <div className="mt-3">
                      {searchResults.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            ✅ Se encontraron {searchResults.length} coincidencia{searchResults.length > 1 ? 's' : ''}:
                          </p>
                          {searchResults.map((participante) => (
                            <button
                              key={participante.id_participante}
                              type="button"
                              onClick={() => handleRecycleParticipant(participante)}
                              className="w-full text-left p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md hover:border-blue-400 transition-all group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <User className="h-4 w-4 text-blue-500" />
                                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                                      {participante.nombre}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                    <p>📞 {participante.numero_telefonico}</p>
                                    <p>📍 {participante.municipio.nombre_municipio}, {participante.departamento.nombre_departamento}</p>
                                    <p className="text-blue-600 dark:text-blue-400">
                                      🎪 Último evento: <strong>{participante.evento_previo}</strong> ({participante.eventos_participados} evento{participante.eventos_participados > 1 ? 's' : ''} total)
                                    </p>
                                  </div>
                                </div>
                                <Recycle className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : !isSearching && searchQuery.length >= 2 ? (
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <div className="text-xs text-amber-700 dark:text-amber-300">
                              <p className="font-semibold mb-1">⚠️ No se encontraron registros previos</p>
                              <p>No hay participantes con ese nombre o teléfono en eventos anteriores.</p>
                              <p className="mt-1">Complete los datos manualmente abajo.</p>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre Completo */}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  placeholder="Ingrese el nombre completo"
                  className={errors.nombre ? 'border-red-500' : ''}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Número Telefónico */}
              <div className="space-y-2">
                <Label htmlFor="numero_telefonico">Número Telefónico *</Label>
                <Input
                  id="numero_telefonico"
                  type="tel"
                  value={data.numero_telefonico}
                  onChange={(e) => setData('numero_telefonico', e.target.value)}
                  placeholder="Ingrese el número telefónico"
                  className={errors.numero_telefonico ? 'border-red-500' : ''}
                />
                {errors.numero_telefonico && (
                  <p className="text-sm text-red-500">{errors.numero_telefonico}</p>
                )}
              </div>

              {/* Dirección */}
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Textarea
                  id="direccion"
                  value={data.direccion}
                  onChange={(e) => setData('direccion', e.target.value)}
                  placeholder="Ingrese la dirección completa"
                  className={errors.direccion ? 'border-red-500' : ''}
                  rows={3}
                />
                {errors.direccion && (
                  <p className="text-sm text-red-500">{errors.direccion}</p>
                )}
              </div>

              {/* Tipo de Participante */}
              <div className="space-y-2">
                <Label htmlFor="id_tipo">Tipo de Participante *</Label>
                <Select value={data.id_tipo} onValueChange={(value) => setData('id_tipo', value)}>
                  <SelectTrigger className={errors.id_tipo ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona un Tipo de Participante" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposParticipante.map((tipo) => (
                      <SelectItem key={tipo.id_tipo} value={tipo.id_tipo.toString()}>
                        {tipo.Clase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_tipo && (
                  <p className="text-sm text-red-500">{errors.id_tipo}</p>
                )}
              </div>

              {/* Departamento */}
              <div className="space-y-2">
                <Label htmlFor="id_departamento">Departamento *</Label>
                <Select
                  value={data.id_departamento}
                  onValueChange={handleDepartamentoChange}
                >
                  <SelectTrigger className={errors.id_departamento ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona un Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departamentos.map((departamento) => (
                      <SelectItem key={departamento.id_departamento} value={departamento.id_departamento.toString()}>
                        {departamento.nombre_departamento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_departamento && (
                  <p className="text-sm text-red-500">{errors.id_departamento}</p>
                )}
              </div>

              {/* Municipio */}
              <div className="space-y-2">
                <Label htmlFor="id_municipio">Municipio *</Label>
                <Select
                  value={data.id_municipio}
                  onValueChange={(value) => setData('id_municipio', value)}
                  disabled={!data.id_departamento}
                >
                  <SelectTrigger className={errors.id_municipio ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona un Municipio" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipios.map((municipio) => (
                      <SelectItem key={municipio.id_municipio} value={municipio.id_municipio.toString()}>
                        {municipio.nombre_municipio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_municipio && (
                  <p className="text-sm text-red-500">{errors.id_municipio}</p>
                )}
              </div>

              {/* Asociación */}
              <div className="space-y-2">
                <Label htmlFor="id_aso">Asociación *</Label>
                <Select value={data.id_aso} onValueChange={(value) => setData('id_aso', value)}>
                  <SelectTrigger className={errors.id_aso ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona una Asociación" />
                  </SelectTrigger>
                  <SelectContent>
                    {asociaciones.map((asociacion) => (
                      <SelectItem key={asociacion.id_aso} value={asociacion.id_aso.toString()}>
                        {asociacion.Clase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.id_aso && (
                  <p className="text-sm text-red-500">{errors.id_aso}</p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={processing} className="flex-1">
                  {processing ? 'Creando...' : 'Crear Participante'}
                </Button>
                <Button type="button" variant="outline" onClick={() => reset()} className="flex-1">
                  Limpiar Formulario
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
