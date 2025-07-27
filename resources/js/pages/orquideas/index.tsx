import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Orquidea {
  id_orquidea: number;
  codigo_orquide: string;
  participante?: { nombre: string };
  grupo?: { Cod_Grupo: string; nombre_grupo: string };
  clase?: { nombre_clase: string };
}

interface PageProps { orquideas: { data: Orquidea[] } }

export default function Index() {
  const { orquideas } = usePage<PageProps>().props;
  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-lg font-semibold">Listado de Orquídeas</h1>
        <Button asChild><Link href={route('orquideas.create')}>Agregar Nuevo Registro</Link></Button>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="border px-2">ID</th>
            <th className="border px-2">Correlativo</th>
            <th className="border px-2">Participante</th>
            <th className="border px-2">Código Grupo</th>
            <th className="border px-2">Clase</th>
            <th className="border px-2">Nombre Grupo</th>
            <th className="border px-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orquideas.data.map(o => (
            <tr key={o.id_orquidea} className="border-t">
              <td className="border px-2">{o.id_orquidea}</td>
              <td className="border px-2">{o.codigo_orquide}</td>
              <td className="border px-2">{o.participante?.nombre}</td>
              <td className="border px-2">{o.grupo?.Cod_Grupo}</td>
              <td className="border px-2">{o.clase?.nombre_clase}</td>
              <td className="border px-2">{o.grupo?.nombre_grupo}</td>
              <td className="border px-2 space-x-1">
                <Link href={route('orquideas.show', o.id_orquidea)} className="text-blue-600">Ver</Link>
                <Link href={route('orquideas.edit', o.id_orquidea)} className="text-green-600">Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
