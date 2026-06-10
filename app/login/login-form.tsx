"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

function safeRedirect(raw: string | null): string {
  if (!raw) return "/";
  if (!raw.startsWith("/")) return "/";
  if (raw.startsWith("//")) return "/";
  return raw;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirect(searchParams.get("redirect"));
  const inactiveBanner = searchParams.get("inactive") === "1";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState<string | null>(null);
  const [laedt, setLaedt] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFehler(null);
    setLaedt(true);

    const supabase = createSupabaseBrowserClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: passwort,
      });
      if (error) {
        setFehler(error.message);
        setLaedt(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password: passwort,
      });
      if (error) {
        setFehler(error.message);
        setLaedt(false);
        return;
      }
    }

    // last_login_at updaten (throttled, fire-and-forget)
    fetch("/api/login-hook", { method: "POST" }).catch(() => {});

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8"
      >
        <h1 className="mb-6 text-center text-xl font-bold">
          {mode === "signin" ? "Anmelden" : "Registrieren"}
        </h1>

        {inactiveBanner && (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Dein Account ist inaktiv. Bitte kontaktiere einen Admin.
          </div>
        )}

        <div className="mb-4 flex rounded-md border border-gray-200 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setFehler(null);
            }}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${
              mode === "signin"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Anmelden
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setFehler(null);
            }}
            className={`flex-1 rounded px-3 py-1.5 text-sm font-medium ${
              mode === "signup"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Registrieren
          </button>
        </div>

        <div className="mb-4">
          <label
            htmlFor="login-email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            E-Mail
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="felix@solarwerk-sued.de"
          />
        </div>
        <div className="mb-2">
          <label
            htmlFor="login-passwort"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Passwort
          </label>
          <input
            id="login-passwort"
            type="password"
            value={passwort}
            onChange={(e) => setPasswort(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {mode === "signin" && (
          <div className="mb-4 text-right">
            <Link
              href="/passwort-reset"
              className="text-xs text-blue-600 hover:underline"
            >
              Passwort vergessen?
            </Link>
          </div>
        )}

        {fehler && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {fehler}
          </div>
        )}

        <button
          type="submit"
          disabled={laedt}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {laedt
            ? "Bitte warten..."
            : mode === "signin"
            ? "Einloggen"
            : "Konto anlegen"}
        </button>
      </form>
    </div>
  );
}
