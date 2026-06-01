import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center">
        <div className="mb-2 text-4xl font-bold text-gray-900">403</div>
        <h1 className="mb-3 text-lg font-semibold text-gray-900">
          Zugriff verweigert
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Du hast keine Berechtigung fuer diese Seite. Falls du der Meinung
          bist, dass das ein Fehler ist, wende dich an einen Admin.
        </p>
        <Link
          href="/"
          className="inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Zurueck zum Dashboard
        </Link>
      </div>
    </div>
  );
}
