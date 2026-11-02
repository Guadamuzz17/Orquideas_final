import { useState, useMemo } from "react";
import { ArrowLeft, Trophy, Search, Check, Save } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Trofeos Asignados", href: "/trofeos" },
  { title: "Asignar Trofeo", href: "/trofeos/create" },
];

interface OrchidItem {
  id_orquidea: number;
  nombre_orquidea: string;
  clase: string;
  grupo: string;
}

interface CreateProps {
  orquideas?: OrchidItem[];
}

const CATEGORIAS_TROFEO = [
  "Mejor de la Exposición",
  "Mejor Especie Nacional",
  "Mejor Híbrido",
  "Mejor Orquídea Miniatura",
  "Mejor Cultivo",
  "Trofeo Especial del Jurado",
  "Primer Lugar General",
];

export default function Create({ orquideas = [] }: CreateProps) {
  const [search, setSearch] = useState("");
  const [selectedOrchid, setSelectedOrchid] = useState<OrchidItem | null>(null);

  const { data, setData, post, processing, errors } = useForm({
    id_orquidea: "",
    categoria: "",
  });

  const filteredOrchids = useMemo(() => {
    if (!search.trim()) return orquideas.slice(0, 15);
    const q = search.toLowerCase();
    return orquideas.filter(
      (o) =>
        (o.nombre_orquidea || "").toLowerCase().includes(q) ||
        (o.clase || "").toLowerCase().includes(q) ||
        (o.grupo || "").toLowerCase().includes(q)
    ).slice(0, 30);
  }, [search, orquideas]);

  const handleSelect = (orchid: OrchidItem) => {
    setSelectedOrchid(orchid);
    setData("id_orquidea", String(orchid.id_orquidea));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("trofeos.store"));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Asignar Nuevo Trofeo" />

      <div className="flex flex-1 flex-col gap-5 p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon" className="rounded-xl">
            <Link href={route("trofeos.index")}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
              <Trophy className="h-7 w-7 text-amber-500" />
              Asignar Trofeo a Orquídea
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Seleccione una orquídea inscrita y la distinción o trofeo otorgado
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Paso 1: Selección de orquídea */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                Buscar y Seleccionar Orquídea
              </CardTitle>
              <CardDescription>
                Filtra por nombre de planta, clase o grupo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre de orquídea..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>

              {selectedOrchid && (
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-primary">Orquídea Seleccionada:</p>
                    <p className="font-semibold text-foreground">{selectedOrchid.nombre_orquidea}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{selectedOrchid.clase} • {selectedOrchid.grupo}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground font-normal">
                    Seleccionada
                  </Badge>
                </div>
              )}

              {errors.id_orquidea && (
                <p className="text-xs text-destructive font-medium">{errors.id_orquidea}</p>
              )}

              <div className="max-h-56 overflow-y-auto rounded-xl border border-border divide-y divide-border touch-scroll">
                {filteredOrchids.length > 0 ? (
                  filteredOrchids.map((orchid) => (
                    <button
                      key={orchid.id_orquidea}
                      type="button"
                      onClick={() => handleSelect(orchid)}
                      className={`w-full text-left p-3 flex items-center justify-between hover:bg-accent hover:text-accent-foreground transition-colors ${
                        selectedOrchid?.id_orquidea === orchid.id_orquidea ? "bg-accent/80 font-medium" : ""
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-sm font-medium text-foreground truncate">{orchid.nombre_orquidea}</p>
                        <p className="text-xs text-muted-foreground truncate">{orchid.clase} • {orchid.grupo}</p>
                      </div>
                      {selectedOrchid?.id_orquidea === orchid.id_orquidea && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No se encontraron orquídeas con ese término.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Paso 2: Categoría o Nombre del Trofeo */}
          <Card className="rounded-2xl border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                Categoría del Trofeo
              </CardTitle>
              <CardDescription>
                Elige una categoría sugerida o escribe una personalizada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS_TROFEO.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setData("categoria", cat)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      data.categoria === cat
                        ? "bg-primary text-primary-foreground border-primary font-medium shadow-sm"
                        : "bg-muted/50 border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="categoria">Nombre / Categoría del Trofeo</Label>
                <Input
                  id="categoria"
                  type="text"
                  placeholder="Ej: Mejor Especie Nacional"
                  value={data.categoria}
                  onChange={(e) => setData("categoria", e.target.value)}
                  className="rounded-xl"
                  required
                />
                {errors.categoria && (
                  <p className="text-xs text-destructive font-medium">{errors.categoria}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-2">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href={route("trofeos.index")}>Cancelar</Link>
            </Button>
            <Button
              type="submit"
              disabled={processing || !data.id_orquidea || !data.categoria}
              className="rounded-xl shadow-md min-w-[140px]"
            >
              <Save className="mr-2 h-4 w-4" />
              {processing ? "Guardando..." : "Asignar Trofeo"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
