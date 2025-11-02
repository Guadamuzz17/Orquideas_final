import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    Download,
    TrendingUp,
    Users,
    Award,
    Flower2,
    MapPin,
    BarChart3,
    FileSpreadsheet,
    RefreshCw,
    ChevronDown
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EstadisticasData {
    resumen_general: {
        total_participantes: number;
        total_inscripciones: number;
        total_orquideas: number;
        total_ganadores: number;
        participantes_con_orquideas: number;
        promedio_orquideas_por_participante: number;
    };
    participantes: {
        por_tipo: Array<{ tipo: string; total: number }>;
        por_aso: Array<{ aso: string; total: number }>;
        nuevos_vs_recurrentes: Array<{ categoria: string; total: number }>;
    };
    orquideas: {
        clases_mas_comunes: Array<{ clase: string; total: number }>;
        grupos_mas_comunes: Array<{ grupo: string; total: number }>;
        total_especies_diferentes: number;
        nativas_vs_hibridos: Array<{ tipo: string; total: number }>;
    };
    ganadores: {
        por_trofeo: Array<{ trofeo: string; total: number }>;
        por_clase: Array<{ clase: string; total: number }>;
        total_premios_otorgados: number;
    };
    clases_grupos: {
        clases_con_mas_inscripciones: Array<{ clase: string; inscripciones: number }>;
        grupos_con_mas_inscripciones: Array<{ grupo: string; inscripciones: number }>;
    };
    tendencias: {
        participantes: Array<{ evento: string; anho: number; total: number }>;
        inscripciones: Array<{ evento: string; anho: number; total: number }>;
        ganadores: Array<{ evento: string; anho: number; total: number }>;
    };
    top_participantes: Array<{
        id: number;
        nombre: string;
        total_orquideas: number;
        tipo: string;
        aso: string;
    }>;
    distribucion_geografica: {
        por_departamento: Array<{ departamento: string; total: number }>;
        por_municipio: Array<{ municipio: string; total: number }>;
    };
}

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316'];

