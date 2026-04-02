import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Clerk's clerkMiddleware cannot run in Next.js Edge Runtime (it references
// Node.js-only modules: #crypto, #safe-node-apis). Route protection is
// handled server-side in each protected layout via auth() from @clerk/nextjs/server,
// which runs in the Node.js runtime and has no Edge constraints.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Excluir archivos estáticos y rutas internas de Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
