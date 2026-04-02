import { cn } from "@/lib/utils";

export function Table({ className, children }: { className?: string; children: React.ReactNode }) {
  return <table className={cn("w-full text-left text-sm", className)}>{children}</table>;
}

export function TableHead({ className, children }: { className?: string; children: React.ReactNode }) {
  return <th className={cn("px-4 py-3 font-medium text-slate-500", className)}>{children}</th>;
}

export function TableCell({ className, children }: { className?: string; children: React.ReactNode }) {
  return <td className={cn("px-4 py-4 align-top text-slate-700", className)}>{children}</td>;
}

export function TableRow({ className, children }: { className?: string; children: React.ReactNode }) {
  return <tr className={cn("border-t border-slate-100", className)}>{children}</tr>;
}
