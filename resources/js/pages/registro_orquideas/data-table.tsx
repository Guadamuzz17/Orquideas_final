// "use client"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alertDialog"
// import { Separator } from "@/components/ui/separator"
// import {
//   ArrowLeft,
//   Search,
//   Edit,
//   Trash2,
//   Eye,
//   Filter,
//   Download,
//   Flower2,
//   Calendar,
//   MapPin,
//   User,
//   Hash,
// } from "lucide-react"

// // Tipo para las orquídeas (mismo que en el index)
// export type Orchid = {
//   id: string
//   plantName: string
//   origin: string
//   group: string
//   class: string
//   quantity: number
//   participant: string
//   registrationDate: string
//   status: "active" | "inactive" | "maintenance"
// }

// // Datos de ejemplo (mismos que en el index)
// const orchids: Orchid[] = [
//   {
//     id: "orch_001",
//     plantName: "Cattleya trianae",
//     origin: "Colombia",
//     group: "Epífitas",
//     class: "Cattleya",
//     quantity: 3,
//     participant: "Dr. Juan Pérez",
//     registrationDate: "2024-01-15",
//     status: "active",
//   },
//   {
//     id: "orch_002",
//     plantName: "Phalaenopsis amabilis",
//     origin: "Ecuador",
//     group: "Epífitas",
//     class: "Phalaenopsis",
//     quantity: 1,
//     participant: "María García",
//     registrationDate: "2024-01-20",
//     status: "active",
//   },
//   {
//     id: "orch_003",
//     plantName: "Dendrobium nobile",
//     origin: "Perú",
//     group: "Epífitas",
//     class: "Dendrobium",
//     quantity: 2,
//     participant: "Prof. Carlos Rodríguez",
//     registrationDate: "2024-02-01",
//     status: "maintenance",
//   },
//   {
//     id: "orch_004",
//     plantName: "Oncidium sphacelatum",
//     origin: "Brasil",
//     group: "Epífitas",
//     class: "Oncidium",
//     quantity: 4,
//     participant: "Dra. Ana Martínez",
//     registrationDate: "2024-02-10",
//     status: "active",
//   },
//   {
//     id: "orch_005",
//     plantName: "Vanda coerulea",
//     origin: "Venezuela",
//     group: "Epífitas",
//     class: "Vanda",
//     quantity: 1,
//     participant: "Luis Torres",
//     registrationDate: "2024-02-15",
//     status: "inactive",
//   },
//   {
//     id: "orch_006",
//     plantName: "Cymbidium eburneum",
//     origin: "Costa Rica",
//     group: "Terrestres",
//     class: "Cymbidium",
//     quantity: 2,
//     participant: "Dr. Juan Pérez",
//     registrationDate: "2024-03-01",
//     status: "active",
//   },
//   {
//     id: "orch_007",
//     plantName: "Cattleya warscewiczii",
//     origin: "Colombia",
//     group: "Epífitas",
//     class: "Cattleya",
//     quantity: 1,
//     participant: "María García",
//     registrationDate: "2024-03-05",
//     status: "active",
//   },
//   {
//     id: "orch_008",
//     plantName: "Phalaenopsis schilleriana",
//     origin: "Ecuador",
//     group: "Epífitas",
//     class: "Phalaenopsis",
//     quantity: 3,
//     participant: "Prof. Carlos Rodríguez",
//     registrationDate: "2024-03-10",
//     status: "maintenance",
//   },
// ]

