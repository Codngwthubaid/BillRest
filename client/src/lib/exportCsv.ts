import Papa from "papaparse";

export function exportToCSV(data: any[], filename: string) {
  const flat = data.map(c => ({
    Name: c.name,
    Phone: c.phoneNumber,
    State: c.state ?? '',
    Invoices: c.invoices.length
  }));
  const csv = Papa.unparse(flat);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
