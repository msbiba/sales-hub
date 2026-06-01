"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Kunde, KundenStatus } from "@/types";
import KundeStatusBadge from "@/components/KundeStatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";

type FormState = {
  firma: string;
  ansprechpartner: string;
  branche: string;
  anlagengroesse_kwp: string;
  status: KundenStatus;
  letzter_kontakt: string;
  telefon: string;
  email: string;
  notiz: string;
};

function toForm(k: Kunde): FormState {
  return {
    firma: k.firma ?? "",
    ansprechpartner: k.ansprechpartner ?? "",
    branche: k.branche ?? "",
    anlagengroesse_kwp:
      k.anlagengroesse_kwp == null ? "" : String(k.anlagengroesse_kwp),
    status: k.status,
    letzter_kontakt: k.letzter_kontakt ?? "",
    telefon: k.telefon ?? "",
    email: k.email ?? "",
    notiz: k.notiz ?? "",
  };
}

export default function KundeDetailClient({
  kunde,
  canEdit = true,
}: {
  kunde: Kunde;
  canEdit?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState>(toForm(kunde));
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
    setForm(toForm(kunde));
    setEditing(false);
    setError(null);
    setSuccess(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/kunden/${kunde.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setDeleteError(data.error || "Loeschen fehlgeschlagen");
        setDeleting(false);
        return;
      }
      router.push("/");
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
      const res = await fetch(`/api/kunden/${kunde.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          anlagengroesse_kwp:
            form.anlagengroesse_kwp === "" ? "" : Number(form.anlagengroesse_kwp),
        }),
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
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Zurueck zum Dashboard
      </Link>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{kunde.firma}</h1>
          <div className="flex items-center gap-3">
            <KundeStatusBadge status={kunde.status} size="md" />
            {!editing && canEdit && (
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
              <label className={labelCls}>Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  update("status", e.target.value as KundenStatus)
                }
                className={inputCls}
              >
                <option value="aktiv">Aktiv</option>
                <option value="in_wartung">In Wartung</option>
                <option value="beschwerde">Beschwerde</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Letzter Kontakt</label>
              <input
                type="date"
                value={form.letzter_kontakt}
                onChange={(e) => update("letzter_kontakt", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Telefon</label>
              <input
                type="text"
                value={form.telefon}
                onChange={(e) => update("telefon", e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>E-Mail</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputCls}
              />
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
                <p className="font-medium">{kunde.ansprechpartner}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Branche</p>
                <p className="font-medium">{kunde.branche}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Anlagengroesse</p>
                <p className="font-medium">{kunde.anlagengroesse_kwp} kWp</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Letzter Kontakt</p>
                <p className="font-medium">{kunde.letzter_kontakt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{kunde.telefon}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">E-Mail</p>
                <p className="font-medium">{kunde.email}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className={labelCls}>Notiz</p>
              <p className="whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                {kunde.notiz || "—"}
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

      {canEdit && (
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
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Kunde loeschen"
        body="Bist du sicher, dass dieser Kunde geloescht werden soll?"
        confirmLabel="Endgueltig loeschen"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        errorText={deleteError}
      />
    </div>
  );
}