// // Componente para ver detalles de una orquídea
// function OrchidDetailsModal({
//   orchid,
//   open,
//   onOpenChange,
// }: { orchid: Orchid; open: boolean; onOpenChange: (open: boolean) => void }) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 text-xl">
//             <div className="p-2 bg-emerald-100 rounded-lg">
//               <Flower2 className="h-5 w-5 text-emerald-600" />
//             </div>
//             Detalles de la Orquídea
//           </DialogTitle>
//           <DialogDescription>Información completa del registro seleccionado</DialogDescription>
//         </DialogHeader>
//         <div className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <Hash className="h-4 w-4 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">ID</p>
//                   <p className="font-mono text-sm">{orchid.id}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Flower2 className="h-4 w-4 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Nombre de la Planta</p>
//                   <p className="font-semibold">{orchid.plantName}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <MapPin className="h-4 w-4 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Origen</p>
//                   <p>{orchid.origin}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="h-4 w-4 text-muted-foreground">🌿</div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Grupo</p>
//                   <p>{orchid.group}</p>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <div className="h-4 w-4 text-muted-foreground">🌺</div>
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Clase</p>
//                   <p>{orchid.class}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Hash className="h-4 w-4 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Cantidad</p>
//                   <p className="font-semibold">{orchid.quantity}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <User className="h-4 w-4 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Participante</p>
//                   <p>{orchid.participant}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Calendar className="h-4 w-4 text-muted-foreground" />
//                 <div>
//                   <p className="text-sm font-medium text-muted-foreground">Fecha de Registro</p>
//                   <p>{new Date(orchid.registrationDate).toLocaleDateString("es-ES")}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <Separator />
//           <div className="flex items-center gap-3">
//             <div className="h-4 w-4 text-muted-foreground">📊</div>
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Estado</p>
//               <Badge
//                 variant={
//                   orchid.status === "active" ? "default" : orchid.status === "maintenance" ? "secondary" : "destructive"
//                 }
//               >
//                 {orchid.status === "active" ? "Activa" : orchid.status === "maintenance" ? "Mantenimiento" : "Inactiva"}
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// // Componente para editar una orquídea
// function EditOrchidModal({
//   orchid,
//   open,
//   onOpenChange,
//   onSave,
// }: { orchid: Orchid; open: boolean; onOpenChange: (open: boolean) => void; onSave: (orchid: Orchid) => void }) {
//   const [formData, setFormData] = useState(orchid)

//   const handleSave = () => {
//     onSave(formData)
//     onOpenChange(false)
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 text-xl">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <Edit className="h-5 w-5 text-blue-600" />
//             </div>
//             Editar Orquídea
//           </DialogTitle>
//           <DialogDescription>Modifica la información de la orquídea seleccionada</DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4 max-h-[60vh] overflow-y-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Nombre de la Planta</Label>
//               <Input
//                 value={formData.plantName}
//                 onChange={(e) => setFormData({ ...formData, plantName: e.target.value })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Origen</Label>
//               <Select value={formData.origin} onValueChange={(value) => setFormData({ ...formData, origin: value })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Colombia">🇨🇴 Colombia</SelectItem>
//                   <SelectItem value="Ecuador">🇪🇨 Ecuador</SelectItem>
//                   <SelectItem value="Perú">🇵🇪 Perú</SelectItem>
//                   <SelectItem value="Brasil">🇧🇷 Brasil</SelectItem>
//                   <SelectItem value="Venezuela">🇻🇪 Venezuela</SelectItem>
//                   <SelectItem value="Costa Rica">🇨🇷 Costa Rica</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Grupo</Label>
//               <Select value={formData.group} onValueChange={(value) => setFormData({ ...formData, group: value })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Epífitas">🌿 Epífitas</SelectItem>
//                   <SelectItem value="Terrestres">🌱 Terrestres</SelectItem>
//                   <SelectItem value="Litófitas">🪨 Litófitas</SelectItem>
//                   <SelectItem value="Saprófitas">🍄 Saprófitas</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Clase</Label>
//               <Select value={formData.class} onValueChange={(value) => setFormData({ ...formData, class: value })}>
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Cattleya">🌺 Cattleya</SelectItem>
//                   <SelectItem value="Phalaenopsis">🦋 Phalaenopsis</SelectItem>
//                   <SelectItem value="Dendrobium">🌸 Dendrobium</SelectItem>
//                   <SelectItem value="Oncidium">💛 Oncidium</SelectItem>
//                   <SelectItem value="Vanda">💜 Vanda</SelectItem>
//                   <SelectItem value="Cymbidium">🌼 Cymbidium</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Cantidad</Label>
//               <Input
//                 type="number"
//                 min="1"
//                 value={formData.quantity}
//                 onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 1 })}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>Estado</Label>
//               <Select
//                 value={formData.status}
//                 onValueChange={(value: "active" | "inactive" | "maintenance") =>
//                   setFormData({ ...formData, status: value })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="active">✅ Activa</SelectItem>
//                   <SelectItem value="maintenance">🔧 Mantenimiento</SelectItem>
//                   <SelectItem value="inactive">❌ Inactiva</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <Label>Participante</Label>
//             <Select
//               value={formData.participant}
//               onValueChange={(value) => setFormData({ ...formData, participant: value })}
//             >
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Dr. Juan Pérez">👨‍🔬 Dr. Juan Pérez</SelectItem>
//                 <SelectItem value="María García">👩‍🎓 María García</SelectItem>
//                 <SelectItem value="Prof. Carlos Rodríguez">👨‍🏫 Prof. Carlos Rodríguez</SelectItem>
//                 <SelectItem value="Dra. Ana Martínez">👩‍🔬 Dra. Ana Martínez</SelectItem>
//                 <SelectItem value="Luis Torres">👨‍🎓 Luis Torres</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <div className="flex gap-3 pt-4">
//           <Button onClick={handleSave} className="flex-1">
//             Guardar Cambios
//           </Button>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancelar
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

