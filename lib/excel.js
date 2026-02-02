import * as XLSX from 'xlsx';

export function generateExcel(data) {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Report");

    // Generate buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return buf;
}
