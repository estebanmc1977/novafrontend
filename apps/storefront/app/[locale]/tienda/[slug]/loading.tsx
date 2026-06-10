// apps/storefront/app/[locale]/tienda/loading.tsx
import Image from "next/image";

export default function TiendaLoading() {
  return (
    <main className="min-h-screen bg-[#F8F7F4] px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        
        {/* Logo + Título */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logos/logo.webp"        // ← Ajusta si tu logo está en otra ruta
              alt="Novapatch"
              width={180}
              height={48}
              className="opacity-90"
            />
          </div>
          <div className="h-8 w-64 mx-auto bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-5 w-96 mx-auto mt-3 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[28px] overflow-hidden border border-[#E8D7BF] shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
            >
              <div className="h-48 w-full bg-gray-200 animate-pulse" />
              <div className="p-6 flex flex-col gap-3">
                <div className="h-6 w-32 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-4 w-36 bg-gray-200 rounded-xl animate-pulse" />
                
                <div className="flex gap-2 mt-2">
                  <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
                </div>
                
                <div className="h-8 w-28 mt-3 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-12 w-full rounded-xl bg-gray-200 animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}