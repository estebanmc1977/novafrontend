import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Protege todas las rutas bajo /cuenta a nivel de Server Component.
// auth() corre en Node.js runtime — no tiene las restricciones de Edge Runtime
// que impiden usar clerkMiddleware en el middleware de Next.js.
export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}
