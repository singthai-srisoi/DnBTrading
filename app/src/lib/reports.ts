export const reportGroups = ['product', 'customer', 'supplier', 'driver', 'vehicle'] as const;
export type ReportGroup = (typeof reportGroups)[number];
export type ReportFilters = {
	startDate: string;
	endDate: string;
	groupBy: ReportGroup | '';
	unit: 'kg' | 'ton' | '';
	excluded: Record<ReportGroup, number[]>;
};
export const reportColumns = [
	['date', 'Date'],
	['vehicle', 'Vehicle'],
	['driver', 'Driver'],
	['supplier', 'Supplier'],
	['customerTicketNo', 'Customer Ticket No'],
	['supplierQty', 'Supplier Qty'],
	['customer', 'Customer'],
	['product', 'Product'],
	['ticketNo', 'Ticket No'],
	['do', 'DO'],
	['weightIn', 'Weight In'],
	['weightOut', 'Weight Out'],
	['factoryNett', 'Factory Nett'],
	['bucket', 'Bucket'],
	['deduction', 'Deduction'],
	['nett', 'Nett'],
	['remark', 'Remark'],
	['unit', 'Unit']
] as const;
export type ReportColumn = (typeof reportColumns)[number][0];
export const numericColumns = new Set<string>([
	'supplierQty',
	'weightIn',
	'weightOut',
	'factoryNett',
	'bucket',
	'deduction',
	'nett'
]);
export type ReportRow = Partial<Record<ReportColumn, string | number | null>> & {
	kind: 'detail' | 'subtotal' | 'total';
	label?: string;
};

export function reportCsv(
	rows: ReportRow[],
	format: (value: string | number | null | undefined) => string
) {
	function escape(value: string) {
		// Prevent spreadsheet applications interpreting user-entered text as formulas.
		const safe = /^[\s]*[=+@-]/.test(value) ? `'${value}` : value;
		return `"${safe.replaceAll('"', '""')}"`;
	}
	return (
		'\uFEFF' +
		[
			reportColumns
				.map(([, label]) => label)
				.map(escape)
				.join(','),
			...rows.map((row) =>
				[
					...reportColumns.map(([key]) => {
						if (key === 'date' && row.kind !== 'detail') return escape(row.label ?? '');
						const value = row[key];
						if (value == null) return '""';
						return numericColumns.has(key) ? format(value) : escape(String(value));
					})
				].join(',')
			)
		].join('\r\n')
	);
}
