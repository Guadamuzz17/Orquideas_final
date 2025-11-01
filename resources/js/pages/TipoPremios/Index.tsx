import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Search, Plus, Trash2, Award, Edit } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Configuración',
    href: '#',
  },
  {
    title: 'Tipos de Premios',
    href: '/tipo-premios',
  },
];

interface TipoPremio {
    id_tipo_premio: number;
    nombre_premio: string;
    descripcion: string | null;
    posicion: number;
    color: string;
    activo: boolean;
}

interface Props {
    tiposPremio: TipoPremio[];
}

export default function Index({ tiposPremio }: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTipos = tiposPremio.filter(tipo =>
        tipo.nombre_premio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleActivo = (id: number, currentState: boolean) => {
        router.patch(route('tipo-premios.toggle-activo', id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`Tipo de premio ${currentState ? 'desactivado' : 'activado'} correctamente`);
            },
            onError: () => {
                toast.error('No se pudo actualizar el estado');
            }
        });
    };

    const handleDelete = (id: number, nombre: string) => {
        router.delete(route('tipo-premios.destroy', id), {
            onSuccess: () => {
                toast.success('Tipo de premio eliminado correctamente');
            },
            onError: () => {
                toast.error('No se pudo eliminar el tipo de premio');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tipos de Premios" />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 sm:p-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tipos de Premios</h1>
                        <p className="text-gray-600 mt-2">Gestiona los tipos de premios y listones disponibles</p>
                    </div>
                    <Button onClick={() => router.visit(route('tipo-premios.create'))}>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Tipo de Premio
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            Lista de Tipos de Premios
                        </CardTitle>
                        <CardDescription>
                            Administra los diferentes tipos de premios que se pueden otorgar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Buscador */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Buscar tipo de premio..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Tabla Desktop */}
                        <div className="hidden overflow-x-auto sm:block">
                            <table className="w-full">
                                <thead className="border-b">
                                    <tr>
                                        <th className="pb-3 text-left text-sm font-medium text-gray-500">Pos.</th>
                                        <th className="pb-3 text-left text-sm font-medium text-gray-500">Nombre</th>
                                        <th className="pb-3 text-left text-sm font-medium text-gray-500">Descripción</th>
                                        <th className="pb-3 text-left text-sm font-medium text-gray-500">Color</th>
                                        <th className="pb-3 text-left text-sm font-medium text-gray-500">Estado</th>
                                        <th className="pb-3 text-right text-sm font-medium text-gray-500">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredTipos.map((tipo) => (
                                        <tr key={tipo.id_tipo_premio} className="hover:bg-gray-50">
                                            <td className="py-4 text-sm font-medium">{tipo.posicion}</td>
                                            <td className="py-4 text-sm">{tipo.nombre_premio}</td>
                                            <td className="py-4 text-sm text-gray-500">{tipo.descripcion || '-'}</td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="inline-block h-5 w-5 rounded-full border"
                                                        style={{ backgroundColor: tipo.color }}
                                                    ></span>
                                                    <span className="font-mono text-xs">{tipo.color}</span>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <button
                                                    onClick={() => handleToggleActivo(tipo.id_tipo_premio, tipo.activo)}
                                                    className="inline-block"
                                                >
                                                    <Badge variant={tipo.activo ? 'default' : 'secondary'}>
                                                        {tipo.activo ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </button>
                                            </td>
                                            <td className="py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => router.visit(route('tipo-premios.edit', tipo.id_tipo_premio))}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Eliminar tipo de premio?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Se eliminará "{tipo.nombre_premio}". Esta acción no se puede deshacer.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(tipo.id_tipo_premio, tipo.nombre_premio)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Cards Mobile */}
                        <div className="grid grid-cols-1 gap-4 sm:hidden">
                            {filteredTipos.map((tipo) => (
                                <div key={tipo.id_tipo_premio} className="rounded-lg border p-4">
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                                                {tipo.posicion}
                                            </span>
                                            <div>
                                                <h3 className="font-semibold">{tipo.nombre_premio}</h3>
                                                <p className="text-xs text-gray-500">{tipo.descripcion || 'Sin descripción'}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleToggleActivo(tipo.id_tipo_premio, tipo.activo)}>
                                            <Badge variant={tipo.activo ? 'default' : 'secondary'}>
                                                {tipo.activo ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </button>
                                    </div>
                                    <div className="mb-3 flex items-center gap-2">
                                        <span
                                            className="inline-block h-5 w-5 rounded-full border"
                                            style={{ backgroundColor: tipo.color }}
                                        ></span>
                                        <span className="font-mono text-xs">{tipo.color}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => router.visit(route('tipo-premios.edit', tipo.id_tipo_premio))}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />
                                            Editar
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button size="sm" variant="destructive" className="flex-1">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar tipo de premio?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Se eliminará "{tipo.nombre_premio}". Esta acción no se puede deshacer.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(tipo.id_tipo_premio, tipo.nombre_premio)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredTipos.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-gray-500">No se encontraron tipos de premios</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
