"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PipelineEintrag, PipelineStatus } from "@/types";
import { BEARBEITER_LISTE } from "@/lib/validation";
import ConfirmDialog from "@/components/ConfirmDialog";

type FormState = {
  firma: string;
  ansprechpartner: string;
  branche: string;
  anlagengroesse_kwp: string;
  volumen_eur: string;
  angebotsdatum: string;
  status: PipelineStatus | "";
  notiz: string;
  bearbeiter: string;
};

function toForm(e: PipelineEintrag): FormState {
  return {
    firma: e.firma ?? "",
    ansprechpartner: e.ansprechpartner ?? "",
    branche: e.branche ?? "",
    anlagengroesse_kwp:
      e.anlagengroesse_kwp == null ? "" : String(e.anlagengroesse_kwp),
    volumen_eur: e.volumen_eur == null ? "" : String(e.volumen_eur),
    angebotsdatum: e.angebotsdatum ?? "",
    status: e.status ?? "",
    notiz: e.notiz ?? "",
    bearbeiter: e.bearbeiter ?? "",
  };
}

function statusLabel(s: PipelineStatus) {
  switch (s) {
    case "erstkontakt":
      return "Erstkontakt";
    case "angebot_raus":
      return "Angebot raus";
    case "verhandlung":
      return "Verhandlung";
    case "gewonnen":
      return "Gewonnen";
    case "verloren":
      return "Verloren";
    case "loeschbar":
      return "Loeschbar";
  }
}

function statusClass(s: PipelineStatus) {
  switch (s) {
    case "erstkontakt":
      return "bg-gray-100 text-gray-700";
    case "angebot_raus":
      return "bg-blue-100 text-blue-700";
    case "verhandlung":
      return "bg-orange-100 text-orange-700";
    case "gewonnen":
      return "bg-green-100 text-green-700";
    case "verloren":
      return "bg-red-100 text-red-700";
    case "loeschbar":
      return "bg-yellow-100 text-yellow-700";
  }
}

const formatEur = (n: number) =>
  new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export default function PipelineDetailClient({
  eintrag,
}: {
  eintrag: PipelineEintrag;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>(toForm(eintrag));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSuccess(false);
    setError(null);
  };

  const handleCancel = () => {
    setForm(toForm(eintrag));
    setEditing(false);
    setError(null);
    setSuccess(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/pipeline/${eintrag.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.error || "Loeschen fehlgeschlagen");
        setDeleting(false);
        return;
      }
      router.push("/pipeline");
      router.refresh();
    } catch {
      setDeleteError("Loeschen fehlgeschlagen, bitte erneut versuchen");
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/pipeline/${eintrag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Speichern fehlgeschlagen");
        return;
      }
      setSuccess(true);
      setEditing(false);
      router.refresh();
    } catch {
      setError("Speichern fehlgeschlagen, bitte erneut versuchen");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";
  const labelCls = "mb-1 block text-sm text-gray-500";

  return (
    <div>
      <Link
        href="/pipeline"
        className="mb-6 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurueck zur Pipeline
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{eintrag.firma}</h1>
          <div className="flex items-center gap-3">
            <span
              className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${statusClass(
                eintrag.status
              )}`}
            >
              {statusLabel(eintrag.status)}
            </span>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Bearbeiten
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Firma</label>
              <input
                type="text"
                value={form.firma}
                onChange={(e) => update("firma", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Ansprechpartner</label>
              <input
                type="text"
                value={form.ansprechpartner}
                onChange={(e) => update("ansprechpartner", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Branche</label>
              <input
                type="text"
                value={form.branche}
                onChange={(e) => update("branche", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Anlagengroesse (kWp)</label>
              <input
                type="number"
                value={form.anlagengroesse_kwp}
                onChange={(e) => update("anlagengroesse_kwp", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Volumen (EUR)</label>
              <input
                type="number"
                value={form.volumen_eur}
                onChange={(e) => update("volumen_eur", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Angebotsdatum</label>
              <input
                type="date"
                value={form.angebotsdatum}
                onChange={(e) => update("angebotsdatum", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  update("status", e.target.value as PipelineStatus)
                }
                className={inputCls}
              >
                <option value="">Bitte waehlen…</option>
                <option value="erstkontakt">Erstkontakt</option>
                <option value="angebot_raus">Angebot raus</option>
                <option value="verhandlung">Verhandlung</option>
                <option value="gewonnen">Gewonnen</option>
                <option value="verloren">Verloren</option>
                <option value="loeschbar">Loeschbar</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Bearbeiter</label>
              <select
                value={form.bearbeiter}
                onChange={(e) => update("bearbeiter", e.target.value)}
                className={inputCls}
              >
                <option value="">Bitte waehlen…</option>
                {BEARBEITER_LISTE.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Notiz</label>
              <textarea
                value={form.notiz}
                onChange={(e) => update("notiz", e.target.value)}
                rows={3}
                className={inputCls}
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Speichere..." : "Aenderungen speichern"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Abbrechen
              </button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Ansprechpartner</p>
                <p className="font-medium">{eintrag.ansprechpartner}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branche</p>
                <p className="font-medium">{eintrag.branche}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Anlagengroesse</p>
                <p className="font-medium">{eintrag.anlagengroesse_kwp} kWp</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Volumen</p>
                <p className="font-medium">{formatEur(eintrag.volumen_eur)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Angebotsdatum</p>
                <p className="font-medium">{eintrag.angebotsdatum}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bearbeiter</p>
                <p className="font-medium">{eintrag.bearbeiter}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className={labelCls}>Notiz</p>
              <p className="whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                {eintrag.notiz || "—"}
              </p>
            </div>

            {success && (
              <p className="mt-4 text-sm text-green-600">
                Aenderungen gespeichert.
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setDeleteError(null);
            setConfirmDelete(true);
          }}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Loeschen
        </button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Pipeline-Eintrag loeschen"
        body="Bist du sicher, dass dieser Pipeline-Eintrag geloescht werden soll?"
        confirmLabel="Endgueltig loeschen"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        errorText={deleteError}
      />
    </div>
  );
}
