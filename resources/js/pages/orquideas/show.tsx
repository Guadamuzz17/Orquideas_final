import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface PageProps { orquidea: any }

export default function Show() {
  const { orquidea } = usePage<PageProps>().props;
  return (
    <div className="p-4 space-y-2">
      <h1 className="text-lg font-semibold">Detalle de Orquídea</h1>
      <div>Nombre: {orquidea.nombre_planta}</div>
      <div>Origen: {orquidea.origen}</div>
      <div>Grupo: {orquidea.grupo?.nombre_grupo}</div>
      <div>Clase: {orquidea.clase?.nombre_clase}</div>
      <div>Participante: {orquidea.participante?.nombre}</div>
      {orquidea.foto ? (
        <img src={`/storage/orquideas/${orquidea.foto}`} className="max-w-xs" />
      ) : (
        <div>No hay foto disponible</div>
      )}
      <Button asChild variant="outline"><Link href={route('orquideas.index')}>Inicio</Link></Button>
    </div>
  );
}
