import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EstadisticasProps {
    total_listones: number;
    listones_por_tipo: Record<string, number>;
}

interface ListonReciente {
    id: number;
    correlativo: string;
    participante: string;
    orquidea: string;
    tipo_liston: string;
    fecha_ganador: string;
}

interface Grupo {
    id_grupo: number;
    nom_grupo: string;
}

interface Clase {
    id_clase: number;
    nom_clase: string;
}

interface PageProps {
    estadisticas: EstadisticasProps;
    listones_recientes: ListonReciente[];
    grupos: Grupo[];
    clases: Clase[];
    error?: string;
}

export default function ListonesReportes({ estadisticas, listones_recientes, grupos, clases, error }: PageProps) {
    const [filtros, setFiltros] = useState({
        fecha_desde: '',
        fecha_hasta: '',
        tipo_liston: '',
        id_grupo: 'all',
        id_clase: 'all'
    });

    const breadcrumbs = [
        { title: 'Dashboard', label: 'Dashboard', href: '/dashboard' },
        { title: 'Reportes de Listones', label: 'Reportes de Listones', href: '#' },
    ];

    const construirUrlConFiltros = (baseUrl: string) => {
        const params = new URLSearchParams();

        Object.entries(filtros).forEach(([key, value]) => {
            if (value && value !== '' && value !== 'all') {
                params.append(key, value);
            }
        });

        return `${baseUrl}?${params.toString()}`;
    };

    const handleDownloadExcel = async () => {
        try {
            const url = construirUrlConFiltros('/reportes/excel');
            console.log('Descargando Excel desde:', url);

            // Crear un enlace temporal para la descarga
            const link = document.createElement('a');
            link.href = url;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error al descargar Excel:', error);
            alert('Error al descargar el archivo Excel');
        }
    };

    const handleDownloadPdf = async () => {
        try {
            const url = construirUrlConFiltros('/reportes/pdf');
            console.log('Descargando PDF desde:', url);

            // Crear un enlace temporal para la descarga
            const link = document.createElement('a');
            link.href = url;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error al descargar PDF:', error);
            alert('Error al descargar el archivo PDF');
        }
    };

    const handleFiltroChange = (campo: string, valor: string) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    const limpiarFiltros = () => {
        setFiltros({
            fecha_desde: '',
            fecha_hasta: '',
            tipo_liston: '',
            id_grupo: 'all',
            id_clase: 'all'
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes de Listones" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl font-bold mb-4">Reportes de Listones y Menciones</h1>

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                    <strong>Error:</strong> {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-green-800">Total de Listones</h3>
                                    <p className="text-3xl font-bold text-green-600">{estadisticas.total_listones}</p>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold text-blue-800">Listones Recientes</h3>
                                    <p className="text-3xl font-bold text-blue-600">{listones_recientes.length}</p>
                                </div>
                            </div>

                            {/* Filtros */}
                            <div className="bg-gray-50 p-6 rounded-lg mb-6">
                                <h3 className="text-lg font-semibold mb-4">Filtros de Reporte</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="fecha_desde">Fecha Desde</Label>
                                        <Input
                                            type="date"
                                            id="fecha_desde"
                                            value={filtros.fecha_desde}
                                            onChange={(e) => handleFiltroChange('fecha_desde', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="fecha_hasta">Fecha Hasta</Label>
                                        <Input
                                            type="date"
                                            id="fecha_hasta"
                                            value={filtros.fecha_hasta}
                                            onChange={(e) => handleFiltroChange('fecha_hasta', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="tipo_liston">Tipo de Listón</Label>
                                        <Input
                                            type="text"
                                            id="tipo_liston"
                                            placeholder="Ej: Primer lugar, Segundo lugar..."
                                            value={filtros.tipo_liston}
                                            onChange={(e) => handleFiltroChange('tipo_liston', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="grupo">Grupo</Label>
                                        <Select value={filtros.id_grupo} onValueChange={(value) => handleFiltroChange('id_grupo', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar grupo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todos los grupos</SelectItem>
                                                {grupos.map((grupo) => (
                                                    <SelectItem key={grupo.id_grupo} value={grupo.id_grupo.toString()}>
                                                        {grupo.nom_grupo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="clase">Clase</Label>
                                        <Select value={filtros.id_clase} onValueChange={(value) => handleFiltroChange('id_clase', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar clase" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Todas las clases</SelectItem>
                                                {clases.map((clase) => (
                                                    <SelectItem key={clase.id_clase} value={clase.id_clase.toString()}>
                                                        {clase.nom_clase}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-end">
                                        <Button
                                            onClick={limpiarFiltros}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            🗑️ Limpiar Filtros
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Descargar Reportes */}
                            <div className="bg-white border rounded-lg p-6">
                                <h3 className="text-lg font-semibold mb-4">Generar Reportes</h3>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button
                                        onClick={handleDownloadExcel}
                                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                    >
                                        📊 Descargar Excel
                                    </Button>
                                    <Button
                                        onClick={handleDownloadPdf}
                                        className="bg-red-600 hover:bg-red-700 text-white flex-1"
                                    >
                                        📄 Descargar PDF
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Los reportes se generarán con los filtros seleccionados arriba.
                                </p>
                            </div>

                            <div className="mt-6">
                                <p className="text-gray-600">
                                    Sistema de reportes de listones y menciones. Use los filtros para generar reportes específicos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
