import { useState, useMemo } from "react";
import { Trash2, Plus, Trophy, Search, Filter } from "lucide-react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { showDeleteConfirm } from "@/utils/sweetalert";
import { type BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Trofeos Asignados", href: "/trofeos" },
];

interface TrophyItem {
  id_trofeo: number;
  nombre_orquidea: string;
  nombre_clase: string;
  nombre_grupo: string;
  categoria: string;
  fecha_ganador: string;
}

interface TrofeosIndexProps {
  trofeos?: TrophyItem[];
}

export default function TrofeosIndex({ trofeos = [] }: TrofeosIndexProps) {
  const [filters, setFilters] = useState({
    orquidea: "",
    clase: "",
    grupo: "",
  });

  const filteredTrophies = useMemo(() => {
    return (trofeos || []).filter((trophy) => {
      const matchOrquidea = !filters.orquidea || 
        (trophy.nombre_orquidea || "").toLowerCase().includes(filters.orquidea.toLowerCase());
      const matchClase = !filters.clase || 
        (trophy.nombre_clase || "").toLowerCase().includes(filters.clase.toLowerCase());
      const matchGrupo = !filters.grupo || 
        (trophy.nombre_grupo || "").toLowerCase().includes(filters.grupo.toLowerCase());
      return matchOrquidea && matchClase && matchGrupo;
    });
  }, [filters, trofeos]);

  const handleDelete = (id: number, nombreOrquidea: string) => {
    showDeleteConfirm(`Trofeo de la orquídea "${nombreOrquidea}"`).then((result) => {
      if (result.isConfirmed) {
        router.delete(route("trofeos.destroy", id));
      }
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Trofeos Asignados" />

      <div className="flex flex-1 flex-col gap-5 p-4 md:p-6">
        {/* Header con botón para asignar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <Trophy className="h-7 w-7 text-amber-500" />
              Trofeos Asignados
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Registro y administración de trofeos especiales del evento
            </p>
          </div>

          <Button asChild className="rounded-xl shadow-md w-full sm:w-auto self-start">
            <Link href={route("trofeos.create")}>
              <Plus className="mr-2 h-4 w-4" />
              Asignar Nuevo Trofeo
            </Link>
          </Button>
        </div>

        {/* Filtros de búsqueda */}
        <Card className="rounded-2xl border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <Filter className="h-4 w-4 text-primary" />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filtrar por Orquídea..."
                  value={filters.orquidea}
                  onChange={(e) => setFilters((prev) => ({ ...prev, orquidea: e.target.value }))}
                  className="pl-9 w-full rounded-xl"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filtrar por Clase..."
                  value={filters.clase}
                  onChange={(e) => setFilters((prev) => ({ ...prev, clase: e.target.value }))}
                  className="pl-9 w-full rounded-xl"
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Filtrar por Grupo..."
                  value={filters.grupo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, grupo: e.target.value }))}
                  className="pl-9 w-full rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla Responsiva */}
        <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto touch-scroll">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Orquídea</TableHead>
                    <TableHead>Clase</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrophies.length > 0 ? (
                    filteredTrophies.map((trophy) => (
                      <TableRow key={trophy.id_trofeo} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium text-muted-foreground">
                          #{trophy.id_trofeo}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {trophy.nombre_orquidea}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {trophy.nombre_clase}
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {trophy.nombre_grupo}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium">
                            {trophy.categoria}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                          {trophy.fecha_ganador}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(trophy.id_trofeo, trophy.nombre_orquidea)}
                            className="h-8 w-8 rounded-lg"
                            title="Eliminar trofeo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                        <Trophy className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
                        <p className="font-medium">No se encontraron trofeos asignados.</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {trofeos.length === 0 ? "Aún no se han registrado trofeos en este evento." : "Prueba con otros términos de búsqueda."}
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
