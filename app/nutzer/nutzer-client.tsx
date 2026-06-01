"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Trash2, RefreshCw, UserPlus, X } from "lucide-react";
import Avatar, { initials } from "./avatar";
import type { Profile, UserRole } from "@/types";

const ROLES: UserRole[] = ["admin", "bearbeiter", "buchhaltung"];

function formatDate(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toISOString().split("T")[0];
}

function toCsv(rows: Profile[]): string {
  const header = [
    "email",
    "full_name",
    "role",
    "is_active",
    "created_at",
    "last_login_at",
  ];
  const lines = [header.join(",")];
  for (const r of rows) {
    const cells = [
      r.email,
      r.full_name ?? "",
      r.role,
      r.is_active ? "true" : "false",
      r.created_at,
      r.last_login_at ?? "",
    ].map((c) => `"${String(c).replace(/"/g, '""')}"`);
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}

export default function NutzerClient({
  profiles,
  currentUserId,
}: {
  profiles: Profile[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return profiles.filter((p) => {
      if (roleFilter !== "all" && p.role !== roleFilter) return false;
      if (!term) return true;
      return (
        p.email.toLowerCase().includes(term) ||
        (p.full_name ?? "").toLowerCase().includes(term)
      );
    });
  }, [profiles, search, roleFilter]);

  const stats = useMemo(() => {
    const active = profiles.filter((p) => p.is_active).length;
    const rolesPresent = new Set(profiles.map((p) => p.role));
    return {
      total: profiles.length,
      active,
      rolesCount: rolesPresent.size,
    };
  }, [profiles]);

  async function changeRole(id: string, role: UserRole) {
    setError(null);
    const res = await fetch(`/api/nutzer/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Fehler beim Aendern der Rolle");
      return;
    }
    router.refresh();
  }

  async function toggleActive(id: string, is_active: boolean) {
    setError(null);
    const res = await fetch(`/api/nutzer/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Fehler beim Status-Wechsel");
      return;
    }
    router.refresh();
  }

  function exportCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutzer_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nutzermanagement</h1>
          <p className="text-sm text-gray-600">
            Nutzer verwalten, Rollen zuweisen und Zugriffsrechte steuern
          </p>
        </div>
        <button
          onClick={() => setInviteOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          <UserPlus className="h-4 w-4" /> Nutzer einladen
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Gesamte Nutzer" value={String(stats.total)} hint="Alle registrierten Accounts" />
        <StatCard label="Aktive Nutzer" value={String(stats.active)} hint="Accounts mit Login-Zugang" />
        <StatCard
          label="Rollen verteilt"
          value={String(stats.rolesCount)}
          hint="admin / bearbeiter / buchhaltung"
        />
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 p-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nutzer suchen ..."
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "all" | UserRole)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">Alle Rollen</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            onClick={exportCsv}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            &lt;/&gt; Export CSV
          </button>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Nutzer</th>
              <th className="px-4 py-2 text-left font-medium">Rolle</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Erstellt am</th>
              <th className="px-4 py-2 text-right font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  Keine Nutzer gefunden
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const isSelf = p.id === currentUserId;
              return (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar fullName={p.full_name} email={p.email} />
                      <div>
                        <div className="font-medium text-gray-900">
                          {p.full_name ?? initials(null, p.email)}
                        </div>
                        <div className="text-xs text-gray-500">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.role}
                      disabled={isSelf}
                      onChange={(e) => changeRole(p.id, e.target.value as UserRole)}
                      className="rounded-md border border-gray-300 px-2 py-1 text-sm capitalize disabled:opacity-50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          p.is_active ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      {p.is_active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setDetailUser(p)}
                        className="rounded p-1.5 text-gray-500 hover:bg-gray-100"
                        aria-label="Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {p.is_active ? (
                        <button
                          onClick={() => toggleActive(p.id, false)}
                          disabled={isSelf}
                          className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                          aria-label="Deaktivieren"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleActive(p.id, true)}
                          className="rounded p-1.5 text-gray-500 hover:bg-green-50 hover:text-green-600"
                          aria-label="Reaktivieren"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {inviteOpen && (
        <InviteModal
          onClose={() => setInviteOpen(false)}
          onSuccess={() => {
            setInviteOpen(false);
            router.refresh();
          }}
        />
      )}

      {detailUser && (
        <DetailModal user={detailUser} onClose={() => setDetailUser(null)} />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 text-3xl font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-xs text-gray-500">{hint}</div>
    </div>
  );
}

function InviteModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"" | UserRole>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!role) {
      setError("Rolle ist Pflicht");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/nutzer/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Einladung fehlgeschlagen");
      setLoading(false);
      return;
    }
    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Nutzer einladen</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Schliessen">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <label className="mb-1 block text-sm font-medium text-gray-700">E-Mail-Adresse</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="nutzer@beispiel.de"
          className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />

        <label className="mb-1 block text-sm font-medium text-gray-700">Rolle zuweisen</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole | "")}
          required
          className="mb-4 w-full rounded-md border border-gray-300 px-3 py-2 text-sm capitalize"
        >
          <option value="">Rolle waehlen...</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {error && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {loading ? "Sende..." : "Einladung senden"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DetailModal({ user, onClose }: { user: Profile; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Nutzer-Details</h2>
          <button type="button" onClick={onClose} aria-label="Schliessen">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-4 flex items-center gap-4">
          <Avatar fullName={user.full_name} email={user.email} size="lg" />
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {user.full_name ?? user.email.split("@")[0]}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>

        <dl className="space-y-2 text-sm">
          <Row label="Rolle" value={user.role} />
          <Row label="Status" value={user.is_active ? "Aktiv" : "Inaktiv"} />
          <Row label="Erstellt am" value={formatDate(user.created_at)} />
          <Row label="Zuletzt eingeloggt" value={formatDate(user.last_login_at)} />
        </dl>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
          >
            Schliessen
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900 capitalize">{value}</dd>
    </div>
  );
}
