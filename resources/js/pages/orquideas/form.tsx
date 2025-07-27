import { useForm, Link } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Option { id:number|string; nombre_grupo?:string; nombre_clase?:string; nombre?:string; id_grupp?:number; }
interface PageProps {
  orquidea?: any;
  grupos: Option[];
  clases: Option[];
  participantes: Option[];
}

export default function Form({ orquidea, grupos, clases, participantes }: PageProps) {
  const { data, setData, post, processing, put } = useForm({
    nombre_planta: orquidea?.nombre_planta || '',
    origen: orquidea?.origen || '',
    id_grupo: orquidea?.id_grupo || '',
    id_case: orquidea?.id_case || '',
    a: orquidea?.a || '',
    foto: null as File | null,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as any);
    });
    if (orquidea) {
      put(route('orquideas.update', orquidea.id_orquidea), { data: formData });
    } else {
      post(route('orquideas.store'), { data: formData });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 p-4 max-w-xl">
      <Input
        value={data.nombre_planta}
        onChange={(e) => setData('nombre_planta', e.target.value)}
        placeholder="Nombre de la Planta"
        required
      />
      <Select value={data.origen} onValueChange={(v) => setData('origen', v)}>
        <SelectTrigger><SelectValue placeholder="Origen" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="especie">Especie</SelectItem>
          <SelectItem value="hibrido">Híbrido</SelectItem>
        </SelectContent>
      </Select>
      <Select value={data.id_grupo} onValueChange={(v)=>setData('id_grupo', v)}>
        <SelectTrigger><SelectValue placeholder="Grupo" /></SelectTrigger>
        <SelectContent>
          {grupos.map(g=>(
            <SelectItem key={g.id} value={String(g.id)}>{g.nombre_grupo}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={data.id_case} onValueChange={(v)=>setData('id_case', v)}>
        <SelectTrigger><SelectValue placeholder="Clase" /></SelectTrigger>
        <SelectContent>
          {clases.filter(c=>String(c.id_grupp)===String(data.id_grupo)).map(c=>(
            <SelectItem key={c.id} value={String(c.id)}>{c.nombre_clase}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={data.a} onValueChange={(v)=>setData('a', v)}>
        <SelectTrigger><SelectValue placeholder="Participante" /></SelectTrigger>
        <SelectContent>
          {participantes.map(p=>(
            <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input type="file" onChange={e=>setData('foto', e.target.files?.[0]||null)} />
      <div className="space-x-2">
        <Button type="submit" disabled={processing}>Guardar</Button>
        <Button variant="outline" asChild><Link href={route('orquideas.index')}>Cancelar</Link></Button>
      </div>
    </form>
  );
}
