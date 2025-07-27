"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Eye, Edit, Trash2, Flower2, Menu, Home, FileText } from "lucide-react"

interface Orquidea {
  id: number
  correlativo: string
  participante: string
  grupo_codigo: string
  clase: string
  grupo_nombre: string
}

const mockOrquideas: Orquidea[] = [
  { id: 1, correlativo: "001", participante: "Juan Lopez", grupo_codigo: "A", clase: "Clase 1", grupo_nombre: "Grupo A" },
  { id: 2, correlativo: "002", participante: "Maria Perez", grupo_codigo: "D", clase: "Clase 2", grupo_nombre: "Grupo D" },
  { id: 3, correlativo: "003", participante: "Carlos Ruiz", grupo_codigo: "E", clase: "Clase 3", grupo_nombre: "Grupo E" },
]

export default function OrchidList() {
  const [search, setSearch] = useState("")
  const [grupo, setGrupo] = useState("")

  const filtered = mockOrquideas
    .filter(o => (grupo === "" || o.grupo_codigo === grupo))
    .filter(o => o.participante.toLowerCase().includes(search.toLowerCase()))

  const Sidebar = () => (
    <div className="w-64 bg-slate-800 text-white h-screen p-4 space-y-2">
      <div className="flex items-center gap-2 mb-8">
        <Flower2 className="h-6 w-6 text-green-400" />
        <span className="font-semibold">OrchidApp</span>
      </div>

      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700">
          <Home className="mr-2 h-4 w-4" />
          Inicio
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700">
          <Flower2 className="mr-2 h-4 w-4" />
          Registro de Orquídeas
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700 bg-slate-700">
          <Eye className="mr-2 h-4 w-4" />
          Ver Orquídeas
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700">
          <FileText className="mr-2 h-4 w-4" />
          Abrir PDF
        </Button>
      </nav>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold flex items-center gap-2">
              <Flower2 className="h-5 w-5 text-green-600" />
              <span>{filtered.length} Orquídeas</span>
            </div>
            <Button>
              Agregar Nuevo Registro
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Listado de Orquídeas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="sm:max-w-xs"
                />
                <Select value={grupo} onValueChange={setGrupo}>
                  <SelectTrigger className="sm:max-w-xs">
                    <SelectValue placeholder="Todos los grupos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="A">Grupo A</SelectItem>
                    <SelectItem value="D">Grupo D</SelectItem>
                    <SelectItem value="E">Grupo E</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-2 border">ID</th>
                      <th className="px-2 py-2 border">Correlativo</th>
                      <th className="px-2 py-2 border">Participante</th>
                      <th className="px-2 py-2 border">Código Grupo</th>
                      <th className="px-2 py-2 border">Clase</th>
                      <th className="px-2 py-2 border">Nombre Grupo</th>
                      <th className="px-2 py-2 border text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((o) => (
                      <tr key={o.id} className="border-t text-center">
                        <td className="px-2 py-2 border">{o.id}</td>
                        <td className="px-2 py-2 border">{o.correlativo}</td>
                        <td className="px-2 py-2 border">{o.participante}</td>
                        <td className="px-2 py-2 border">{o.grupo_codigo}</td>
                        <td className="px-2 py-2 border">{o.clase}</td>
                        <td className="px-2 py-2 border">{o.grupo_nombre}</td>
                        <td className="px-2 py-2 border">
                          <div className="flex justify-center gap-2">
                            <Button size="icon" variant="outline"><Eye size={16} /></Button>
                            <Button size="icon" variant="secondary"><Edit size={16} /></Button>
                            <Button size="icon" variant="destructive"><Trash2 size={16} /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

