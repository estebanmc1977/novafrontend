import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Protege todas las rutas bajo /cuenta a nivel de Server Component.
export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");
  } catch (e) {
    // Si auth() falla por config de Clerk, redirigir al sign-in
    // en lugar de mostrar el error boundary
    const isRedirect = e instanceof Error && e.message === "NEXT_REDIRECT";
    if (isRedirect) throw e; // dejar que Next.js procese el redirect
    redirect("/sign-in");
  }

  return <>{children}</>;
}
