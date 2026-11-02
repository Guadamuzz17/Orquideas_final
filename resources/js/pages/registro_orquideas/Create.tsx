import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Camera, Plus, Minus, Upload, Flower2, Lock, AlertTriangle } from "lucide-react";
import { toast } from 'sonner';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { AutocompleteOrquidea } from '@/components/AutocompleteOrquidea';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Grupo {
  id_grupo: number;
  nombre_grupo: string;
  Cod_Grupo: string;
}

interface Clase {
  id_clase: number;
  nombre_clase: string;
  id_grupp: number;
}

interface Participante {
  id: number;
  nombre: string;
}

interface CreateOrquideaProps {
  grupos: Grupo[];
  clases: Clase[];
  participantes: Participante[];
}

export default function CreateOrquidea({ grupos, clases, participantes }: CreateOrquideaProps) {
  const { eventoActivo } = usePage().props as any;
  const [clasesDisponibles, setClasesDisponibles] = useState<Clase[]>(clases);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchParticipante, setSearchParticipante] = useState('');
  const [participantesFiltrados, setParticipantesFiltrados] = useState<Participante[]>(participantes);

  const isEventoFinalizado = eventoActivo?.bloqueado || eventoActivo?.estado === 'finalizado';

  const { data, setData, post, processing, errors, reset } = useForm({
    nombre_planta: '',
    origen: '',
    id_grupo: '',
    id_clase: '',
    cantidad: 1,
    id_participante: '',
    foto: null as File | null,
  });

  // Filtrar clases cuando cambia el grupo
  useEffect(() => {
    if (data.id_grupo) {
      const clasesFiltradas = clases.filter(clase => clase.id_grupp.toString() === data.id_grupo);
      setClasesDisponibles(clasesFiltradas);
      setData('id_clase', ''); // Resetear clase cuando cambia grupo
    }
  }, [data.id_grupo]);

  // Filtrar participantes cuando cambia la búsqueda
  useEffect(() => {
    if (searchParticipante.trim() === '') {
      setParticipantesFiltrados(participantes);
    } else {
      const filtered = participantes.filter(p =>
        p.nombre.toLowerCase().includes(searchParticipante.toLowerCase()) ||
        p.id.toString().includes(searchParticipante)
      );
      setParticipantesFiltrados(filtered);
    }
  }, [searchParticipante, participantes]);

  const incrementQuantity = () => {
    if (data.cantidad < 99) {
      setData('cantidad', data.cantidad + 1);
    }
  };

  const decrementQuantity = () => {
    if (data.cantidad > 1) {
      setData('cantidad', data.cantidad - 1);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setData('foto', file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // Implementar captura de cámara
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          // Aquí podrías implementar la lógica de captura de cámara
          toast.info('Funcionalidad de cámara en desarrollo');
        })
        .catch(err => {
          toast.error('No se pudo acceder a la cámara');
        });
    } else {
      toast.error('Cámara no disponible en este dispositivo');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Crear FormData para manejar la imagen
    const formData = new FormData();
    formData.append('nombre_planta', data.nombre_planta);
    formData.append('origen', data.origen);
    formData.append('id_grupo', data.id_grupo);
    formData.append('id_clase', data.id_clase);
    formData.append('cantidad', data.cantidad.toString());
    formData.append('id_participante', data.id_participante);

    if (data.foto) {
      formData.append('foto', data.foto);
    }

    post(route('orquideas.store'), {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Orquídea registrada exitosamente');
        reset();
        setSelectedFile(null);
        setPreviewUrl(null);
      },
      onError: () => {
        toast.error('Error al registrar la orquídea');
      }
    });
  };

  return (
    <AppLayout>
      <Head title="Registrar Orquídea" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">Registrar Nueva Orquídea</h1>
          <Button asChild variant="outline" className="w-fit">
            <Link href={route('orquideas.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Catálogo
            </Link>
          </Button>
        </div>

        {/* Alerta de evento bloqueado */}
        {isEventoFinalizado && (
          <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900">
            <Lock className="h-5 w-5" />
            <AlertTitle className="text-red-800 dark:text-red-300 font-bold">🔒 Evento Finalizado - Formulario Bloqueado</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-200">
              El evento "{eventoActivo?.nombre}" ha finalizado y no se pueden registrar nuevas orquídeas.
              Por favor, seleccione un evento activo desde el menú de eventos.
            </AlertDescription>
          </Alert>
        )}

        <Card className={`shadow-lg border-border ${isEventoFinalizado ? 'opacity-60 pointer-events-none' : ''}`}>
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Flower2 className="h-5 w-5" />
              Información de la Orquídea
              {isEventoFinalizado && <Lock className="h-4 w-4 text-red-600 ml-auto" />}
            </CardTitle>
            <CardDescription>
              Complete todos los campos para registrar una nueva orquídea en el sistema
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre de la Planta con Autocompletado */}
              <div className="space-y-2">
                <Label htmlFor="nombre_planta" className="text-sm font-medium">
                  Nombre de la Planta *
                </Label>
                <AutocompleteOrquidea
                  value={data.nombre_planta}
                  onChange={(value) => setData('nombre_planta', value)}
                  placeholder="Ej: Cattleya mossiae, Phalaenopsis amabilis..."
                  error={!!errors.nombre_planta}
                />
                <p className="text-xs text-muted-foreground">
                  💡 Empiece a escribir para ver sugerencias de nombres existentes
                </p>
                {errors.nombre_planta && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.nombre_planta}</p>
                )}
              </div>

              {/* Origen */}
              <div className="space-y-2">
                <Label htmlFor="origen" className="text-sm font-medium">
                  Origen *
                </Label>
                <Select value={data.origen} onValueChange={(value) => setData('origen', value)} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecciona el origen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Especie">🌿 Especie</SelectItem>
                    <SelectItem value="Híbrida">🌺 Híbrida</SelectItem>
                  </SelectContent>
                </Select>
                {errors.origen && (
                  <p className="text-sm text-red-600">{errors.origen}</p>
                )}
              </div>

              {/* Grupo y Clase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id_grupo" className="text-sm font-medium">
                    Grupo *
                  </Label>
                  <Select value={data.id_grupo} onValueChange={(value) => setData('id_grupo', value)} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona un grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {(grupos || []).filter(g => g && g.id_grupo && g.nombre_grupo).map((grupo) => (
                        <SelectItem key={grupo.id_grupo} value={grupo.id_grupo.toString()}>
                          {grupo.Cod_Grupo} - {grupo.nombre_grupo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.id_grupo && (
                    <p className="text-sm text-red-600">{errors.id_grupo}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_clase" className="text-sm font-medium">
                    Clase *
                  </Label>
                  <Select
                    value={data.id_clase}
                    onValueChange={(value) => setData('id_clase', value)}
                    disabled={!data.id_grupo}
                    required
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona una clase" />
                    </SelectTrigger>
                    <SelectContent>
                      {(clasesDisponibles || []).filter(c => c && c.id_clase && c.nombre_clase).map((clase) => (
                        <SelectItem key={clase.id_clase} value={clase.id_clase.toString()}>
                          {clase.nombre_clase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.id_clase && (
                    <p className="text-sm text-red-600">{errors.id_clase}</p>
                  )}
                </div>
              </div>

              {/* Cantidad y Participante */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cantidad de Orquídeas *</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      className="h-11 w-11"
                      disabled={data.cantidad <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={data.cantidad}
                      onChange={(e) => setData('cantidad', Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
                      className="h-11 text-center"
                      min="1"
                      max="99"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      className="h-11 w-11"
                      disabled={data.cantidad >= 99}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {errors.cantidad && (
                    <p className="text-sm text-red-600">{errors.cantidad}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_participante" className="text-sm font-medium">
                    Participante *
                  </Label>
                  <Input
                    type="text"
                    placeholder="🔍 Buscar por nombre o ID..."
                    value={searchParticipante}
                    onChange={(e) => setSearchParticipante(e.target.value)}
                    className="h-11 mb-2"
                  />
                  <Select value={data.id_participante} onValueChange={(value) => setData('id_participante', value)} required>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona un participante" />
                    </SelectTrigger>
                    <SelectContent>
                      {participantesFiltrados.length > 0 ? (
                        (participantesFiltrados || []).filter(p => p && p.id && p.nombre).map((participante) => (
                          <SelectItem key={participante.id} value={participante.id.toString()}>
                            #{participante.id} - {participante.nombre}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-results" disabled>
                          No se encontraron participantes
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    💡 {participantesFiltrados.length} participante(s) del evento activo
                  </p>
                  {errors.id_participante && (
                    <p className="text-sm text-red-600">{errors.id_participante}</p>
                  )}
                </div>
              </div>

              {/* Foto de la Orquídea */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Foto de la Orquídea</Label>

                <div className="border-2 border-dashed border-border bg-card rounded-lg p-6 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />

                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto h-32 w-32 object-cover rounded-lg border border-border"
                      />
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Archivo seleccionado: {selectedFile?.name}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Cambiar archivo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <div className="text-muted-foreground">Arrastra una imagen aquí o haz clic para seleccionar</div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Seleccionar archivo
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleCameraCapture}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Abrir Cámara
                  </Button>
                </div>

                {errors.foto && (
                  <p className="text-sm text-red-600">{errors.foto}</p>
                )}
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                  disabled={processing}
                >
                  <Flower2 className="mr-2 h-4 w-4" />
                  {processing ? 'Registrando...' : 'Registrar Orquídea'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-12"
                  onClick={() => {
                    reset();
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
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
