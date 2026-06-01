"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import type { UserRole } from "@/types";

type NavLink = { href: string; label: string; roles: UserRole[] };

const ALL_LINKS: NavLink[] = [
  { href: "/", label: "Dashboard", roles: ["admin", "bearbeiter", "buchhaltung"] },
  { href: "/pipeline", label: "Pipeline", roles: ["admin", "bearbeiter", "buchhaltung"] },
  { href: "/berichte", label: "Berichte", roles: ["admin", "buchhaltung"] },
  { href: "/kunden/neu", label: "Neuer Kunde", roles: ["admin", "bearbeiter"] },
  { href: "/nutzer", label: "Nutzer", roles: ["admin"] },
];

export default function Navigation({
  userEmail,
  userRole,
}: {
  userEmail: string | null;
  userRole: UserRole | null;
}) {
  const pathname = usePathname();

  const links = userRole
    ? ALL_LINKS.filter((l) => l.roles.includes(userRole))
    : [];

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900">
          Solarwerk Sued &middot; Sales-Hub
        </Link>

        {userEmail && (
          <nav className="flex gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium ${
                  pathname === link.href
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {userEmail ? (
            <>
              <Link
                href="/profil"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                {userEmail}
              </Link>
              <form action="/logout" method="post">
                <button
                  type="submit"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Anmelden
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
