import type { Metadata } from "next";
import Link from "next/link";
import { getKunden } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kunden · Solarwerk Sued",
};

export default async function KundenPage({
  searchParams,
}: {
  searchParams: Promise<{ mock?: string }>;
}) {
  const params = await searchParams;
  const mockMode = params.mock ?? 'normal';
  const kunden = await getKunden(mockMode);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kunden</h1>
        <Link
          href="/kunden/neu"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Neuen Kunden anlegen
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Firma</th>
              <th className="px-4 py-3 font-medium text-gray-600">Ansprechpartner</th>
              <th className="px-4 py-3 font-medium text-gray-600">Branche</th>
              <th className="px-4 py-3 font-medium text-gray-600">Anlagengroesse (kWp)</th>
              <th className="px-4 py-3 font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 font-medium text-gray-600">Letzter Kontakt</th>
            </tr>
          </thead>
          <tbody>
            {kunden.map((kunde) => (
              <tr
                key={kunde.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/kunden/${kunde.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {kunde.firma}
                  </Link>
                </td>
                <td className="px-4 py-3">{kunde.ansprechpartner}</td>
                <td className="px-4 py-3">{kunde.branche}</td>
                <td className="px-4 py-3">{kunde.anlagengroesse_kwp}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      kunde.status === "aktiv"
                        ? "bg-green-100 text-green-700"
                        : kunde.status === "in_wartung"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {kunde.status === "aktiv"
                      ? "Aktiv"
                      : kunde.status === "in_wartung"
                        ? "In Wartung"
                        : "Beschwerde"}
                  </span>
                </td>
                <td className="px-4 py-3">{kunde.letzter_kontakt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {kunden.length === 0 && (
          <p className="px-4 py-8 text-center text-gray-400">
            Keine Kunden gefunden.
          </p>
        )}
      </div>
    </div>
  );
}
