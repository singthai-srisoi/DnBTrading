/**
 * Escape a single CSV cell value: wrap in quotes and double any embedded quotes
 * whenever the value contains a comma, quote, or newline.
 */
function escapeCsvCell(value: string | number | null | undefined): string {
	const str = value === null || value === undefined ? '' : String(value);
	if (/[",\n\r]/.test(str)) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

/**
 * Build a CSV string from a header row and data rows, then trigger a browser
 * download. Intended for exporting report tables to CSV directly from the client.
 */
export function downloadCsv(
	filename: string,
	headers: string[],
	rows: (string | number | null | undefined)[][]
) {
	const lines = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(','));
	const csvContent = lines.join('\r\n');

	// Prefix with BOM so Excel opens UTF-8 content correctly
	const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
