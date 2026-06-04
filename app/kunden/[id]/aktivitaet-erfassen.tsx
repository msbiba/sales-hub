"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Calendar, Plus } from "lucide-react";

const TYPEN = [
  { value: "Anruf", label: "Anruf", icon: Phone },
  { value: "Termin", label: "Termin", icon: Calendar },
  { value: "E-Mail", label: "E-Mail", icon: Mail },
] as const;

export default function AktivitaetErfassen({ kundeId }: { kundeId: string }) {
  const router = useRouter();
  const [typ, setTyp] = useState<string>("Anruf");
  const [notiz, setNotiz] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/aktivitaeten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kunde_id: kundeId, typ, notiz }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Fehler beim Speichern");
        return;
      }

      setNotiz("");
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Netzwerkfehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-4">
      <h3 className="mb-3 font-semibold text-gray-900">
        Aktivität erfassen
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1">
          <label htmlFor="akt-typ" className="text-xs font-medium text-gray-600">
            Typ
          </label>
          <select
            id="akt-typ"
            value={typ}
            onChange={(e) => setTyp(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {TYPEN.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="akt-notiz" className="text-xs font-medium text-gray-600">
            Notiz
          </label>
          <input
            id="akt-notiz"
            type="text"
            value={notiz}
            onChange={(e) => setNotiz(e.target.value)}
            placeholder="Was wurde besprochen?"
            maxLength={1000}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {saving ? "Speichert…" : "Aktivität speichern"}
        </button>
      </form>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="mt-2 text-sm text-green-600">Aktivität gespeichert!</p>
      )}
    </div>
  );
}
