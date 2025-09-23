import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slash, ArrowLeft } from "lucide-react";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { toast } from 'sonner';
import axios from 'axios';

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
  
  const { data, setData, post, processing, errors, reset } = useForm({
    nombre: '',
    numero_telefonico: '',
    direccion: '',
    id_tipo: '',
    id_departamento: '',
    id_municipio: '',
    id_aso: '',
  });

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