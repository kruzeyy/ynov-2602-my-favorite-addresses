export interface ExportAddress {
  id: number;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  createdAt?: string;
}

const CSV_HEADER = "id,name,description,lat,lng,createdAt";

function escapeCsvField(value: string | undefined): string {
  if (value === undefined || value === null) return "";
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function addressesToCsv(addresses: ExportAddress[]): string {
  const lines = [CSV_HEADER];
  for (const a of addresses) {
    lines.push(
      [
        a.id,
        escapeCsvField(a.name),
        escapeCsvField(a.description),
        a.lat,
        a.lng,
        escapeCsvField(a.createdAt),
      ].join(",")
    );
  }
  return lines.join("\n");
}

export function addressesToJson(addresses: ExportAddress[]): string {
  const payload = addresses.map((a) => ({
    id: a.id,
    name: a.name,
    description: a.description ?? null,
    lat: a.lat,
    lng: a.lng,
    createdAt: a.createdAt ?? null,
  }));
  return JSON.stringify(payload);
}
