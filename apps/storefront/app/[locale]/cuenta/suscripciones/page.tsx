import { redirect } from "next/navigation";

export default function SuscripcionesRedirect() {
  redirect("/cuenta?tab=suscripciones");
}
