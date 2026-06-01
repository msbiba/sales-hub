import { requireRole } from "@/lib/auth/role";
import NeuerKundeClient from "./neuer-kunde-client";

export default async function NeuerKundePage() {
  await requireRole(["admin", "bearbeiter"]);
  return <NeuerKundeClient />;
}
