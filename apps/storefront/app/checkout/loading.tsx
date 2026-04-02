import { Skeleton } from "@/components/ui/Skeleton";

export default function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-[#F8F0E5] flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <Skeleton className="h-10 w-48 mx-auto" />

        {/* Order summary card */}
        <div className="rounded-[28px] border border-[#E8D7BF] bg-white/85 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
          <div className="border-t border-[#E8D7BF] pt-4 mt-4 space-y-2">
            <Skeleton className="h-5 w-32 ml-auto" />
            <Skeleton className="h-7 w-40 ml-auto" />
          </div>
        </div>

        {/* Payment section */}
        <div className="rounded-[28px] border border-[#E8D7BF] bg-white/85 p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] space-y-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl mt-4" />
        </div>
      </div>
    </main>
  );
}
