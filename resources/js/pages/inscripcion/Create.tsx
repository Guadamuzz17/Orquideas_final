import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Trash2, CheckCircle, AlertTriangle, User, Leaf, Calendar } from "lucide-react";
import { Autocomplete, type AutocompleteOption } from "@/components/ui/autocomplete";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Inscripción de Orquídeas',
    href: '/inscripcion',
  },
];

interface Participante {
  id: number;
  nombre: string;
}

interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
}

interface Clase {
  id_clase: number;
  nombre_clase: string;
}

interface Orquidea {
  id_orquidea: number;
  nombre_planta: string;
  origen: string;
  cantidad: number;
  inscripciones_count?: number;
  disponibles?: number;
  grupo?: Grupo;
  clase?: Clase;
}

interface OrquideaSeleccionada {
  id_orquidea: number;
  nombre_planta: string;
  correlativo: number;
  id_participante: number;
}

interface CreateInscripcionProps {
  participantes: Participante[];
}

export default function CreateInscripcion({ participantes }: CreateInscripcionProps) {
  const [selectedParticipante, setSelectedParticipante] = useState<Participante | null>(null);
  const [orquideasDisponibles, setOrquideasDisponibles] = useState<Orquidea[]>([]);
  const [orquideasFiltradas, setOrquideasFiltradas] = useState<Orquidea[]>([]);
  const [orquideasSeleccionadas, setOrquideasSeleccionadas] = useState<OrquideaSeleccionada[]>([]);
  const [searchOrquidea, setSearchOrquidea] = useState('');
  const [selectedOrquidea, setSelectedOrquidea] = useState<Orquidea | null>(null);
  const [correlativo, setCorrelativo] = useState('');
  const [correlativoStatus, setCorrelativoStatus] = useState<{
    available: boolean;
    message: string;
    checking: boolean;
  }>({ available: true, message: '', checking: false });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [ultimoCorrelativo, setUltimoCorrelativo] = useState<number>(0);
  const [isAddingOrquidea, setIsAddingOrquidea] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutocompleteOption[]>([]);
  const [isSearchingOrquideas, setIsSearchingOrquideas] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const { data, setData, post, processing, reset } = useForm({
    inscripciones: [] as any[]
  });

  // Cargar el último correlativo usado al iniciar
  useEffect(() => {
    fetch('/inscripcion/ultimo-correlativo')
      .then(response => response.json())
      .then(data => {
        setUltimoCorrelativo(data.ultimo_correlativo || 0);
      })
      .catch(error => {
        console.error('Error al cargar último correlativo:', error);
      });
  }, []);

  // Cargar orquídeas cuando se selecciona un participante
  useEffect(() => {
    if (selectedParticipante) {
      fetch(`/inscripcion/orquideas/${selectedParticipante.id}`)
        .then(response => response.json())
        .then(data => {
          setOrquideasDisponibles(data);
          setOrquideasFiltradas(data);
        })
        .catch(error => {
          console.error('Error al cargar orquídeas:', error);
          toast.error('Error al cargar las orquídeas del participante');
        });
    }
  }, [selectedParticipante]);

  // Filtrar orquídeas por búsqueda y excluir las ya seleccionadas
  useEffect(() => {
    let filtradas = orquideasDisponibles;

    // Excluir orquídeas ya seleccionadas
    filtradas = filtradas.filter(orquidea =>
      !orquideasSeleccionadas.some(selected => selected.id_orquidea === orquidea.id_orquidea)
    );

    // Filtrar por búsqueda
    if (searchOrquidea.trim() !== '') {
      filtradas = filtradas.filter(orquidea =>
        orquidea.nombre_planta.toLowerCase().includes(searchOrquidea.toLowerCase())
      );
    }

    setOrquideasFiltradas(filtradas);
  }, [searchOrquidea, orquideasDisponibles, orquideasSeleccionadas]);

  // Verificar correlativo
  const checkCorrelativo = async (correlativoValue: string) => {
    if (!correlativoValue || correlativoValue.trim() === '') {
      setCorrelativoStatus({ available: true, message: '', checking: false });
      return;
    }

    setCorrelativoStatus(prev => ({ ...prev, checking: true }));

    try {
      const response = await fetch(`/inscripcion/check-correlativo?correlativo=${correlativoValue}`);
      const result = await response.json();

      setCorrelativoStatus({
        available: result.available,
        message: result.message,
        checking: false
      });
    } catch (error) {
      console.error('Error al verificar correlativo:', error);
      setCorrelativoStatus({
        available: false,
        message: 'Error al verificar correlativo',
        checking: false
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkCorrelativo(correlativo);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [correlativo]);

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleParticipanteSelect = (participanteId: string) => {
    const participante = participantes.find(p => p.id.toString() === participanteId);
    setSelectedParticipante(participante || null);
    // Reset states
    setOrquideasDisponibles([]);
    setOrquideasFiltradas([]);
    setSelectedOrquidea(null);
    setSearchOrquidea('');
    setCorrelativo('');
    setAutocompleteOptions([]);
    setIsSearchingOrquideas(false);

    // Limpiar timeout si existe
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      setSearchTimeout(null);
    }
  };

  const handleOrquideaSelect = (orquideaId: string) => {
    const orquidea = orquideasFiltradas.find(o => o.id_orquidea.toString() === orquideaId);
    setSelectedOrquidea(orquidea || null);
  };

  // Función para buscar orquídeas con autocompletado
  const searchOrquideasAutocomplete = async (searchTerm: string) => {
    if (!selectedParticipante || searchTerm.trim().length < 2) {
      setAutocompleteOptions([]);
      return;
    }

    setIsSearchingOrquideas(true);

    try {
      const response = await fetch(
        `/inscripcion/search-orquideas?participante_id=${selectedParticipante.id}&search=${encodeURIComponent(searchTerm)}`
      );
      const orquideas: Orquidea[] = await response.json();

      // El backend ya filtra por disponibilidad basado en inscripciones guardadas en BD
      // Aquí solo filtramos las que están en proceso de ser inscritas en esta sesión
      const orquideasFiltradas = orquideas.filter(orquidea => {
        // Contar cuántas veces esta orquídea está seleccionada actualmente
        const vecesSeleccionada = orquideasSeleccionadas.filter(
          selected => selected.id_orquidea === orquidea.id_orquidea
        ).length;

        // Verificar si aún quedan cupos después de las selecciones actuales
        const disponiblesRestantes = (orquidea.disponibles || orquidea.cantidad) - vecesSeleccionada;
        return disponiblesRestantes > 0;
      });

      // Convertir a opciones de autocompletado
      const options: AutocompleteOption[] = orquideasFiltradas.map(orquidea => {
        const vecesSeleccionada = orquideasSeleccionadas.filter(
          selected => selected.id_orquidea === orquidea.id_orquidea
        ).length;
        const disponiblesRestantes = (orquidea.disponibles || orquidea.cantidad) - vecesSeleccionada;

        return {
          id: orquidea.id_orquidea,
          label: orquidea.nombre_planta,
          value: orquidea,
          description: `${orquidea.grupo?.nombre_grupo || 'Sin grupo'} - ${orquidea.clase?.nombre_clase || 'Sin clase'}`,
          badge: `Disponibles: ${disponiblesRestantes}`
        };
      });

      setAutocompleteOptions(options);
    } catch (error) {
      console.error('Error al buscar orquídeas:', error);
      toast.error('Error al buscar orquídeas');
      setAutocompleteOptions([]);
    } finally {
      setIsSearchingOrquideas(false);
    }
  };

  // Manejar selección del autocompletado
  const handleAutocompleteSelect = (option: AutocompleteOption) => {
    const orquidea = option.value as Orquidea;
    setSelectedOrquidea(orquidea);
    setSearchOrquidea(orquidea.nombre_planta);
    setAutocompleteOptions([]);
  };

  // Manejar búsqueda con debounce
  const handleAutocompleteSearch = (searchTerm: string) => {
    setSearchOrquidea(searchTerm);

    // Limpiar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Crear nuevo timeout
    const timeout = setTimeout(() => {
      searchOrquideasAutocomplete(searchTerm);
    }, 300); // 300ms de debounce

    setSearchTimeout(timeout);
  };

  const agregarOrquidea = async () => {
    // Prevenir dobles clics
    if (isAddingOrquidea) {
      return;
    }

    if (!selectedParticipante || !selectedOrquidea || !correlativo || !correlativoStatus.available) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    setIsAddingOrquidea(true);

    try {
      // Verificar disponibilidad de la orquídea
      const vecesYaSeleccionada = orquideasSeleccionadas.filter(
        o => o.id_orquidea === selectedOrquidea.id_orquidea
      ).length;

      const disponiblesRestantes = (selectedOrquidea.disponibles || selectedOrquidea.cantidad) - vecesYaSeleccionada;

      if (disponiblesRestantes <= 0) {
        toast.error('No quedan cupos disponibles para esta orquídea');
        return;
      }

      // Verificar que no se repita el correlativo en la selección actual
      const correlativoYaUsado = orquideasSeleccionadas.find(
        o => o.correlativo === parseInt(correlativo)
      );

      if (correlativoYaUsado) {
        toast.error('Este correlativo ya está siendo usado en esta inscripción');
        return;
      }

      const nuevaOrquidea: OrquideaSeleccionada = {
        id_orquidea: selectedOrquidea.id_orquidea,
        nombre_planta: selectedOrquidea.nombre_planta,
        correlativo: parseInt(correlativo),
        id_participante: selectedParticipante.id
      };

      setOrquideasSeleccionadas([...orquideasSeleccionadas, nuevaOrquidea]);

      // Reset selection
      setSelectedOrquidea(null);
      setCorrelativo('');
      setSearchOrquidea('');
      setAutocompleteOptions([]);

      toast.success('Orquídea agregada exitosamente');
    } finally {
      setIsAddingOrquidea(false);
    }
  };

  const quitarOrquidea = (index: number) => {
    const nuevasOrquideas = orquideasSeleccionadas.filter((_, i) => i !== index);
    setOrquideasSeleccionadas(nuevasOrquideas);
    toast.success('Orquídea removida');
  };

  const finalizarInscripcion = () => {
    if (orquideasSeleccionadas.length === 0) {
      toast.error('Debe seleccionar al menos una orquídea');
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmarInscripcion = () => {
    // Prevenir dobles envíos
    if (processing) {
      return;
    }

    setData('inscripciones', orquideasSeleccionadas);

    post(route('inscripcion.store'), {
      onSuccess: () => {
        toast.success('Inscripción realizada exitosamente');
        reset();
        setOrquideasSeleccionadas([]);
        setSelectedParticipante(null);
        setSelectedOrquidea(null);
        setCorrelativo('');
        setSearchOrquidea('');
        setIsAddingOrquidea(false);
      },
      onError: (errors) => {
        console.error('Errores:', errors);
        toast.error('Error al procesar la inscripción');
      }
    });

    setShowConfirmDialog(false);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Inscripción de Orquídeas" />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inscripción de Orquídeas</h1>
            <p className="text-gray-600 mt-2">Registra las orquídeas de los participantes para el concurso</p>
          </div>
        </div>

        {/* Alerta informativa */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Recuerda:</strong> al finalizar la inscripción de tus orquídeas, descarga el comprobante de preinscripción y entrégalo a la asociación.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel izquierdo - Formulario */}
          <div className="space-y-6">
            {/* Selección de Participante */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Buscar Participante
                </CardTitle>
                <CardDescription>
                  Selecciona el participante para inscribir sus orquídeas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="participante">Selecciona Participante</Label>
                  <Select onValueChange={handleParticipanteSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un participante" />
                    </SelectTrigger>
                    <SelectContent>
                      {participantes.map((participante) => (
                        <SelectItem key={participante.id} value={participante.id.toString()}>
                          {participante.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedParticipante && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Participante seleccionado: <strong>{selectedParticipante.nombre}</strong>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Información del último correlativo */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Último correlativo asignado:</strong> {ultimoCorrelativo}
                    {ultimoCorrelativo > 0 && (
                      <span className="block text-sm mt-1">
                        El próximo correlativo sugerido sería: {ultimoCorrelativo + 1}
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Selección de Orquídea */}
            {selectedParticipante && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Buscar Orquídea
                  </CardTitle>
                  <CardDescription>
                    Busca y selecciona las orquídeas del participante
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="search-orquidea">Buscar orquídea</Label>
                    <Autocomplete
                      options={autocompleteOptions}
                      onSelect={handleAutocompleteSelect}
                      onSearch={handleAutocompleteSearch}
                      searchValue={searchOrquidea}
                      onSearchChange={setSearchOrquidea}
                      loading={isSearchingOrquideas}
                      placeholder="Escribe el nombre de la orquídea..."
                      noResultsText="No se encontraron orquídeas"
                      className="w-full"
                    />
                    {selectedOrquidea && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-green-900">{selectedOrquidea.nombre_planta}</div>
                            <div className="text-sm text-green-700">
                              {selectedOrquidea.grupo?.nombre_grupo} - {selectedOrquidea.clase?.nombre_clase}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">Total: {selectedOrquidea.cantidad}</Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              Disponibles: {(() => {
                                const vecesSeleccionada = orquideasSeleccionadas.filter(
                                  selected => selected.id_orquidea === selectedOrquidea.id_orquidea
                                ).length;
                                return (selectedOrquidea.disponibles || selectedOrquidea.cantidad) - vecesSeleccionada;
                              })()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedOrquidea && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="correlativo">Asignar Correlativo</Label>
                        <Input
                          id="correlativo"
                          type="number"
                          placeholder="Ingresa el número correlativo"
                          value={correlativo}
                          onChange={(e) => setCorrelativo(e.target.value)}
                          className={`${
                            correlativo && !correlativoStatus.available ? 'border-red-500' :
                            correlativo && correlativoStatus.available ? 'border-green-500' : ''
                          }`}
                        />
                        {correlativoStatus.checking && (
                          <p className="text-sm text-gray-500 mt-1">Verificando correlativo...</p>
                        )}
                        {correlativo && !correlativoStatus.checking && (
                          <p className={`text-sm mt-1 ${
                            correlativoStatus.available ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {correlativoStatus.message}
                          </p>
                        )}
                      </div>

                      <Button
                        onClick={agregarOrquidea}
                        disabled={
                          !correlativo ||
                          !correlativoStatus.available ||
                          correlativoStatus.checking ||
                          isAddingOrquidea ||
                          !selectedOrquidea
                        }
                        className="w-full"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {isAddingOrquidea ? 'Agregando...' : 'Agregar Orquídea'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Panel derecho - Resumen */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Orquídeas Seleccionadas</CardTitle>
                <CardDescription>
                  Resumen de las orquídeas que serán inscritas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orquideasSeleccionadas.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Leaf className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>No hay orquídeas seleccionadas</p>
                    <p className="text-sm">Selecciona un participante y sus orquídeas para comenzar</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {orquideasSeleccionadas.map((orquidea, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">{orquidea.nombre_planta}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">Correlativo: {orquidea.correlativo}</Badge>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => quitarOrquidea(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Total: {orquideasSeleccionadas.length} orquídea{orquideasSeleccionadas.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <Button
                      onClick={finalizarInscripcion}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={processing}
                    >
                      {processing ? 'Procesando...' : 'Finalizar Inscripción'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog de confirmación */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Inscripción</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Estás seguro de que deseas finalizar la inscripción de {orquideasSeleccionadas.length} orquídea{orquideasSeleccionadas.length !== 1 ? 's' : ''}
                para {selectedParticipante?.nombre}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmarInscripcion}>
                Confirmar Inscripción
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
}
