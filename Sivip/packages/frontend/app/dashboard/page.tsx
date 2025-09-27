import PaquetesList from "@/components/dashboard/PaquetesList";
import { Suspense } from "react";

// Este es un Server Component por defecto en Next.js
export default function DashboardPage() {
  return (
    // Contenedor principal con algo de padding
    <main className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* Encabezado de la página */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Aquí puedes ver un resumen de la actividad reciente.
        </p>
      </div>

      {/* Sección de la lista de paquetes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Estado de Paquetes
        </h2>
        
        {/* Aquí insertamos nuestro componente cliente */}
        {/* Suspense muestra un fallback mientras el componente cliente carga */}
        <Suspense fallback={<p>Cargando lista de paquetes...</p>}>
          <PaquetesList />
        </Suspense>
      </div>

    </main>
  );
}