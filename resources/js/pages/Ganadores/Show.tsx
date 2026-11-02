import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Trophy,
  User,
  Flower2,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Award,
  Tag,
  FileText,
  Users
} from "lucide-react";

interface Ganador {
  id_ganador: number;
  posicion: number;
  empate: boolean;
  fecha_ganador: string;
  inscripcion: {
    id_nscr: number;
    correlativo: number;
    participante: {
      id: number;
      nombre: string;
      numero_telefonico?: string;
      direccion?: string;
      tipoParticipante?: { Clase: string };
      departamento?: { nombre_departamento: string };
      municipio?: { nombre_municipio: string };
      aso?: { Clase: string };
    };
    orquidea: {
      id_orquidea: number;
      nombre_planta: string;
      origen: string;
      foto?: string;
      grupo?: { nombre_grupo: string; Cod_Grupo: string };
      clase?: { nombre_clase: string };
    };
    listones?: Array<{
      id_liston: number;
      trofeo: {
        id_trofeo: number;
        nombre: string;
        descripcion?: string;
      };
    }>;
  };
  evento?: {
    id_evento: number;
    nombre_evento: string;
    fecha_inicio: string;
  };
}

interface ShowGanadorProps {
  ganador: Ganador;
}

export default function ShowGanador({ ganador }: ShowGanadorProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPosicionBadge = (posicion: number, empate: boolean) => {
    const badges = {
      1: { text: '1er Lugar', color: 'bg-yellow-500' },
      2: { text: '2do Lugar', color: 'bg-gray-400' },
      3: { text: '3er Lugar', color: 'bg-amber-700' },
    };
    const badge = badges[posicion as keyof typeof badges] || { text: `Posición ${posicion}`, color: 'bg-blue-500' };
    return (
      <div className="flex items-center gap-2">
        <Badge className={`${badge.color} text-white`}>
          <Trophy className="mr-2 h-4 w-4" />
          {badge.text}
        </Badge>
        {empate && (
          <Badge variant="outline" className="border-amber-500 text-amber-700">
            Empate
          </Badge>
        )}
      </div>
    );
  };

  return (
    <AppLayout>
      <Head title={`Ganador - ${ganador.inscripcion.participante.nombre}`} />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-foreground">
              <Trophy className="h-7 w-7 sm:h-8 sm:w-8 text-amber-500" />
              Información del Ganador
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Detalles completos del ganador, orquídea y listones obtenidos
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link href={route('ganadores.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Ganadores
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {/* Información del Ganador */}
          <Card className="shadow-lg border-border">
            <CardHeader className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Trophy className="h-5 w-5" />
                Información del Premio
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Posición</label>
                <div className="mt-1">
                  {getPosicionBadge(ganador.posicion, ganador.empate)}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de Premiación
                </label>
                <p className="text-lg font-medium mt-1">{formatDate(ganador.fecha_ganador)}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Correlativo de Inscripción
                </label>
                <p className="text-2xl font-bold text-primary mt-1">
                  #{ganador.inscripcion.correlativo}
                </p>
              </div>

              {ganador.evento && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Evento</label>
                  <p className="text-lg mt-1">{ganador.evento.nombre_evento}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(ganador.evento.fecha_inicio)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del Participante */}
          <Card className="shadow-lg border-border">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <User className="h-5 w-5" />
                Información del Participante
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Nombre Completo</label>
                <p className="text-xl font-bold mt-1">{ganador.inscripcion.participante.nombre}</p>
              </div>

              {ganador.inscripcion.participante.tipoParticipante && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Tipo de Participante</label>
                  <Badge variant="outline" className="mt-1">
                    {ganador.inscripcion.participante.tipoParticipante.Clase}
                  </Badge>
                </div>
              )}

              {ganador.inscripcion.participante.aso && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Asociación
                  </label>
                  <p className="text-lg mt-1">{ganador.inscripcion.participante.aso.Clase}</p>
                </div>
              )}

              {ganador.inscripcion.participante.numero_telefonico && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </label>
                  <p className="text-lg mt-1">{ganador.inscripcion.participante.numero_telefonico}</p>
                </div>
              )}

              {(ganador.inscripcion.participante.departamento || ganador.inscripcion.participante.municipio) && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ubicación
                  </label>
                  <p className="text-lg mt-1">
                    {ganador.inscripcion.participante.municipio?.nombre_municipio}
                    {ganador.inscripcion.participante.departamento &&
                      `, ${ganador.inscripcion.participante.departamento.nombre_departamento}`}
                  </p>
                </div>
              )}

              {ganador.inscripcion.participante.direccion && (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground">Dirección</label>
                  <p className="text-sm text-foreground mt-1">{ganador.inscripcion.participante.direccion}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información de la Orquídea Ganadora */}
        <Card className="shadow-lg border-border">
          <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-border">
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Flower2 className="h-5 w-5" />
              Orquídea Ganadora
            </CardTitle>
            <CardDescription>
              Detalles completos de la planta premiada
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Nombre Científico</label>
                  <p className="text-2xl font-bold italic text-green-700 mt-1">
                    {ganador.inscripcion.orquidea.nombre_planta}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Origen</label>
                  <Badge className={ganador.inscripcion.orquidea.origen === 'Especie' ? 'bg-green-600' : 'bg-purple-600'}>
                    {ganador.inscripcion.orquidea.origen}
                  </Badge>
                </div>

                {ganador.inscripcion.orquidea.grupo && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Grupo</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-base">
                        {ganador.inscripcion.orquidea.grupo.Cod_Grupo}
                      </Badge>
                      <span className="text-lg">{ganador.inscripcion.orquidea.grupo.nombre_grupo}</span>
                    </div>
                  </div>
                )}

                {ganador.inscripcion.orquidea.clase && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Clase</label>
                    <p className="text-lg mt-1">{ganador.inscripcion.orquidea.clase.nombre_clase}</p>
                  </div>
                )}
              </div>

              {ganador.inscripcion.orquidea.foto && (
                <div className="flex items-center justify-center">
                  <div className="border-4 border-green-200 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src={`/storage/${ganador.inscripcion.orquidea.foto}`}
                      alt={ganador.inscripcion.orquidea.nombre_planta}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder-orchid.png';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Listones Obtenidos */}
        {ganador.inscripcion.listones && ganador.inscripcion.listones.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Award className="h-5 w-5" />
                Listones y Reconocimientos Obtenidos
              </CardTitle>
              <CardDescription>
                Premios adicionales otorgados a esta orquídea
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ganador.inscripcion.listones.map((liston) => (
                  <Card key={liston.id_liston} className="border-2 border-purple-200 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        {liston.trofeo.nombre}
                      </CardTitle>
                    </CardHeader>
                    {liston.trofeo.descripcion && (
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600">{liston.trofeo.descripcion}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-4 pt-4">
          <Button asChild variant="outline" className="flex-1">
            <Link href={route('ganadores.edit', ganador.id_ganador)}>
              Editar Información
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={route('ganadores.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Lista de Ganadores
            </Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
