import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas que requieren autenticación obligatoria
const isProtectedRoute = createRouteMatcher([
  "/cuenta(.*)",             // Portal de cuenta y suscripciones
  "/checkout",               // El checkout permite guest, pero subs requieren auth
                             // (la lógica fine-grained está en el componente)
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas internas de Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Incluir siempre API routes
    "/(api|trpc)(.*)",
  ],
};
