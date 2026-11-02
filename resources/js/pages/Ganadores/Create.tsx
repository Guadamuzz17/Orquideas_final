import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { Search, Trophy, User, Leaf, Award, Users } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Ganadores',
    href: '/ganadores',
  },
  {
    title: 'Asignar Ganador',
    href: '/ganadores/create',
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
  grupo?: Grupo;
  clase?: Clase;
}

interface Inscripcion {
  id_nscr: number;
  correlativo: number;
  participante: Participante;
  orquidea: Orquidea;
  created_at: string;
}

interface CreateGanadorProps {
  participantes: Participante[];
  grupos: Grupo[];
  clases: Clase[];
  inscripciones: Inscripcion[];
}

export default function CreateGanador({ participantes, grupos, clases, inscripciones }: CreateGanadorProps) {
  const [filtroParticipante, setFiltroParticipante] = useState('');
  const [filtroGrupo, setFiltroGrupo] = useState('');
  const [filtroCorrelativo, setFiltroCorrelativo] = useState('');
  const [filtroOrquidea, setFiltroOrquidea] = useState('');
  const [inscripcionesFiltradas, setInscripcionesFiltradas] = useState<Inscripcion[]>([]);
  const [selectedInscripcion, setSelectedInscripcion] = useState<Inscripcion | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    id_inscripcion: '',
    posicion: '',
    empate: false as boolean
  });

  // Cargar inscripciones disponibles (sin ganador) al iniciar
  useEffect(() => {
    fetchInscripciones();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros();
  }, [filtroParticipante, filtroGrupo, filtroCorrelativo, filtroOrquidea, inscripciones]);

  const fetchInscripciones = async () => {
    try {
      const response = await fetch('/ganadores/search-inscripciones');
      const data = await response.json();
      setInscripcionesFiltradas(data);
    } catch (error) {
      console.error('Error al cargar inscripciones:', error);
      toast.error('Error al cargar las inscripciones disponibles');
    }
  };

  const aplicarFiltros = () => {
    let filtradas = inscripciones;

    if (filtroParticipante) {
      filtradas = filtradas.filter(inscripcion =>
        inscripcion.participante.nombre.toLowerCase().includes(filtroParticipante.toLowerCase())
      );
    }

    if (filtroGrupo) {
      filtradas = filtradas.filter(inscripcion =>
        inscripcion.orquidea.grupo?.nombre_grupo.toLowerCase().includes(filtroGrupo.toLowerCase())
      );
    }

    if (filtroCorrelativo) {
      filtradas = filtradas.filter(inscripcion =>
        inscripcion.correlativo.toString().includes(filtroCorrelativo)
      );
    }

    if (filtroOrquidea) {
      filtradas = filtradas.filter(inscripcion =>
        inscripcion.orquidea.nombre_planta.toLowerCase().includes(filtroOrquidea.toLowerCase())
      );
    }

    setInscripcionesFiltradas(filtradas);
  };

  const handleInscripcionSelect = (inscripcionId: string) => {
    const inscripcion = inscripcionesFiltradas.find(i => i.id_nscr.toString() === inscripcionId);
    setSelectedInscripcion(inscripcion || null);
    setData('id_inscripcion', inscripcionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.id_inscripcion || !data.posicion) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    post(route('ganadores.store'), {
      onSuccess: () => {
        toast.success('Ganador asignado correctamente');
        reset();
        setSelectedInscripcion(null);
        fetchInscripciones(); // Recargar inscripciones disponibles
      },
      onError: (errors) => {
        console.error('Errores:', errors);
        toast.error('Error al asignar el ganador');
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Asignar Ganador" />

      <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
              <Trophy className="h-7 w-7 sm:h-8 sm:w-8 text-amber-500" />
              Asignar Ganador
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">Designa ganadores para las orquídeas inscritas</p>
          </div>

          <Button asChild variant="outline" className="w-fit">
            <Link href={route('ganadores.index')}>
              <Users className="mr-2 h-4 w-4" />
              Ver Ganadores
            </Link>
          </Button>
        </div>

        {/* Filtros de búsqueda */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="filtro-participante">Buscar Participante</Label>
            <Input
              id="filtro-participante"
              placeholder="Nombre del participante..."
              value={filtroParticipante}
              onChange={(e) => setFiltroParticipante(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="filtro-grupo">Buscar Grupo</Label>
            <Input
              id="filtro-grupo"
              placeholder="Ej: A, B, C..."
              value={filtroGrupo}
              onChange={(e) => setFiltroGrupo(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="filtro-correlativo">Buscar Correlativo</Label>
            <Input
              id="filtro-correlativo"
              placeholder="Número correlativo..."
              value={filtroCorrelativo}
              onChange={(e) => setFiltroCorrelativo(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="filtro-orquidea">Buscar Orquídea</Label>
            <Input
              id="filtro-orquidea"
              placeholder="Nombre de la orquídea..."
              value={filtroOrquidea}
              onChange={(e) => setFiltroOrquidea(e.target.value)}
            />
          </div>
        </div>

        {/* Instrucciones */}
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200">
          <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Instrucciones:</strong> Escriba el nombre de la orquídea, participante o grupo (por ejemplo: A) para filtrar.
          </AlertDescription>
        </Alert>

        {/* Formulario en Card */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Asignar Ganador
            </CardTitle>
            <CardDescription>
              Complete la información para asignar un ganador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selección de orquídea */}
              <div>
                <Label htmlFor="inscripcion">Seleccionar Orquídea</Label>
                <Select onValueChange={handleInscripcionSelect} value={data.id_inscripcion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una orquídea inscrita" />
                  </SelectTrigger>
                  <SelectContent>
                    {inscripcionesFiltradas.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No hay inscripciones disponibles con los filtros actuales
                      </div>
                    ) : (
                      (inscripcionesFiltradas || []).filter(i => i && i.id_nscr && i.correlativo && i.orquidea).map((inscripcion) => (
                        <SelectItem key={inscripcion.id_nscr} value={inscripcion.id_nscr.toString()}>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">#{inscripcion.correlativo}</Badge>
                            <span>{inscripcion.orquidea?.nombre_planta || 'Sin nombre'}</span>
                            <span className="text-sm text-muted-foreground">
                              - {inscripcion.participante?.nombre || 'Sin participante'}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.id_inscripcion && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.id_inscripcion}</p>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  <strong>Inscripciones disponibles:</strong> {inscripcionesFiltradas.length}
                </div>
              </div>

              {/* Información de la orquídea seleccionada */}
              {selectedInscripcion && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/40 text-green-800 dark:text-green-200">
                  <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    <div className="space-y-1">
                      <div><strong>Orquídea:</strong> {selectedInscripcion.orquidea.nombre_planta}</div>
                      <div><strong>Participante:</strong> {selectedInscripcion.participante.nombre}</div>
                      <div><strong>Correlativo:</strong> #{selectedInscripcion.correlativo}</div>
                      <div><strong>Grupo:</strong> {selectedInscripcion.orquidea.grupo?.nombre_grupo}</div>
                      <div><strong>Clase:</strong> {selectedInscripcion.orquidea.clase?.nombre_clase}</div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Mostrar información de categoría (solo informativa) */}
              {selectedInscripcion && (
                <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200">
                  <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <div className="space-y-1">
                      <div><strong>Categoría de la orquídea:</strong></div>
                      <div>• <strong>Grupo:</strong> {selectedInscripcion.orquidea.grupo?.nombre_grupo}</div>
                      <div>• <strong>Clase:</strong> {selectedInscripcion.orquidea.clase?.nombre_clase}</div>
                      <p className="text-sm mt-2">
                        Esta orquídea ganará en su categoría correspondiente según su grupo y clase.
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Selección de posición */}
              {selectedInscripcion && (
                <div>
                  <Label htmlFor="posicion">Posición obtenida</Label>
                  <Select onValueChange={(value) => setData('posicion', value)} value={data.posicion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">🥇 1° Lugar (Primer Lugar)</SelectItem>
                      <SelectItem value="2">🥈 2° Lugar (Segundo Lugar)</SelectItem>
                      <SelectItem value="3">🥉 3° Lugar (Tercer Lugar)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.posicion && (
                    <p className="text-sm text-red-600 mt-1">{errors.posicion}</p>
                  )}
                </div>
              )}

              {/* Checkbox de empate */}
              {selectedInscripcion && data.posicion && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="empate"
                    checked={data.empate}
                    onCheckedChange={(checked) => setData('empate', !!checked)}
                  />
                  <Label htmlFor="empate">Marcar si hay empate en esta posición</Label>
                </div>
              )}

              {/* Botón de envío */}
              {selectedInscripcion && data.posicion && (
                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  {processing ? 'Asignando ganador...' : 'Asignar Ganador'}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
