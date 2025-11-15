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

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              Información del Ganador
            </h1>
            <p className="text-gray-500 mt-2">
              Detalles completos del ganador, orquídea y listones obtenidos
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={route('ganadores.index')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Ganadores
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Información del Ganador */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-amber-50 border-b">
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Trophy className="h-5 w-5" />
                Información del Premio
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Posición</label>
                <div className="mt-1">
                  {getPosicionBadge(ganador.posicion, ganador.empate)}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Fecha de Premiación
                </label>
                <p className="text-lg font-medium mt-1">{formatDate(ganador.fecha_ganador)}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Correlativo de Inscripción
                </label>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  #{ganador.inscripcion.correlativo}
                </p>
              </div>

              {ganador.evento && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Evento</label>
                  <p className="text-lg mt-1">{ganador.evento.nombre_evento}</p>
                  <p className="text-sm text-gray-500">{formatDate(ganador.evento.fecha_inicio)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información del Participante */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <User className="h-5 w-5" />
                Información del Participante
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Nombre Completo</label>
                <p className="text-xl font-bold mt-1">{ganador.inscripcion.participante.nombre}</p>
              </div>

              {ganador.inscripcion.participante.tipoParticipante && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Tipo de Participante</label>
                  <Badge variant="outline" className="mt-1">
                    {ganador.inscripcion.participante.tipoParticipante.Clase}
                  </Badge>
                </div>
              )}

              {ganador.inscripcion.participante.aso && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Asociación
                  </label>
                  <p className="text-lg mt-1">{ganador.inscripcion.participante.aso.Clase}</p>
                </div>
              )}

              {ganador.inscripcion.participante.numero_telefonico && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono
                  </label>
                  <p className="text-lg mt-1">{ganador.inscripcion.participante.numero_telefonico}</p>
                </div>
              )}

              {(ganador.inscripcion.participante.departamento || ganador.inscripcion.participante.municipio) && (
                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
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
                  <label className="text-sm font-semibold text-gray-600">Dirección</label>
                  <p className="text-sm text-gray-700 mt-1">{ganador.inscripcion.participante.direccion}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información de la Orquídea Ganadora */}
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <CardTitle className="flex items-center gap-2 text-green-800">
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
