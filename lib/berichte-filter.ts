export type BerichteFilter = {
  ks: string | null; // Kunden-Status
  ps: string | null; // Pipeline-Status
  bs: string | null; // Bearbeiter
};

export function parseFilter(params: {
  ks?: string;
  ps?: string;
  bs?: string;
}): BerichteFilter {
  return {
    ks: params.ks ?? null,
    ps: params.ps ?? null,
    bs: params.bs ?? null,
  };
}

export function isFilterActive(filter: BerichteFilter): boolean {
  return !!(filter.ks || filter.ps || filter.bs);
}
