import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, DownloadIcon, FileTextIcon, TableIcon, TrendingUpIcon, AwardIcon } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface EstadisticasProps {
    total_listones: number;
    listones_por_tipo: Record<string, number>;
}

interface EstadisticasActualizadas {
    listones_por_tipo: Record<string, number>;
    listones_por_mes: Array<{ periodo: string; total: number }>;
    total_general: number;
}

interface ListonReciente {
    id: number;
    correlativo: string;
    participante: string;
    orquidea: string;
    tipo_liston: string;
    fecha_ganador: string;
}

interface PageProps {
    estadisticas: EstadisticasProps;
    listones_recientes: ListonReciente[];
}

export default function ListonesReportes({ estadisticas, listones_recientes }: PageProps) {
    const [filtros, setFiltros] = useState({
        fecha_desde: '',
        fecha_hasta: '',
        tipo_liston: '',
    });

    const [isExporting, setIsExporting] = useState(false);
    const [estadisticasActualizadas, setEstadisticasActualizadas] = useState<EstadisticasActualizadas | null>(null);

    // Cargar estadísticas actualizadas cuando cambian los filtros
    useEffect(() => {
        if (filtros.fecha_desde || filtros.fecha_hasta) {
            cargarEstadisticas();
        } else {
            setEstadisticasActualizadas(null);
        }
    }, [filtros.fecha_desde, filtros.fecha_hasta]);

    const cargarEstadisticas = async () => {
        try {
            const params = new URLSearchParams();
            if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
            if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);

            const response = await fetch(`/reportes/estadisticas?${params.toString()}`);
            const data = await response.json();
            setEstadisticasActualizadas(data);
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filtros).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            window.location.href = `/reportes/excel?${params.toString()}`;
            toast.success('Descarga de Excel iniciada');
        } catch (error) {
            toast.error('Error al generar reporte Excel');
            console.error('Error:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportPdf = async () => {
        setIsExporting(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filtros).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            window.location.href = `/reportes/pdf?${params.toString()}`;
            toast.success('Descarga de PDF iniciada');
        } catch (error) {
            toast.error('Error al generar reporte PDF');
            console.error('Error:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const resetFilters = () => {
        setFiltros({
            fecha_desde: '',
            fecha_hasta: '',
            tipo_liston: '',
        });
    };

    const estadisticasVisuales = estadisticasActualizadas || estadisticas;
    const tiposListones = Object.keys(estadisticasVisuales.listones_por_tipo || {});

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    };

    const getCurrentMonth = () => {
        const date = new Date();
        return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    };

    const breadcrumbs = [
        { title: 'Dashboard', label: 'Dashboard', href: '/dashboard' },
        { title: 'Reportes de Listones', label: 'Reportes de Listones', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes de Listones" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Estadísticas Generales */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2">
                                    <AwardIcon className="h-8 w-8 text-green-600" />
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">
                                            {estadisticasActualizadas?.total_general ?? estadisticas.total_listones}
                                        </p>
                                        <p className="text-sm text-gray-600">Total Listones</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2">
                                    <TrendingUpIcon className="h-8 w-8 text-blue-600" />
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {Object.keys(estadisticasVisuales.listones_por_tipo || {}).length}
                                        </p>
                                        <p className="text-sm text-gray-600">Tipos Diferentes</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2">
                                    <CalendarIcon className="h-8 w-8 text-purple-600" />
                                    <div>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {listones_recientes.length}
                                        </p>
                                        <p className="text-sm text-gray-600">Recientes</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-2">
                                    <FileTextIcon className="h-8 w-8 text-orange-600" />
                                    <div>
                                        <p className="text-lg font-bold text-orange-600">
                                            {getCurrentMonth()}
                                        </p>
                                        <p className="text-sm text-gray-600">Período Actual</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filtros y Exportación */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <DownloadIcon className="h-5 w-5" />
                                <span>Generar Reportes</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Filtros */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fecha_desde">Fecha Desde</Label>
                                    <Input
                                        id="fecha_desde"
                                        type="date"
                                        value={filtros.fecha_desde}
                                        onChange={(e) => setFiltros({ ...filtros, fecha_desde: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fecha_hasta">Fecha Hasta</Label>
                                    <Input
                                        id="fecha_hasta"
                                        type="date"
                                        value={filtros.fecha_hasta}
                                        onChange={(e) => setFiltros({ ...filtros, fecha_hasta: e.target.value })}
                                        min={filtros.fecha_desde}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tipo_liston">Tipo de Listón</Label>
                                    <Select
                                        value={filtros.tipo_liston}
                                        onValueChange={(value) => setFiltros({ ...filtros, tipo_liston: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Todos los tipos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">Todos los tipos</SelectItem>
                                            {tiposListones.map((tipo) => (
                                                <SelectItem key={tipo} value={tipo}>
                                                    {tipo || 'Sin especificar'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>&nbsp;</Label>
                                    <Button
                                        variant="outline"
                                        onClick={resetFilters}
                                        className="w-full"
                                    >
                                        Limpiar Filtros
                                    </Button>
                                </div>
                            </div>

                            {/* Botones de Exportación */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                                <Button
                                    onClick={handleExportExcel}
                                    disabled={isExporting}
                                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                                >
                                    <TableIcon className="h-4 w-4" />
                                    <span>Exportar a Excel</span>
                                </Button>

                                <Button
                                    onClick={handleExportPdf}
                                    disabled={isExporting}
                                    variant="outline"
                                    className="flex items-center space-x-2 border-red-300 text-red-600 hover:bg-red-50"
                                >
                                    <FileTextIcon className="h-4 w-4" />
                                    <span>Exportar a PDF</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Distribución por Tipo */}
                    {Object.keys(estadisticasVisuales.listones_por_tipo || {}).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribución por Tipo de Listón</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {Object.entries(estadisticasVisuales.listones_por_tipo).map(([tipo, cantidad]) => (
                                        <div
                                            key={tipo}
                                            className="bg-green-50 border border-green-200 rounded-lg p-4 text-center"
                                        >
                                            <h3 className="font-semibold text-green-800 mb-1">
                                                {tipo || 'Sin especificar'}
                                            </h3>
                                            <p className="text-2xl font-bold text-green-600">{cantidad}</p>
                                            <p className="text-sm text-gray-600">
                                                {cantidad === 1 ? 'listón' : 'listones'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Listones Recientes */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Listones Recientes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {listones_recientes.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Correlativo
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Participante
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Orquídea
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tipo Listón
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Fecha
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {listones_recientes.map((liston) => (
                                                <tr key={liston.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {liston.correlativo}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {liston.participante}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {liston.orquidea}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            {liston.tipo_liston || 'Sin especificar'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(liston.fecha_ganador)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No hay listones registrados recientemente
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
