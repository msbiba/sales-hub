"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  const links = userRole
    ? ALL_LINKS.filter((l) => l.roles.includes(userRole))
    : [];

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="whitespace-nowrap text-lg font-semibold text-gray-900"
        >
          Solarwerk Sued &middot; Sales-Hub
        </Link>

        {userEmail && (
          <nav className="hidden md:flex md:gap-6">
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
                className="hidden text-sm text-gray-500 hover:text-gray-900 md:inline"
              >
                {userEmail}
              </Link>
              <form action="/logout" method="post" className="hidden md:block">
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
          {userEmail && (
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menü"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="rounded-md p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 md:hidden"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {userEmail && menuOpen && (
        <nav
          id="mobile-nav"
          className="flex flex-col gap-1 border-t border-gray-200 px-6 py-3 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`rounded-md px-2 py-2 text-sm font-medium ${
                pathname === link.href
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/profil"
            onClick={() => setMenuOpen(false)}
            className="rounded-md px-2 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          >
            {userEmail}
          </Link>
          <form action="/logout" method="post">
            <button
              type="submit"
              className="w-full rounded-md px-2 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              Logout
            </button>
          </form>
        </nav>
      )}
    </header>
  );
}
