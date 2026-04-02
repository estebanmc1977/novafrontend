export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[#E5E7EB] rounded-xl ${className ?? ""}`}
    />
  );
}
