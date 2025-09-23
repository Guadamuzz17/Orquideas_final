"use client"

import { useState, useEffect } from "react"
import { Menu, ChevronDown } from "lucide-react"
import axios from "axios"
import Swal from "sweetalert2"

interface Orchid {
  id_orquidea: number
  nombre_orquidea: string
  clase: {
    nombre_clase: string
  }
  grupo: {
    nombre_grupo: string
  }
  participante?: string
  correlativo?: string
}

export default function Create() {
  const [orchids, setOrchids] = useState<Orchid[]>([])
  const [loading, setLoading] = useState(false)
  const [searchFilters, setSearchFilters] = useState({
    orquidea: "",
    participante: "",
    grupo: "",
    clase: "",
    correlativo: "",
  })
  const [filteredOrchids, setFilteredOrchids] = useState<Orchid[]>([])
  const [selectedOrchid, setSelectedOrchid] = useState<number | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Función para navegar sin usar Next.js router
  const navigateTo = (path: string) => {
    window.location.href = path
  }

  useEffect(() => {
    const fetchOrchids = async () => {
      try {
        setLoading(true)
        const response = await axios.get('http://localhost:3000/api/trofeos/crear') // Ajusta la URL según tu backend
        setOrchids(response.data)
        setFilteredOrchids(response.data)
      } catch (error) {
        console.error('Error fetching orchids:', error)
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar las orquídeas',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrchids()
  }, [])

  useEffect(() => {
    let filtered = orchids

    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((orchid) => {
          switch (key) {
            case "orquidea":
              return orchid.nombre_orquidea.toLowerCase().includes(value.toLowerCase())
            case "participante":
              return orchid.participante?.toLowerCase().includes(value.toLowerCase())
            case "grupo":
              return orchid.grupo.nombre_grupo.toLowerCase().includes(value.toLowerCase())
            case "clase":
              return orchid.clase.nombre_clase.toLowerCase().includes(value.toLowerCase())
            case "correlativo":
              return orchid.correlativo?.toLowerCase().includes(value.toLowerCase())
            default:
              return true
          }
        })
      }
    })

    setFilteredOrchids(filtered)
  }, [searchFilters, orchids])

  const handleFilterChange = (field: string, value: string) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedOrchid) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor selecciona una orquídea antes de asignar el trofeo.',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }

    try {
      setLoading(true)
      await axios.post('http://localhost:3000/api/trofeos', { // Ajusta la URL según tu backend
        id_orquidea: selectedOrchid,
        categoria: 'Ganador Absoluto'
      })
      
      Swal.fire({
        title: 'Éxito',
        text: 'Trofeo asignado correctamente',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        navigateTo('/trofeos')
      })
    } catch (error) {
      console.error('Error assigning trophy:', error)
      Swal.fire({
        title: 'Error',
        text: 'No se pudo asignar el trofeo',
        icon: 'error',
        confirmButtonText: 'OK'
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedOrchidData = orchids.find((o) => o.id_orquidea === selectedOrchid)

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 min-h-screen p-4 ${sidebarOpen ? "block" : "hidden"} md:block`}>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-300">Admin Panel</h2>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => navigateTo('/')}
            className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg p-3 transition-colors w-full text-left"
          >
            <span>🏠</span>
            <span>Inicio</span>
          </button>

          <button className="flex items-center space-x-3 text-white bg-gray-700 rounded-lg p-3 w-full text-left">
            <span>🏆</span>
            <span>Dar Trofeo a orquídea</span>
          </button>

          <button
            onClick={() => navigateTo('/trofeos')}
            className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg p-3 transition-colors w-full text-left"
          >
            <span>📋</span>
            <span>Gestionar Trofeos</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile menu button */}
        <div className="md:hidden bg-white p-4 border-b">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900">
            <Menu size={24} />
          </button>
        </div>

        {/* Header */}
        <div className="bg-blue-500 text-white p-6">
          <h1 className="text-2xl font-bold">Asignar Trofeo al Ganador Absoluto</h1>
        </div>

        {/* Instructions */}
        <div className="bg-white p-6 border-b">
          <p className="text-gray-700">
            <span className="font-semibold">Instrucciones:</span> Escribe el nombre de la orquídea, participante, grupo
            (por ejemplo: <span className="text-pink-500 font-semibold">Grupo A</span>), clase o correlativo para
            filtrar las opciones disponibles.
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Buscar Orquídea"
                value={searchFilters.orquidea}
                onChange={(e) => handleFilterChange("orquidea", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                placeholder="Buscar Participante"
                value={searchFilters.participante}
                onChange={(e) => handleFilterChange("participante", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                placeholder="Buscar Grupo (Ej: Grupo A)"
                value={searchFilters.grupo}
                onChange={(e) => handleFilterChange("grupo", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                placeholder="Buscar Clase"
                value={searchFilters.clase}
                onChange={(e) => handleFilterChange("clase", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                placeholder="Buscar Correlativo"
                value={searchFilters.correlativo}
                onChange={(e) => handleFilterChange("correlativo", e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Orchid Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Orquídea</label>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
                >
                  <span className={selectedOrchidData ? "text-gray-900" : "text-gray-500"}>
                    {selectedOrchidData ? selectedOrchidData.nombre_orquidea : "Seleccione una Orquídea"}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="px-4 py-3 text-gray-500 text-center">Cargando orquídeas...</div>
                    ) : filteredOrchids.length > 0 ? (
                      filteredOrchids.map((orchid) => (
                        <button
                          key={orchid.id_orquidea}
                          type="button"
                          onClick={() => {
                            setSelectedOrchid(orchid.id_orquidea)
                            setDropdownOpen(false)
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{orchid.nombre_orquidea}</div>
                          {orchid.participante && (
                            <div className="text-sm text-gray-600">Participante: {orchid.participante}</div>
                          )}
                          <div className="text-sm text-gray-600">Grupo: {orchid.grupo.nombre_grupo}</div>
                          <div className="text-sm text-gray-600">Clase: {orchid.clase.nombre_clase}</div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No se encontraron orquídeas que coincidan con los filtros
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading || !selectedOrchid}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {loading ? "Asignando..." : "Asignar Trofeo"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}