// export default function OrchidDataTable({ onGoBack }: { onGoBack?: () => void }) {
//   const [data, setData] = useState<Orchid[]>(orchids)
//   const [searchTerm, setSearchTerm] = useState("")
//   const [statusFilter, setStatusFilter] = useState<string>("all")
//   const [originFilter, setOriginFilter] = useState<string>("all")
//   const [currentPage, setCurrentPage] = useState(1)
//   const [selectedOrchid, setSelectedOrchid] = useState<Orchid | null>(null)
//   const [detailsOpen, setDetailsOpen] = useState(false)
//   const [editOpen, setEditOpen] = useState(false)
//   const itemsPerPage = 8

//   const handleGoBack = () => {
//     if (onGoBack) {
//       onGoBack()
//     } else {
//       console.log("Navegando de vuelta al dashboard...")
//       // window.history.back() // fallback si no se pasa la función
//     }
//   }

//   const filteredData = data.filter((orchid) => {
//     const matchesSearch =
//       orchid.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       orchid.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       orchid.participant.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesStatus = statusFilter === "all" || orchid.status === statusFilter
//     const matchesOrigin = originFilter === "all" || orchid.origin === originFilter

//     return matchesSearch && matchesStatus && matchesOrigin
//   })

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage)
//   const startIndex = (currentPage - 1) * itemsPerPage
//   const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

//   const getStatusBadge = (status: string) => {
//     const variants = {
//       active: "bg-green-100 text-green-800",
//       maintenance: "bg-yellow-100 text-yellow-800",
//       inactive: "bg-red-100 text-red-800",
//     }
//     const labels = {
//       active: "Activa",
//       maintenance: "Mantenimiento",
//       inactive: "Inactiva",
//     }
//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[status as keyof typeof variants]}`}>
//         {labels[status as keyof typeof labels]}
//       </span>
//     )
//   }

//   const handleView = (orchid: Orchid) => {
//     setSelectedOrchid(orchid)
//     setDetailsOpen(true)
//   }

//   const handleEdit = (orchid: Orchid) => {
//     setSelectedOrchid(orchid)
//     setEditOpen(true)
//   }

//   const handleSave = (updatedOrchid: Orchid) => {
//     setData((prev) => prev.map((item) => (item.id === updatedOrchid.id ? updatedOrchid : item)))
//     alert("Orquídea actualizada exitosamente")
//   }

//   const handleDelete = (orchid: Orchid) => {
//     setData((prev) => prev.filter((item) => item.id !== orchid.id))
//     alert(`Orquídea ${orchid.plantName} eliminada exitosamente`)
//   }

//   const handleExport = () => {
//     const csvContent = [
//       ["ID", "Nombre", "Origen", "Grupo", "Clase", "Cantidad", "Participante", "Fecha", "Estado"],
//       ...filteredData.map((orchid) => [
//         orchid.id,
//         orchid.plantName,
//         orchid.origin,
//         orchid.group,
//         orchid.class,
//         orchid.quantity.toString(),
//         orchid.participant,
//         orchid.registrationDate,
//         orchid.status,
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n")

