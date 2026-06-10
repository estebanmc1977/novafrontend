export default async function ProductDetailLoading() {   // ← fijate que sea async
  // Delay para poder ver el loading
  await new Promise(resolve => setTimeout(resolve, 3000));

  return (
    <main className="min-h-screen bg-[#F8F7F4] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Galería skeleton */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-xl">
              <div className="w-full h-full bg-gray-200 animate-pulse" />
            </div>
            <div className="flex gap-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-20 h-24 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>

          {/* Info skeleton */}
          <div className="pt-6 space-y-8">
            <div className="space-y-3">
              <div className="h-12 w-48 bg-gray-200 rounded-xl animate-pulse" />
              <div className="h-8 w-80 bg-gray-200 rounded-xl animate-pulse" />
            </div>
            
            <div className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-28 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>

            <div className="h-14 w-full bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Delay artificial - solo para probar */}
      <div className="fixed bottom-6 right-6 bg-black text-white text-xs px-4 py-2 rounded-full">
        Loading PDP (3 segundos de delay)
      </div>
    </main>
  );
}