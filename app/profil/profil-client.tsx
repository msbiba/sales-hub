"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export default function ProfilClient({ profile }: { profile: Profile }) {
  const [fullName, setFullName] = useState(profile.full_name ?? "");
  const [nameMsg, setNameMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [nameLoading, setNameLoading] = useState(false);

  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  async function saveName(e: React.FormEvent) {
    e.preventDefault();
    setNameMsg(null);
    setNameLoading(true);
    const res = await fetch("/api/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName }),
    });
    if (res.ok) {
      setNameMsg({ text: "Name gespeichert", ok: true });
    } else {
      const data = await res.json().catch(() => ({}));
      setNameMsg({ text: data.error ?? "Fehler beim Speichern", ok: false });
    }
    setNameLoading(false);
  }

  async function changePw(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pw1.length < 6) {
      setPwMsg({ text: "Passwort muss mindestens 6 Zeichen lang sein", ok: false });
      return;
    }
    if (pw1 !== pw2) {
      setPwMsg({ text: "Passwoerter stimmen nicht ueberein", ok: false });
      return;
    }
    setPwLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    if (error) {
      setPwMsg({ text: error.message, ok: false });
    } else {
      setPwMsg({ text: "Passwort geaendert", ok: true });
      setPw1("");
      setPw2("");
    }
    setPwLoading(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mein Profil</h1>
        <p className="text-sm text-gray-600">Persoenliche Daten und Passwort verwalten</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <div className="text-xs uppercase text-gray-500">E-Mail</div>
          <div className="text-sm text-gray-900">{profile.email}</div>
        </div>
        <div className="mb-4">
          <div className="text-xs uppercase text-gray-500">Rolle</div>
          <div className="text-sm text-gray-900 capitalize">{profile.role}</div>
        </div>

        <form onSubmit={saveName} className="border-t border-gray-100 pt-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Vollstaendiger Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            placeholder="Max Mustermann"
          />
          {nameMsg && (
            <div
              className={`mb-3 rounded-md border px-3 py-2 text-sm ${
                nameMsg.ok
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {nameMsg.text}
            </div>
          )}
          <button
            type="submit"
            disabled={nameLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {nameLoading ? "Speichere..." : "Name speichern"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Passwort aendern
        </h2>
        <form onSubmit={changePw}>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Neues Passwort
          </label>
          <input
            type="password"
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            minLength={6}
            className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Wiederholen
          </label>
          <input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            minLength={6}
            className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {pwMsg && (
            <div
              className={`mb-3 rounded-md border px-3 py-2 text-sm ${
                pwMsg.ok
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {pwMsg.text}
            </div>
          )}
          <button
            type="submit"
            disabled={pwLoading}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {pwLoading ? "Aendere..." : "Passwort aendern"}
          </button>
        </form>
      </div>
    </div>
  );
}
