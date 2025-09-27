'use client'; 

import { useState, useEffect } from 'react';

// Interfaz para los datos del paquete
interface PaqueteData {
  id: number;
  descripcion: string;
  estado: string;
  usuario: string;
}

// Helper para el color del estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'EN_ESPERA': return 'bg-yellow-200 text-yellow-800';
    case 'RECOGIDO': return 'bg-green-200 text-green-800';
    case 'NO_RECOGIDO': return 'bg-red-200 text-red-800';
    case 'EN_TRANSITO': return 'bg-blue-200 text-blue-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};

export default function PaquetesList() {
  const [paquetes, setPaquetes] = useState<PaqueteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        // ✅ URL completa y correcta, usando la variable de entorno
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        
        const response = await fetch(`${apiUrl}/paquetes`);

        if (!response.ok) {
          // Intenta leer el error como JSON, si falla, muestra el texto
          try {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error del servidor');
          } catch (jsonError) {
            throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
          }
        }

        const result = await response.json();
        setPaquetes(result.data);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaquetes();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Cargando paquetes...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Usuario</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {paquetes.length > 0 ? (
            paquetes.map((paquete) => (
              <tr key={paquete.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{paquete.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{paquete.usuario}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(paquete.estado)}`}>
                    {paquete.estado.replace('_', ' ')}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No se encontraron paquetes.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}