//     const blob = new Blob([csvContent], { type: "text/csv" })
//     const url = window.URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "orquideas.csv"
//     a.click()
//     window.URL.revokeObjectURL(url)
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-6">
//           <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
//             <Eye className="h-5 w-5" />
//             <span className="font-bold text-lg">Catálogo de Orquídeas</span>
//           </div>
//         </div>

//         {/* Filters and Search */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Filter className="h-5 w-5" />
//               Filtros y Búsqueda
//             </CardTitle>
//             <CardDescription>Utiliza los filtros para encontrar orquídeas específicas</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <div className="space-y-2">
//                 <Label>Buscar</Label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Nombre, origen, participante..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label>Estado</Label>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos los estados</SelectItem>
//                     <SelectItem value="active">✅ Activa</SelectItem>
//                     <SelectItem value="maintenance">🔧 Mantenimiento</SelectItem>
//                     <SelectItem value="inactive">❌ Inactiva</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Origen</Label>
//                 <Select value={originFilter} onValueChange={setOriginFilter}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Todos los orígenes</SelectItem>
//                     <SelectItem value="Colombia">🇨🇴 Colombia</SelectItem>
//                     <SelectItem value="Ecuador">🇪🇨 Ecuador</SelectItem>
//                     <SelectItem value="Perú">🇵🇪 Perú</SelectItem>
//                     <SelectItem value="Brasil">🇧🇷 Brasil</SelectItem>
//                     <SelectItem value="Venezuela">🇻🇪 Venezuela</SelectItem>
//                     <SelectItem value="Costa Rica">🇨🇷 Costa Rica</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Acciones</Label>
//                 <Button onClick={handleExport} variant="outline" className="w-full">
//                   <Download className="mr-2 h-4 w-4" />
//                   Exportar CSV
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Results Summary */}
//         <div className="flex items-center justify-between mb-4">
//           <div className="text-sm text-muted-foreground">
//             Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de{" "}
//             {filteredData.length} orquídea(s)
//           </div>
//           <div className="text-sm text-muted-foreground">Total en sistema: {data.length}</div>
//         </div>

//         {/* Data Table */}
//         <Card>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     ID
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Nombre
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Origen
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Grupo
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Clase
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Cantidad
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Participante
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Estado
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
//                     Acciones
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-slate-200">
//                 {paginatedData.map((orchid) => (
//                   <tr key={orchid.id} className="hover:bg-slate-50 transition-colors">
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-slate-900">{orchid.id}</td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
//                       {orchid.plantName}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{orchid.origin}</td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{orchid.group}</td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{orchid.class}</td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 text-center font-semibold">
//                       {orchid.quantity}
//                     </td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500">{orchid.participant}</td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm">{getStatusBadge(orchid.status)}</td>
//                     <td className="px-4 py-4 whitespace-nowrap text-sm">
//                       <div className="flex items-center gap-2">
//                         <Button size="sm" variant="outline" onClick={() => handleView(orchid)}>
//                           <Eye className="h-3 w-3" />
//                         </Button>
//                         <Button size="sm" variant="outline" onClick={() => handleEdit(orchid)}>
//                           <Edit className="h-3 w-3" />
//                         </Button>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
//                               <Trash2 className="h-3 w-3" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 Esta acción no se puede deshacer. Se eliminará permanentemente la orquídea "
//                                 {orchid.plantName}" del sistema.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancelar</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDelete(orchid)}
//                                 className="bg-red-600 hover:bg-red-700"
//                               >
//                                 Eliminar
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between mt-6">
//             <div className="text-sm text-muted-foreground">
//               Página {currentPage} de {totalPages}
//             </div>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//               >
//                 Anterior
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                 disabled={currentPage === totalPages}
//               >
//                 Siguiente
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* Modals */}
//         {selectedOrchid && (
//           <>
//             <OrchidDetailsModal orchid={selectedOrchid} open={detailsOpen} onOpenChange={setDetailsOpen} />
//             <EditOrchidModal orchid={selectedOrchid} open={editOpen} onOpenChange={setEditOpen} onSave={handleSave} />
//           </>
//         )}
//       </div>
//     </div>
//   )
// }
