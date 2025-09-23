import { useState, useEffect } from "react";
import { Trash2, Plus, Menu } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

interface Trophy {
  id_trofeo: number;
  nombre_orquidea: string;
  nombre_clase: string;
  nombre_grupo: string;
  categoria: string;
  fecha_ganador: string;
}

export default function TrofeosIndex() {
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    orquidea: "",
    clase: "",
    grupo: "",
  });
  const [filteredTrophies, setFilteredTrophies] = useState<Trophy[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchTrophies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/trofeos'); // Ajusta la URL según tu backend
        setTrophies(response.data);
        setFilteredTrophies(response.data);
      } catch (error) {
        console.error('Error fetching trophies:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los trofeos',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrophies();
  }, []);

  useEffect(() => {
    let filtered = trophies;

    if (filters.orquidea) {
      filtered = filtered.filter((trophy) => 
        trophy.nombre_orquidea.toLowerCase().includes(filters.orquidea.toLowerCase())
      );
    }

    if (filters.clase) {
      filtered = filtered.filter((trophy) => 
        trophy.nombre_clase.toLowerCase().includes(filters.clase.toLowerCase())
      );
    }

    if (filters.grupo) {
      filtered = filtered.filter((trophy) => 
        trophy.nombre_grupo.toLowerCase().includes(filters.grupo.toLowerCase())
      );
    }

    setFilteredTrophies(filtered);
  }, [filters, trophies]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/trofeos/${id}`); // Ajusta la URL según tu backend
        setTrophies(trophies.filter(trophy => trophy.id_trofeo !== id));
        Swal.fire(
          '¡Eliminado!',
          'El trofeo ha sido eliminado.',
          'success'
        );
      } catch (error) {
        console.error('Error deleting trophy:', error);
        Swal.fire(
          'Error',
          'No se pudo eliminar el trofeo',
          'error'
        );
      }
    }
  };

  const navigateToCreate = () => {
    window.location.href = '/trofeos/create'; // O usa react-router si lo tienes configurado
  };

  const navigateToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 min-h-screen p-4 ${sidebarOpen ? "block" : "hidden"} md:block`}>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-300">Admin Panel</h2>
        </div>

        <nav className="space-y-2">
          <button
            onClick={navigateToHome}
            className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg p-3 transition-colors w-full text-left"
          >
            <span>🏠</span>
            <span>Inicio</span>
          </button>

          <button
            onClick={navigateToCreate}
            className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg p-3 transition-colors w-full text-left"
          >
            <span>🏆</span>
            <span>Dar Trofeo a orquídea</span>
          </button>

          <button className="flex items-center space-x-3 text-white bg-gray-700 rounded-lg p-3 w-full text-left">
            <span>📋</span>
            <span>Gestionar Trofeos</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Mobile menu button */}
        <div className="md:hidden bg-white p-4 border-b">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Header */}
        <div className="bg-green-400 text-white p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Trofeos Asignados</h1>
            <button
              onClick={navigateToCreate}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Asignar Nuevo Trofeo</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Filtrar por Orquídea"
              value={filters.orquidea}
              onChange={(e) => handleFilterChange("orquidea", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Filtrar por Clase"
              value={filters.clase}
              onChange={(e) => handleFilterChange("clase", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Filtrar por Grupo"
              value={filters.grupo}
              onChange={(e) => handleFilterChange("grupo", e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando trofeos...</div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-green-400 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">ID Trofeo</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Orquídea</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Clase</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Grupo</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Categoría</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Fecha de Asignación</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTrophies.map((trophy, index) => (
                      <tr key={trophy.id_trofeo} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trophy.id_trofeo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trophy.nombre_orquidea}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">{trophy.nombre_clase}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">{trophy.nombre_grupo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trophy.categoria}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{trophy.fecha_ganador}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleDelete(trophy.id_trofeo)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                            title="Eliminar trofeo"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTrophies.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron trofeos que coincidan con los filtros aplicados.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}