import type { Property } from "@/lib/types";

const COLUMNS: { key: keyof Property; label: string }[] = [
  { key: "id", label: "ID" },
  { key: "squareFootage", label: "Sq Ft" },
  { key: "bedrooms", label: "Beds" },
  { key: "bathrooms", label: "Baths" },
  { key: "yearBuilt", label: "Year" },
  { key: "lotSize", label: "Lot" },
  { key: "distanceToCityCenter", label: "Distance" },
  { key: "schoolRating", label: "School" },
  { key: "price", label: "Price" },
];

// Export properties to CSV.
export function exportCsv(rows: Property[], filename = "properties.csv") {
  const header = COLUMNS.map((c) => c.label).join(",");
  const lines = rows.map((r) => COLUMNS.map((c) => r[c.key]).join(","));
  const csv = [header, ...lines].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(URL.createObjectURL(blob), filename);
}

// Export properties to PDF (lazy-loaded).
export async function exportPdf(rows: Property[], filename = "properties.pdf") {
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();
  doc.text("Property Market Report", 14, 16);
  autoTable(doc, {
    startY: 22,
    head: [COLUMNS.map((c) => c.label)],
    body: rows.map((r) => COLUMNS.map((c) => String(r[c.key]))),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });
  doc.save(filename);
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
