import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Admin-Client mit Service-Role-Key.
 * NIEMALS in Client-Components importieren.
 * NIEMALS im Browser ausfuehren.
 * Nur fuer privilegierte Server-Operationen (User-Management, Invite).
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Server nicht korrekt konfiguriert: SUPABASE_SERVICE_ROLE_KEY fehlt"
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
