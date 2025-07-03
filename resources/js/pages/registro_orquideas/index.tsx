"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Camera, Home, Flower2, Plus, Minus, Upload, Menu, FileText, Eye } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function OrchidRegistration() {
  const [quantity, setQuantity] = useState(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

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
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700 bg-slate-700">
          <Flower2 className="mr-2 h-4 w-4" />
          Registro de Orquídeas
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-700">
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
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

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg flex items-center gap-2">
                <Flower2 className="h-5 w-5" />
                <span className="font-semibold text-lg">Registrar Orquídea</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                AAA
              </Badge>
              <Badge variant="outline" className="text-sm">
                FACULTAD DE INGENIERÍA
              </Badge>
            </div>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Flower2 className="h-5 w-5" />
                Información de la Orquídea
              </CardTitle>
              <CardDescription>
                Complete todos los campos para registrar una nueva orquídea en el sistema
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Plant Name */}
              <div className="space-y-2">
                <Label htmlFor="plantName" className="text-sm font-medium">
                  Nombre de la Planta *
                </Label>
                <Input id="plantName" placeholder="Ingrese el nombre de la planta" className="h-11" />
              </div>

              {/* Origin and Group Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin" className="text-sm font-medium">
                    Origen *
                  </Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona el Origen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="colombia">Colombia</SelectItem>
                      <SelectItem value="ecuador">Ecuador</SelectItem>
                      <SelectItem value="peru">Perú</SelectItem>
                      <SelectItem value="brasil">Brasil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group" className="text-sm font-medium">
                    Grupo *
                  </Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona un Grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="epifitas">Epífitas</SelectItem>
                      <SelectItem value="terrestres">Terrestres</SelectItem>
                      <SelectItem value="litofitas">Litófitas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Class and Quantity Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class" className="text-sm font-medium">
                    Clase *
                  </Label>
                  <Select>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecciona una Clase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cattleya">Cattleya</SelectItem>
                      <SelectItem value="phalaenopsis">Phalaenopsis</SelectItem>
                      <SelectItem value="dendrobium">Dendrobium</SelectItem>
                      <SelectItem value="oncidium">Oncidium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Cantidad de Orquídeas *</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      className="h-11 w-11"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="h-11 text-center"
                      min="1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      className="h-11 w-11"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Participant */}
              <div className="space-y-2">
                <Label htmlFor="participant" className="text-sm font-medium">
                  Participante *
                </Label>
                <Select>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecciona un Participante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="juan-perez">Juan Pérez</SelectItem>
                    <SelectItem value="maria-garcia">María García</SelectItem>
                    <SelectItem value="carlos-rodriguez">Carlos Rodríguez</SelectItem>
                    <SelectItem value="ana-martinez">Ana Martínez</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Photo Upload */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Foto de la Orquídea</Label>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />

                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="text-green-600 font-medium">Archivo seleccionado: {selectedFile.name}</div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Cambiar archivo
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="text-gray-600">Arrastra una imagen aquí o haz clic para seleccionar</div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Seleccionar archivo
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" className="flex-1">
                    <Camera className="mr-2 h-4 w-4" />
                    Abrir Cámara
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1 h-12 bg-green-600 hover:bg-green-700">
                  <Flower2 className="mr-2 h-4 w-4" />
                  Registrar Orquídea
                </Button>
                <Button type="button" variant="outline" className="h-12">
                  <Home className="mr-2 h-4 w-4" />
                  Inicio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
