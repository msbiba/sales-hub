import { getCurrentUserProfile } from "@/lib/auth/role";
import { redirect } from "next/navigation";
import ProfilClient from "./profil-client";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/login");
  return <ProfilClient profile={profile} />;
}
