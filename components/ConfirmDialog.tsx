"use client";

export default function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Bestaetigen",
  cancelLabel = "Zurueck",
  onConfirm,
  onCancel,
  loading = false,
  errorText,
  variant = "danger",
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  errorText?: string | null;
  variant?: "danger" | "primary";
}) {
  if (!open) return null;

  const confirmCls =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700"
      : "bg-blue-600 hover:bg-blue-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mb-6 text-sm text-gray-700">{body}</p>
        {errorText && (
          <p className="mb-3 text-sm text-red-600">{errorText}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${confirmCls}`}
          >
            {loading ? "Bitte warten…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
