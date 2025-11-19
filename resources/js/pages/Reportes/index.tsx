import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AppLayout from "@/layouts/app-layout"
import { Head, usePage } from "@inertiajs/react"
import { type BreadcrumbItem } from "@/types"

type Evento = { id_evento: number; nombre_evento: string; fecha_inicio?: string; fecha_fin?: string }

export default function ReportesIndex() {
  const [page, setPage] = useState<number>(1)
  const totalPages = 3
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Reportes", href: "/reportes" },
  ]
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [startDate2, setStartDate2] = useState<string>("")
  const [endDate2, setEndDate2] = useState<string>("")
  const [claseFiltro, setClaseFiltro] = useState<string>("todas")
  const [startDate3, setStartDate3] = useState<string>("")
  const [endDate3, setEndDate3] = useState<string>("")

  // Los reportes usarán session('evento_activo') en backend

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reportes" />
      <div className="space-y-6 flex flex-col items-center">
        <div className="flex items-center justify-center w-full">
          <h1 className="text-2xl font-semibold">Reportes</h1>
        </div>

        {/* El evento se toma del backend via session('evento_activo') */}

      {page === 1 && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Listado General</CardTitle>
            <CardDescription>Genera el reporte para el evento seleccionado.</CardDescription>
          </CardHeader>
          <CardFooter>
            {/* //<Button
              onClick={() => {
                const url = `/reportes/inscripciones/pdf`
                window.open(url, "_blank")
              }}
            >
              Generar reporte
            </Button> */}
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => {
                const url = `/reportes/inscripciones/excel`
                window.open(url, "_blank")
              }}
            >
              Exportar Excel
            </Button>
          </CardFooter>
        </Card>
      )}

      {page === 2 && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Plantas por Clases</CardTitle>
            <CardDescription>Filtra por clase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="claseSelect">Clase</Label>
              <Select value={claseFiltro} onValueChange={(v) => setClaseFiltro(v)}>
                <SelectTrigger id="claseSelect">
                  <SelectValue placeholder="Selecciona una clase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las clases</SelectItem>
                  {(usePage().props as any).clases?.filter((c: any) => c && c.id_clase && c.nombre_clase).map((c: any) => (
                    <SelectItem key={c.id_clase} value={String(c.id_clase)}>
                      {`Clase ${c.id_clase}: ${c.nombre_clase}`}
                    </SelectItem>
                  ))}
                  <SelectItem value="37">Clase 37: Maxillarias sudamericanas especie e híbrido</SelectItem>
                  <SelectItem value="38">Clase 38: Maxillaria tipo sudamericana especie e híbrido</SelectItem>
                  <SelectItem value="39">Clase 39: Xilobium y géneros aliados</SelectItem>
                  <SelectItem value="40">Clase 40: Híbridos intergenéricos de la subtribu Maxillariinae</SelectItem>
                  <SelectItem value="41">Clase 41: Ackermania, Bifrenaria y géneros aliados</SelectItem>
                  <SelectItem value="42">Clase 42: Cyrtopodium y géneros aliados</SelectItem>
                  <SelectItem value="43">Clase 43: Catasetum, Clowesia y géneros aliados</SelectItem>
                  <SelectItem value="44">Clase 44: Acineta, Coryanthes y géneros aliados</SelectItem>
                  <SelectItem value="45">Clase 45: Trichocentrum, Conhiella, Lophiaris, etc.</SelectItem>
                  <SelectItem value="46">Clase 46: Oncidium hoja delgada</SelectItem>
                  <SelectItem value="47">Clase 47: Otros géneros: Tolumnia, Cyrtochilum, etc.</SelectItem>
                  <SelectItem value="48">Clase 48: Rhynchostele especie</SelectItem>
                  <SelectItem value="49">Clase 49: Rossioglossum especie</SelectItem>
                  <SelectItem value="50">Clase 50: Cuitlauzina especie</SelectItem>
                  <SelectItem value="51">Clase 51: Brassia especie</SelectItem>
                  <SelectItem value="52">Clase 52: Miltonia y Miltoniopsis especie</SelectItem>
                  <SelectItem value="53">Clase 53: Trichopilia</SelectItem>
                  <SelectItem value="54">Clase 54: Otros géneros aliados a Oncidium</SelectItem>
                  <SelectItem value="55">Clase 55: Híbrido tipo Brassia, Odontoglossum</SelectItem>
                  <SelectItem value="56">Clase 56: Otros híbridos no mencionados</SelectItem>
                  <SelectItem value="57">Clase 57: Phragmipedium, Cypripedium y géneros aliados</SelectItem>
                  <SelectItem value="58">Clase 58: Phragmipedium híbrido</SelectItem>
                  <SelectItem value="59">Clase 59: Paphiopedilum especie</SelectItem>
                  <SelectItem value="60">Clase 60: Paphiopedilum híbrido unifloral</SelectItem>
                  <SelectItem value="61">Clase 61: Paphiopedilum híbrido multifloral</SelectItem>
                  <SelectItem value="62">Clase 62: Paphiopedilum híbrido tipo Complex</SelectItem>
                  <SelectItem value="63">Clase 63: Ascocentrum y Ascocenda especie e híbrido</SelectItem>
                  <SelectItem value="64">Clase 64: Vanda especie</SelectItem>
                  <SelectItem value="65">Clase 65: Vanda híbrido</SelectItem>
                  <SelectItem value="66">Clase 66: Angraecum</SelectItem>
                  <SelectItem value="67">Clase 67: Vandáceas especies o híbridos no mencionados anteriormente</SelectItem>
                  <SelectItem value="68">Clase 68: Phalaenopsis especie</SelectItem>
                  <SelectItem value="69">Clase 69: Phalaenopsis blancas híbrido</SelectItem>
                  <SelectItem value="70">Clase 70: Phalaenopsis otros colores híbridos</SelectItem>
                  <SelectItem value="71">Clase 71: Phalaenopsis tipo miniatura</SelectItem>
                  <SelectItem value="72">Clase 72: Cymbidium y Cymbidella especie</SelectItem>
                  <SelectItem value="73">Clase 73: Cymbidium híbrido</SelectItem>
                  <SelectItem value="74">Clase 74: Grammathophyllum especie y híbrido</SelectItem>
                  <SelectItem value="75">Clase 75: Dendrobium y Oxystophyllum especie</SelectItem>
                  <SelectItem value="76">Clase 76: Dendrobium miniatura especie</SelectItem>
                  <SelectItem value="77">Clase 77: Dendrobium miniatura híbrido</SelectItem>
                  <SelectItem value="78">Clase 78: Dendrobium tipo nobile, phalaenopsis, antílope híbrido</SelectItem>
                  <SelectItem value="79">Clase 79: Bulbophyllum especie e híbrido</SelectItem>
                  <SelectItem value="80">Clase 80: Dendrochilum especie e híbrido</SelectItem>
                  <SelectItem value="81">Clase 81: Coelogyne y géneros aliados especie e híbrido</SelectItem>
                  <SelectItem value="82">Clase 82: Calanthe, Ludisia y géneros similares</SelectItem>
                  <SelectItem value="83">Clase 83: Pleurothallis pansamalae y similares</SelectItem>
                  <SelectItem value="84">Clase 84: Pleurothallis cardiothallis y similares</SelectItem>
                  <SelectItem value="85">Clase 85: Acianthera</SelectItem>
                  <SelectItem value="86">Clase 86: Kraenziniella, Myoxanthus y similares</SelectItem>
                  <SelectItem value="87">Clase 87: Stelis (sensu latu)</SelectItem>
                  <SelectItem value="88">Clase 88: Stelis (sensu stricto)</SelectItem>
                  <SelectItem value="89">Clase 89: Otras Pleurothallidinae con inflorescencia más larga que la hoja</SelectItem>
                  <SelectItem value="90">Clase 90: Platystele</SelectItem>
                  <SelectItem value="91">Clase 91: Lankesteriana</SelectItem>
                  <SelectItem value="92">Clase 92: Lephantes tipo guatemalensis</SelectItem>
                  <SelectItem value="93">Clase 93: Lephantes tipo stenophylla</SelectItem>
                  <SelectItem value="94">Clase 94: Lephantes tipo scopula</SelectItem>
                  <SelectItem value="95">Clase 95: Lepanthopsis</SelectItem>
                  <SelectItem value="96">Clase 96: Trichosalpinx</SelectItem>
                  <SelectItem value="97">Clase 97: Specklinia</SelectItem>
                  <SelectItem value="98">Clase 98: Otras Pleurothallidinae pequeñas</SelectItem>
                  <SelectItem value="99">Clase 99: Restrepia especie e híbrido</SelectItem>
                  <SelectItem value="100">Clase 100: Masdevallia de México y C.A. especie</SelectItem>
                  <SelectItem value="101">Clase 101: Masdevallia tipo sudamericanas especie</SelectItem>
                  <SelectItem value="102">Clase 102: Masdevallias híbrido</SelectItem>
                  <SelectItem value="103">Clase 103: Draculas especies e híbrido</SelectItem>
                  <SelectItem value="104">Clase 104: Dichaea tipo rastrera y similares</SelectItem>
                  <SelectItem value="105">Clase 105: Campylocentrum y otros géneros pequeños</SelectItem>
                  <SelectItem value="106">Clase 106: Cranichideae y géneros aliados</SelectItem>
                  <SelectItem value="107">Clase 107: Habenaria, Triphora y géneros aliados</SelectItem>
                  <SelectItem value="108">Clase 108: Bouquets de novia</SelectItem>
                  <SelectItem value="109">Clase 109: Arreglos tradicionales</SelectItem>
                  <SelectItem value="110">Clase 110: Arreglos modernos/ Línea abstracta</SelectItem>
                  <SelectItem value="111">Clase 111: Flor cortada</SelectItem>
                  <SelectItem value="112">Clase 112: Tema educacional sobre orquídeas</SelectItem>
                  <SelectItem value="113">Clase 113: Tema educacional sobre medio ambiente</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => {
                const url = `/reportes/plantas-por-clases/pdf?from=${encodeURIComponent(startDate2 || "")}&to=${encodeURIComponent(endDate2 || "")}&clase=${encodeURIComponent(claseFiltro || "todas")}`
                window.open(url, "_blank")
              }}
            >
              Generar reporte
            </Button>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => {
                const url = `/reportes/plantas-por-clases/excel?from=${encodeURIComponent(startDate2 || "")}&to=${encodeURIComponent(endDate2 || "")}&clase=${encodeURIComponent(claseFiltro || "todas")}`
                window.open(url, "_blank")
              }}
            >
              Exportar Excel
            </Button>
          </CardFooter>
        </Card>
      )}

      {page === 3 && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Listado de Ganadores</CardTitle>
            <CardDescription>
              Genera un reporte de los ganadores del evento
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              onClick={() => {
                const url = `/reportes/ganadores/pdf?from=${encodeURIComponent(startDate3 || "")}&to=${encodeURIComponent(endDate3 || "")}`
                window.open(url, "_blank")
              }}
            >
              Generar reporte
            </Button>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => {
                const url = `/reportes/ganadores/excel?from=${encodeURIComponent(startDate3 || "")}&to=${encodeURIComponent(endDate3 || "")}`
                window.open(url, "_blank")
              }}
            >
              Exportar Excel
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* {page === 4 && (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Reporte Orquídeas Asignadas y Registradas a cada participante</CardTitle>
            <CardDescription>
              Descarga el formato para el juzgamiento de orquídeas.
            </CardDescription>
          </CardHeader>
          <CardContent />
          <CardFooter>
            <Button
              onClick={() => {
                const url = `/reportes/participantes-orquideas/pdf`
                window.open(url, "_blank")
              }}
            >
              Descargar formato
            </Button>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => {
                const url = `/reportes/participantes-orquideas/excel`
                window.open(url, "_blank")
              }}
            >
              Exportar Excel
            </Button>
          </CardFooter>
        </Card>
      )} */}

      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Anterior
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            onClick={() => setPage(p)}
          >
            {p}
          </Button>
        ))}
        <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          Siguiente
        </Button>
      </div>
      </div>
    </AppLayout>
  )
}
