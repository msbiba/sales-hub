import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seite nicht gefunden · Solarwerk Sued",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="text-5xl font-bold text-gray-300">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Seite nicht gefunden
      </h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        Die angeforderte Seite existiert nicht oder wurde verschoben.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Zurück zum Dashboard
      </Link>
    </div>
  );
}