export default function Estadisticas({ eventoActual }: { eventoActual: number }) {
    const [estadisticas, setEstadisticas] = useState<EstadisticasData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const cargarEstadisticas = async () => {
        try {
            setRefreshing(true);
            const response = await axios.get('/estadisticas/datos', {
                params: { evento_id: eventoActual }
            });
            setEstadisticas(response.data);
            toast.success('Estadísticas actualizadas');
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            toast.error('Error al cargar las estadísticas');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (eventoActual) {
            cargarEstadisticas();
        }
    }, [eventoActual]);

    const handleExportar = async (tipo: string) => {
        try {
            toast.info('Generando archivo CSV...');

            const response = await axios.get('/estadisticas/exportar', {
                params: {
                    evento_id: eventoActual,
                    tipo: tipo
                },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `estadisticas_${tipo}_${new Date().getTime()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            toast.success('Archivo descargado exitosamente');
        } catch (error) {
            console.error('Error exportando:', error);
            toast.error('Error al exportar las estadísticas');
        }
    };

    if (loading || !estadisticas) {
        return (
            <AppLayout breadcrumbs={[{ title: 'Estadísticas', href: '/estadisticas' }]}>
                <Head title="Estadísticas" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Estadísticas', href: '/estadisticas' }
            ]}
        >
            <Head title="Estadísticas" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Header con botones */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Estadísticas del Evento</h2>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cargarEstadisticas}
                                disabled={refreshing}
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Exportar
                                        <ChevronDown className="h-4 w-4 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handleExportar('completo')}>
                                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                                        Estadísticas Completas
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleExportar('participantes')}>
                                        <Users className="h-4 w-4 mr-2" />
                                        Solo Participantes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleExportar('orquideas')}>
                                        <Flower2 className="h-4 w-4 mr-2" />
                                        Solo Orquídeas
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleExportar('ganadores')}>
                                        <Award className="h-4 w-4 mr-2" />
                                        Solo Ganadores
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>                    {/* Resumen General */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    <Users className="h-4 w-4 inline mr-2" />
                                    Participantes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-purple-600">
                                    {estadisticas.resumen_general.total_participantes}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    <Flower2 className="h-4 w-4 inline mr-2" />
                                    Inscripciones
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-pink-600">
                                    {estadisticas.resumen_general.total_inscripciones}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    <Flower2 className="h-4 w-4 inline mr-2" />
                                    Orquídeas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-emerald-600">
                                    {estadisticas.resumen_general.total_orquideas}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    <Award className="h-4 w-4 inline mr-2" />
                                    Ganadores
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-amber-600">
                                    {estadisticas.resumen_general.total_ganadores}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    <BarChart3 className="h-4 w-4 inline mr-2" />
                                    Especies
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {estadisticas.orquideas.total_especies_diferentes}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    <TrendingUp className="h-4 w-4 inline mr-2" />
                                    Promedio
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-indigo-600">
                                    {estadisticas.resumen_general.promedio_orquideas_por_participante}
                                </div>
                                <p className="text-xs text-muted-foreground">orq/participante</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs para diferentes visualizaciones */}
                    <Tabs defaultValue="participantes" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="participantes">Participantes</TabsTrigger>
                            <TabsTrigger value="orquideas">Orquídeas</TabsTrigger>
                            <TabsTrigger value="ganadores">Ganadores</TabsTrigger>
                            <TabsTrigger value="tendencias">Tendencias</TabsTrigger>
                            <TabsTrigger value="geografia">Geografía</TabsTrigger>
                        </TabsList>

                        {/* Tab Participantes */}
                        <TabsContent value="participantes" className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top 20 Participantes (Más Orquídeas)</CardTitle>
                                        <CardDescription>Participantes que trajeron más orquídeas</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={estadisticas.top_participantes.slice(0, 10)} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="nombre" type="category" width={150} />
                                                <Tooltip />
                                                <Bar dataKey="total_orquideas" fill="#8b5cf6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Distribución por Tipo de Participante</CardTitle>
                                        <CardDescription>Clasificación de participantes</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <PieChart>
                                                <Pie
                                                    data={estadisticas.participantes.por_tipo}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={(entry: any) => `${entry.tipo} ${(entry.percent * 100).toFixed(0)}%`}
                                                    outerRadius={120}
                                                    fill="#8884d8"
                                                    dataKey="total"
                                                    nameKey="tipo"
                                                >
                                                    {estadisticas.participantes.por_tipo.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Distribución por ASO</CardTitle>
                                        <CardDescription>Asociaciones participantes</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={estadisticas.participantes.por_aso}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="aso" />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="total" fill="#ec4899" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Nuevos vs Recurrentes</CardTitle>
                                        <CardDescription>Participantes por primera vez vs repetidores</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={estadisticas.participantes.nuevos_vs_recurrentes}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={(entry: any) => `${entry.categoria} ${(entry.percent * 100).toFixed(0)}%`}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="total"
                                                    nameKey="categoria"
                                                >
                                                    {estadisticas.participantes.nuevos_vs_recurrentes.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Tab Orquídeas */}
                        <TabsContent value="orquideas" className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top 10 Clases Más Comunes</CardTitle>
                                        <CardDescription>Clases con más inscripciones</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={estadisticas.orquideas.clases_mas_comunes} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="clase" type="category" width={200} />
                                                <Tooltip />
                                                <Bar dataKey="total" fill="#10b981" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top 10 Grupos Más Comunes</CardTitle>
                                        <CardDescription>Grupos con más inscripciones</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={estadisticas.orquideas.grupos_mas_comunes} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="grupo" type="category" width={200} />
                                                <Tooltip />
                                                <Bar dataKey="total" fill="#3b82f6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Nativas vs Híbridos</CardTitle>
                                        <CardDescription>Distribución de orquídeas por origen</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={estadisticas.orquideas.nativas_vs_hibridos}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={(entry: any) => `${entry.tipo} ${(entry.percent * 100).toFixed(0)}%`}
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="total"
                                                    nameKey="tipo"
                                                >
                                                    <Cell fill="#10b981" />
                                                    <Cell fill="#f59e0b" />
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Clases con Más Inscripciones</CardTitle>
                                        <CardDescription>Top 15 clases</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={estadisticas.clases_grupos.clases_con_mas_inscripciones}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="clase" angle={-45} textAnchor="end" height={100} />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="inscripciones" fill="#8b5cf6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Tab Ganadores */}
                        <TabsContent value="ganadores" className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Distribución por Trofeo</CardTitle>
                                        <CardDescription>Premios otorgados</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <PieChart>
                                                <Pie
                                                    data={estadisticas.ganadores.por_trofeo}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={(entry: any) => `${entry.trofeo} ${(entry.percent * 100).toFixed(0)}%`}
                                                    outerRadius={120}
                                                    fill="#8884d8"
                                                    dataKey="total"
                                                    nameKey="trofeo"
                                                >
                                                    {estadisticas.ganadores.por_trofeo.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Ganadores por Clase</CardTitle>
                                        <CardDescription>Clases ganadoras</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={estadisticas.ganadores.por_clase}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="clase" angle={-45} textAnchor="end" height={100} />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="total" fill="#f59e0b" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* Tab Tendencias */}
                        <TabsContent value="tendencias" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Evolución de Participantes por Evento</CardTitle>
                                    <CardDescription>Tendencia histórica de participación</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={estadisticas.tendencias.participantes}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="anho" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} name="Participantes" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Evolución de Inscripciones por Evento</CardTitle>
                                    <CardDescription>Tendencia histórica de inscripciones</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={estadisticas.tendencias.inscripciones}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="anho" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} name="Inscripciones" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Evolución de Ganadores por Evento</CardTitle>
                                    <CardDescription>Tendencia histórica de premios</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={estadisticas.tendencias.ganadores}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="anho" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} name="Ganadores" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Tab Geografía */}
                        <TabsContent value="geografia" className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Distribución por Departamento</CardTitle>
                                        <CardDescription>Participantes por región</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={estadisticas.distribucion_geografica.por_departamento}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="departamento" angle={-45} textAnchor="end" height={100} />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="total" fill="#3b82f6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Top 15 Municipios</CardTitle>
                                        <CardDescription>Municipios con más participantes</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={estadisticas.distribucion_geografica.por_municipio} layout="vertical">
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" />
                                                <YAxis dataKey="municipio" type="category" width={150} />
                                                <Tooltip />
                                                <Bar dataKey="total" fill="#14b8a6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
